import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  sampleCategories,
  sampleAccounts,
  sampleBudgets,
  generateSampleTransactions,
} from "@/lib/seed-data";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already has data
    const existingData = await prisma.category.count({
      where: { userId: user.id },
    });

    if (existingData > 0) {
      return NextResponse.json(
        { error: "User already has data. Clear existing data first." },
        { status: 400 }
      );
    }

    // We need to capture the counts before the transaction closes
    let counts = {
      categories: sampleCategories.length,
      accounts: sampleAccounts.length,
      budgets: sampleBudgets.length,
      transactions: 0,
    };

    await prisma.$transaction(
      async (tx) => {
        // 1. Create categories
        const createdCategories = await Promise.all(
          sampleCategories.map((category) =>
            tx.category.create({
              data: { ...category, userId: user.id },
            })
          )
        );

        // 2. Create accounts with initial balance
        const createdAccounts = await Promise.all(
          sampleAccounts.map((account) =>
            tx.bankAccount.create({
              data: { ...account, userId: user.id },
            })
          )
        );

        // 3. create budgets and link them to the correct categories
        for (const budget of sampleBudgets) {
          // Find the ids of the categories this budget should track
          const categoriesToLink = createdCategories.filter((c) =>
            budget.categoryNames.includes(c.name)
          );
          const categoryIdsToLink = categoriesToLink.map((c) => c.id);

          const newBudget = await tx.budget.create({
            data: {
              name: budget.name,
              amount: budget.amount,
              period: budget.period,
              startDate: budget.startDate,
              endDate: budget.endDate,
              userId: user.id,
            },
          });

          // Link the found categories to the newly created budget
          if (categoryIdsToLink.length > 0) {
            await tx.category.updateMany({
              where: { id: { in: categoryIdsToLink } },
              data: { budgetId: newBudget.id },
            });
          }
        }

        // 4. Generate and Create Transactions
        // Create the correct data structure for the generator function
        const categoryInfoForGeneration = createdCategories.map((c) => ({
          id: c.id,
          type: c.type,
        }));
        const accountIds = createdAccounts.map((a) => a.id);
        const sampleTransactions = generateSampleTransactions(
          categoryInfoForGeneration,
          accountIds
        );

        counts.transactions = sampleTransactions.length;

        // Create the transactions
        await tx.transaction.createMany({
          data: sampleTransactions.map((t) => ({ ...t, userId: user.id })),
        });

        // 5. Update Account Balances correctly based on ALL created transactions
        for (const account of createdAccounts) {
          const { _sum: incomeSum } = await tx.transaction.aggregate({
            _sum: { amount: true },
            where: { accountId: account.id, type: "INCOME" },
          });
          const totalIncome = incomeSum.amount || 0;

          const { _sum: expenseSum } = await tx.transaction.aggregate({
            _sum: { amount: true },
            where: { accountId: account.id, type: "EXPENSE" },
          });
          const totalExpenses = expenseSum.amount || 0;

          // The final balance is the initial balance from seed data + total income - total expenses
          const finalBalance = account.balance + totalIncome - totalExpenses;

          await tx.bankAccount.update({
            where: { id: account.id },
            data: { balance: finalBalance },
          });
        }
      },
      {
        timeout: 30000,
      }
    );

    return NextResponse.json({
      message: "Sample data created successfully",
      data: counts,
    });
  } catch (error) {
    console.error("Seed data error:", error);

    if (error instanceof Error && error.message.includes("P2028")) {
      return NextResponse.json(
        {
          error:
            "Database transaction timed out. This can happen on a cold start. Please try again.",
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create sample data" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // A transaction ensures all related data is deleted successfully.
    await prisma.$transaction(
      async (tx) => {
        // Order is important to respect foreign key constraints
        await tx.transaction.deleteMany({ where: { userId: user.id } });
        // Unlink categories from budgets before deleting budgets
        await tx.category.updateMany({
          where: { userId: user.id },
          data: { budgetId: null },
        });
        await tx.budget.deleteMany({ where: { userId: user.id } });
        await tx.category.deleteMany({ where: { userId: user.id } });
        await tx.bankAccount.deleteMany({ where: { userId: user.id } });
      },
      {
        timeout: 30000,
      }
    );

    return NextResponse.json({ message: "All user data deleted successfully" });
  } catch (error) {
    console.error("Delete data error:", error);
    return NextResponse.json(
      { error: "Failed to delete user data" },
      { status: 500 }
    );
  }
}
