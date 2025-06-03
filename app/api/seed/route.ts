import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sampleCategories, sampleAccounts, sampleBudgets, generateSampleTransactions } from "@/lib/seed-data"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user already has data
    const existingCategories = await prisma.category.count({
      where: { userId: user.id },
    })

    if (existingCategories > 0) {
      return NextResponse.json({ error: "User already has data. Clear existing data first." }, { status: 400 })
    }

    // Create categories
    const categories = await Promise.all(
      sampleCategories.map((category) =>
        prisma.category.create({
          data: {
            ...category,
            userId: user.id,
          },
        }),
      ),
    )

    // Create accounts
    const accounts = await Promise.all(
      sampleAccounts.map((account) =>
        prisma.bankAccount.create({
          data: {
            ...account,
            userId: user.id,
          },
        }),
      ),
    )

    // Create budgets
    const budgets = await Promise.all(
      sampleBudgets.map((budget) =>
        prisma.budget.create({
          data: {
            ...budget,
            userId: user.id,
          },
        }),
      ),
    )

    // Generate sample transactions
    const categoryIds = categories.map((c) => c.id)
    const accountIds = accounts.map((a) => a.id)
    const sampleTransactions = generateSampleTransactions(categoryIds, accountIds)

    // Create transactions
    const transactions = await Promise.all(
      sampleTransactions.map((transaction) =>
        prisma.transaction.create({
          data: {
            ...transaction,
            userId: user.id,
          },
        }),
      ),
    )

    // Update account balances based on transactions
    for (const account of accounts) {
      const accountTransactions = transactions.filter((t) => t.accountId === account.id)
      const balance = accountTransactions.reduce((sum, t) => {
        return sum + (t.type === "INCOME" ? t.amount : -t.amount)
      }, account.balance)

      await prisma.bankAccount.update({
        where: { id: account.id },
        data: { balance },
      })
    }

    // Update budget spent amounts
    for (const budget of budgets) {
      const budgetTransactions = transactions.filter(
        (t) => t.type === "EXPENSE" && new Date(t.date) >= budget.startDate && new Date(t.date) <= budget.endDate,
      )

      const spent = budgetTransactions.reduce((sum, t) => sum + t.amount, 0)

      await prisma.budget.update({
        where: { id: budget.id },
        data: { spent },
      })
    }

    return NextResponse.json({
      message: "Sample data created successfully",
      data: {
        categories: categories.length,
        accounts: accounts.length,
        budgets: budgets.length,
        transactions: transactions.length,
      },
    })
  } catch (error) {
    console.error("Seed data error:", error)
    return NextResponse.json({ error: "Failed to create sample data" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete all user data (in correct order due to foreign key constraints)
    await prisma.transaction.deleteMany({ where: { userId: user.id } })
    await prisma.budget.deleteMany({ where: { userId: user.id } })
    await prisma.category.deleteMany({ where: { userId: user.id } })
    await prisma.bankAccount.deleteMany({ where: { userId: user.id } })

    return NextResponse.json({ message: "All user data deleted successfully" })
  } catch (error) {
    console.error("Delete data error:", error)
    return NextResponse.json({ error: "Failed to delete user data" }, { status: 500 })
  }
}
