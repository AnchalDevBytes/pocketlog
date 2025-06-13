import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
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

    const budgetsFromDb = await prisma.budget.findMany({
      where: { userId: user.id },
      include: {
        categories: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!budgetsFromDb || budgetsFromDb.length === 0) {
      return NextResponse.json([]);
    }

    const budgetsWithSpent = await Promise.all(
      budgetsFromDb.map(async (budget) => {
        const categoryIds = budget.categories.map((cat) => cat.id);

        if (categoryIds.length === 0) {
          return { ...budget, spent: 0 };
        }

        const result = await prisma.transaction.aggregate({
          _sum: { amount: true },
          where: {
            userId: user.id,
            type: "EXPENSE",
            categoryId: { in: categoryIds }, // Sum transactions from any of the budget's categories
            date: {
              gte: budget.startDate,
              lte: budget.endDate,
            },
          },
        });

        const spent = result._sum.amount || 0;
        return { ...budget, spent };
      })
    );

    return NextResponse.json(budgetsWithSpent);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    const body = await request.json();
    const { name, amount, period, startDate, endDate, categoryIds } = body;

    if (!categoryIds || categoryIds.length === 0) {
      return NextResponse.json(
        { error: "At least one category is required" },
        { status: 400 }
      );
    }

    const budget = await prisma.budget.create({
      data: {
        name,
        amount: Number.parseFloat(amount),
        period: period || "MONTHLY",
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId: user.id,
      },
    });

    await prisma.category.updateMany({
      where: {
        id: { in: categoryIds },
        userId: user.id, // Security check
      },
      data: {
        budgetId: budget.id,
      },
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.error("Error creating budget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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

    const body = await request.json();
    const { id, name, amount, period, startDate, endDate, categoryIds } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Budget ID is required" },
        { status: 400 }
      );
    }

    //To ensure user owns the budget
    const existingBudget = await prisma.budget.findFirst({
      where: { id, userId: user.id },
      include: { categories: { select: { id: true } } },
    });
    if (!existingBudget) {
      return NextResponse.json(
        { error: "Budget not found or access denied" },
        { status: 404 }
      );
    }

    // Transaction to ensure data integrity
    await prisma.$transaction(async (tx) => {
      // 1. Update the budget details
      await tx.budget.update({
        where: { id },
        data: {
          name,
          amount: amount ? Number.parseFloat(amount) : undefined,
          period,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined,
        },
      });

      // 2. Unlink all old categories from this budget
      const oldCategoryIds = existingBudget.categories.map((cat) => cat.id);
      await tx.category.updateMany({
        where: { id: { in: oldCategoryIds } },
        data: { budgetId: null },
      });

      // 3. Link all new categories to this budget
      await tx.category.updateMany({
        where: { id: { in: categoryIds } },
        data: { budgetId: id },
      });
    });

    return NextResponse.json({ id, ...body });
  } catch (error) {
    console.error("Error updating budget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Budget ID is required" },
        { status: 400 }
      );
    }

    const existingBudget = await prisma.budget.findFirst({
      where: { id, userId: user.id },
    });
    if (!existingBudget) {
      return NextResponse.json(
        { error: "Budget not found or access denied" },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      // 1. Unlink all categories associated with this budget
      await tx.category.updateMany({
        where: { budgetId: id },
        data: { budgetId: null },
      });

      // 2. Delete the budget itself
      await tx.budget.delete({
        where: { id },
      });
    });

    return NextResponse.json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Error deleting budget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
