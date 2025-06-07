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

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      include: {
        category: true,
        account: true,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
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
    const { amount, description, type, categoryId, accountId, date } = body;

    const transaction = await prisma.transaction.create({
      data: {
        amount: Number.parseFloat(amount),
        description,
        type,
        categoryId,
        accountId,
        userId: user.id,
        date: date ? new Date(date) : new Date(),
      },
      include: {
        category: true,
        account: true,
      },
    });

    // Update account balance
    await prisma.bankAccount.update({
      where: { id: accountId },
      data: {
        balance: {
          increment:
            type === "INCOME"
              ? Number.parseFloat(amount)
              : -Number.parseFloat(amount),
        },
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
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

    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    await prisma.transaction.delete({
      where: { id },
      include: {
        category: true,
        account: true,
      },
    });

    // Update account balance
    await prisma.bankAccount.update({
      where: { id: transaction.accountId },
      data: {
        balance: {
          increment:
            transaction.type === "INCOME"
              ? -transaction.amount
              : transaction.amount,
        },
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "Error deleting transaction" },
        { status: 500 }
      );
    }
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
    const { id, amount, description, type, categoryId, accountId, date } = body;

    const existing = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Revert old transaction amount from the previous account
    await prisma.bankAccount.update({
      where: { id: existing.accountId },
      data: {
        balance: {
          increment:
            existing.type === "INCOME" ? -existing.amount : existing.amount,
        },
      },
    });

    // Apply new transaction amount to the new account
    await prisma.bankAccount.update({
      where: { id: accountId },
      data: {
        balance: {
          increment:
            type === "INCOME"
              ? Number.parseFloat(amount)
              : -Number.parseFloat(amount),
        },
      },
    });

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount: Number.parseFloat(amount),
        description,
        type,
        categoryId,
        accountId,
        userId: user.id,
        date: new Date(date),
      },
      include: {
        category: true,
        account: true,
      },
    });

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json(
        { error: "Error updating transaction" },
        { status: 500 }
      );
    }
  }
}
