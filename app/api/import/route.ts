import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Papa from "papaparse";

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

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileContent = await file.text();

    const parsedData = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

    const transactionsToCreate: any[] = parsedData.data;
    let createdCount = 0;

    // Use a transaction to ensure all or nothing gets created
    await prisma.$transaction(async (tx) => {
      for (const row of transactionsToCreate) {
        const {
          Date: date,
          Description,
          Amount,
          Type,
          Category: categoryName,
          Account: accountName,
        } = row as any;

        if (
          !date ||
          !Description ||
          !Amount ||
          !Type ||
          !categoryName ||
          !accountName
        ) {
          console.warn("Skipping invalid row:", row);
          continue;
        }

        // Find or create Category
        let category = await tx.category.findFirst({
          where: { name: categoryName, userId: user.id },
        });
        if (!category) {
          category = await tx.category.create({
            data: {
              name: categoryName,
              type: Type.toUpperCase() === "INCOME" ? "INCOME" : "EXPENSE",
              userId: user.id,
            },
          });
        }

        // Find or create Bank Account
        let account = await tx.bankAccount.findFirst({
          where: { name: accountName, userId: user.id },
        });
        if (!account) {
          account = await tx.bankAccount.create({
            data: {
              name: accountName,
              userId: user.id,
              balance: 0,
            },
          });
        }

        // Create the transaction
        const newTransaction = await tx.transaction.create({
          data: {
            date: new Date(date),
            description: Description,
            amount: Number.parseFloat(Amount),
            type: Type.toUpperCase() === "INCOME" ? "INCOME" : "EXPENSE",
            userId: user.id,
            categoryId: category.id,
            accountId: account.id,
          },
        });

        // Update the account balance
        await tx.bankAccount.update({
          where: { id: account.id },
          data: {
            balance: {
              increment:
                newTransaction.type === "INCOME"
                  ? newTransaction.amount
                  : -newTransaction.amount,
            },
          },
        });

        createdCount++;
      }
    });

    return NextResponse.json({
      message: `Successfully imported ${createdCount} transactions.`,
    });
  } catch (error) {
    console.error("Import failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
