"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
import { fetchAccounts, addAccount } from "@/lib/features/accountSlice"
import { fetchTransactions } from "@/lib/features/transactionSlice"
import { AccountCard } from "@/components/dashboard/account-card"
import { AccountForm } from "@/components/dashboard/account-form"
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

export default function AccountsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { accounts, loading } = useSelector((state: RootState) => state.accounts)
  const { transactions } = useSelector((state: RootState) => state.transactions)

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchAccounts())
    dispatch(fetchTransactions())
  }, [dispatch])

  const handleAddAccount = async (accountData: any) => {
    await dispatch(addAccount(accountData))
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Accounts</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">Manage your bank accounts and track balances</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Account</DialogTitle>
              <DialogDescription>Create a new bank account to track your finances.</DialogDescription>
            </DialogHeader>
            <AccountForm onSubmit={handleAddAccount} />
          </DialogContent>
        </Dialog>
      </motion.div>

      {accounts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            No accounts found. Add your first account to get started!
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account, index) => (
            <AccountCard
              key={account.id}
              account={account}
              transactions={transactions.filter((t) => t.accountId === account.id)}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  )
}
