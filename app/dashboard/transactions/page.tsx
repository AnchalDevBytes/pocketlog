"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
import { fetchTransactions, addTransaction } from "@/lib/features/transactionSlice"
import { fetchCategories } from "@/lib/features/categorySlice"
import { fetchAccounts } from "@/lib/features/accountSlice"
import { TransactionForm } from "@/components/dashboard/transaction-form"
import { TransactionList } from "@/components/dashboard/transaction-list"
import { TransactionFilters } from "@/components/dashboard/transaction-filters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function TransactionsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { transactions, loading } = useSelector((state: RootState) => state.transactions)
  const { categories } = useSelector((state: RootState) => state.categories)
  const { accounts } = useSelector((state: RootState) => state.accounts)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filteredTransactions, setFilteredTransactions] = useState(transactions)

  useEffect(() => {
    dispatch(fetchTransactions())
    dispatch(fetchCategories())
    dispatch(fetchAccounts())
  }, [dispatch])

  useEffect(() => {
    setFilteredTransactions(transactions)
  }, [transactions])

  const handleAddTransaction = async (transactionData: any) => {
    await dispatch(addTransaction(transactionData))
    setIsDialogOpen(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Transactions</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">Manage and track all your financial transactions</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
              <DialogDescription>Enter the details of your transaction below.</DialogDescription>
            </DialogHeader>
            <TransactionForm categories={categories} accounts={accounts} onSubmit={handleAddTransaction} />
          </DialogContent>
        </Dialog>
      </motion.div>

      <TransactionFilters
        transactions={transactions}
        categories={categories}
        accounts={accounts}
        onFilter={setFilteredTransactions}
      />

      <TransactionList transactions={filteredTransactions} />
    </div>
  )
}
