"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
import { fetchBudgets, addBudget } from "@/lib/features/budgetSlice"
import { BudgetCard } from "@/components/dashboard/budget-card"
import { BudgetForm } from "@/components/dashboard/budget-form"
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

export default function BudgetsPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { budgets, loading } = useSelector((state: RootState) => state.budgets)

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchBudgets())
  }, [dispatch])

  const handleAddBudget = async (budgetData: any) => {
    await dispatch(addBudget(budgetData))
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Budgets</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">Set and track your spending goals</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Budget</DialogTitle>
              <DialogDescription>Set a spending limit for a specific time period.</DialogDescription>
            </DialogHeader>
            <BudgetForm onSubmit={handleAddBudget} />
          </DialogContent>
        </Dialog>
      </motion.div>

      {budgets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            No budgets created yet. Create your first budget to start tracking your spending goals!
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget, index) => (
            <BudgetCard key={budget.id} budget={budget} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
