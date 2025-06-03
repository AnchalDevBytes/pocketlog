"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
import { fetchTransactions } from "@/lib/features/transactionSlice"
import { fetchAccounts } from "@/lib/features/accountSlice"
import { fetchBudgets } from "@/lib/features/budgetSlice"
import { OverviewCards } from "@/components/dashboard/overview-cards"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { SpendingChart } from "@/components/dashboard/spending-chart"
import { BudgetProgress } from "@/components/dashboard/budget-progress"
import { motion } from "framer-motion"
import { AIInsights } from "@/components/dashboard/ai-insights"
import { SampleDataManager } from "@/components/dashboard/sample-data-manager"

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { transactions, loading: transactionsLoading } = useSelector((state: RootState) => state.transactions)
  const { accounts, loading: accountsLoading } = useSelector((state: RootState) => state.accounts)
  const { budgets, loading: budgetsLoading } = useSelector((state: RootState) => state.budgets)

  useEffect(() => {
    dispatch(fetchTransactions())
    dispatch(fetchAccounts())
    dispatch(fetchBudgets())
  }, [dispatch])

  const isLoading = transactionsLoading || accountsLoading || budgetsLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">
          Welcome back! Here's a summary of your financial activity.
        </p>
      </motion.div>

      <OverviewCards transactions={transactions} accounts={accounts} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart transactions={transactions} />
        <BudgetProgress budgets={budgets} />
      </div>

      <RecentTransactions transactions={transactions.slice(0, 5)} />

      {transactions.length === 0 && accounts.length === 0 && <SampleDataManager />}

      <AIInsights />
    </div>
  )
}
