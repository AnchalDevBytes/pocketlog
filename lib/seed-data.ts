import {
  CategoryType,
  AccountType,
  BudgetPeriod,
  TransactionType,
} from "@prisma/client";

interface SampleCategory {
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
}

interface SampleAccount {
  name: string;
  balance: number;
  type: AccountType;
}

interface SampleBudget {
  name: string;
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
  categoryNames: string[];
}

export const sampleCategories: SampleCategory[] = [
  // Income Categories
  { name: "Salary", icon: "💰", color: "#10B981", type: CategoryType.INCOME },
  {
    name: "Freelance",
    icon: "💻",
    color: "#059669",
    type: CategoryType.INCOME,
  },
  // Expense Categories
  {
    name: "Groceries",
    icon: "🛒",
    color: "#3B82F6",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Dining Out",
    icon: "🍔",
    color: "#EF4444",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Transportation",
    icon: "🚗",
    color: "#F97316",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Shopping",
    icon: "🛍️",
    color: "#8B5CF6",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Entertainment",
    icon: "🎬",
    color: "#EC4899",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Bills & Utilities",
    icon: "⚡",
    color: "#6B7280",
    type: CategoryType.EXPENSE,
  },
];

export const sampleAccounts: SampleAccount[] = [
  { name: "Main Checking", balance: 2500.0, type: AccountType.CHECKING },
  { name: "Savings Account", balance: 15000.0, type: AccountType.SAVINGS },
];

const now = new Date();
export const sampleBudgets: SampleBudget[] = [
  {
    name: "Monthly Food Budget",
    amount: 600.0,
    period: BudgetPeriod.MONTHLY,
    startDate: new Date(now.getFullYear(), now.getMonth(), 1),
    endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
    categoryNames: ["Groceries", "Dining Out"], // Can only contain EXPENSE categories
  },
  {
    name: "Monthly Entertainment",
    amount: 250.0,
    period: BudgetPeriod.MONTHLY,
    startDate: new Date(now.getFullYear(), now.getMonth(), 1),
    endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
    categoryNames: ["Shopping", "Entertainment"], // Can only contain EXPENSE categories
  },
];

export const generateSampleTransactions = (
  categories: { id: string; type: CategoryType }[],
  accountIds: string[]
) => {
  const transactions = [];
  const expenseCategories = categories.filter((c) => c.type === "EXPENSE");
  const incomeCategories = categories.filter((c) => c.type === "INCOME");

  for (let i = 0; i < 45; i++) {
    // Generate transactions for the last 45 days
    const date = new Date();
    date.setDate(date.getDate() - i);

    const transactionsPerDay = Math.floor(Math.random() * 4) + 1;
    for (let j = 0; j < transactionsPerDay; j++) {
      const isIncome = Math.random() < 0.08; // ~8% chance of being an income transaction
      const accountId =
        accountIds[Math.floor(Math.random() * accountIds.length)];

      if (isIncome && incomeCategories.length > 0) {
        const incomeCategory =
          incomeCategories[Math.floor(Math.random() * incomeCategories.length)];
        transactions.push({
          amount: Math.floor(Math.random() * 1500) + 1000,
          description: "Paycheck",
          type: TransactionType.INCOME,
          date,
          categoryId: incomeCategory.id,
          accountId,
        });
      } else if (expenseCategories.length > 0) {
        const expenseCategory =
          expenseCategories[
            Math.floor(Math.random() * expenseCategories.length)
          ];
        const expenseDescriptions = [
          "Lunch",
          "Coffee",
          "Bus fare",
          "Online order",
          "Movie ticket",
        ];
        transactions.push({
          amount: Math.floor(Math.random() * 100) + 5,
          description:
            expenseDescriptions[
              Math.floor(Math.random() * expenseDescriptions.length)
            ],
          type: TransactionType.EXPENSE,
          date,
          categoryId: expenseCategory.id,
          accountId,
        });
      }
    }
  }
  return transactions;
};
