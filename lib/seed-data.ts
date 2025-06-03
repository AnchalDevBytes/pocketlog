// Sample data for development and testing
export const sampleCategories = [
  // Income Categories
  { name: "Salary", icon: "💰", color: "#10B981", type: "INCOME" },
  { name: "Freelance", icon: "💻", color: "#059669", type: "INCOME" },
  { name: "Investment", icon: "📈", color: "#047857", type: "INCOME" },
  { name: "Other Income", icon: "💵", color: "#065F46", type: "INCOME" },

  // Expense Categories
  { name: "Food & Dining", icon: "🍽️", color: "#EF4444", type: "EXPENSE" },
  { name: "Transportation", icon: "🚗", color: "#F97316", type: "EXPENSE" },
  { name: "Shopping", icon: "🛍️", color: "#8B5CF6", type: "EXPENSE" },
  { name: "Entertainment", icon: "🎬", color: "#EC4899", type: "EXPENSE" },
  { name: "Bills & Utilities", icon: "⚡", color: "#6B7280", type: "EXPENSE" },
  { name: "Healthcare", icon: "🏥", color: "#DC2626", type: "EXPENSE" },
  { name: "Education", icon: "📚", color: "#2563EB", type: "EXPENSE" },
  { name: "Travel", icon: "✈️", color: "#0891B2", type: "EXPENSE" },
  { name: "Home & Garden", icon: "🏠", color: "#16A34A", type: "EXPENSE" },
  { name: "Personal Care", icon: "💄", color: "#DB2777", type: "EXPENSE" },
  { name: "Gifts & Donations", icon: "🎁", color: "#7C3AED", type: "EXPENSE" },
  { name: "Other Expenses", icon: "📝", color: "#64748B", type: "EXPENSE" },
]

export const sampleAccounts = [
  { name: "Main Checking", balance: 2500.0, type: "CHECKING" },
  { name: "Savings Account", balance: 15000.0, type: "SAVINGS" },
  { name: "Credit Card", balance: -850.0, type: "CREDIT_CARD" },
  { name: "Investment Account", balance: 25000.0, type: "INVESTMENT" },
]

export const sampleBudgets = [
  {
    name: "Monthly Food Budget",
    amount: 600.0,
    period: "MONTHLY",
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  },
  {
    name: "Transportation Budget",
    amount: 300.0,
    period: "MONTHLY",
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  },
  {
    name: "Entertainment Budget",
    amount: 200.0,
    period: "MONTHLY",
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  },
]

export const generateSampleTransactions = (categoryIds: string[], accountIds: string[]) => {
  const transactions = []
  const now = new Date()

  // Generate transactions for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Generate 1-3 transactions per day
    const transactionsPerDay = Math.floor(Math.random() * 3) + 1

    for (let j = 0; j < transactionsPerDay; j++) {
      const isIncome = Math.random() < 0.2 // 20% chance of income
      const categoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)]
      const accountId = accountIds[Math.floor(Math.random() * accountIds.length)]

      const expenseDescriptions = [
        "Grocery shopping",
        "Gas station",
        "Restaurant dinner",
        "Coffee shop",
        "Online shopping",
        "Movie tickets",
        "Uber ride",
        "Electric bill",
        "Internet bill",
        "Pharmacy",
        "Gym membership",
        "Parking fee",
        "Book purchase",
        "Subscription service",
        "Car maintenance",
      ]

      const incomeDescriptions = [
        "Salary deposit",
        "Freelance payment",
        "Investment dividend",
        "Bonus payment",
        "Side hustle income",
        "Refund",
      ]

      const descriptions = isIncome ? incomeDescriptions : expenseDescriptions
      const description = descriptions[Math.floor(Math.random() * descriptions.length)]

      const amount = isIncome
        ? Math.floor(Math.random() * 2000) + 500 // Income: $500-$2500
        : Math.floor(Math.random() * 200) + 10 // Expense: $10-$210

      transactions.push({
        amount,
        description,
        type: isIncome ? "INCOME" : "EXPENSE",
        date,
        categoryId,
        accountId,
      })
    }
  }

  return transactions
}
