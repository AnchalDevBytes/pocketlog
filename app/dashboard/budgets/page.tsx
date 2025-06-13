"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import {
  fetchBudgets,
  addBudget,
  Budget,
  deleteBudget,
  updateBudget,
} from "@/lib/features/budgetSlice";
import { BudgetCard } from "@/components/dashboard/budget-card";
import { BudgetForm } from "@/components/dashboard/budget-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { fetchCategories } from "@/lib/features/categorySlice";

export default function BudgetsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { budgets, loading, loadingAddAndUpdate } = useSelector(
    (state: RootState) => state.budgets
  );

  const { categories } = useSelector((state: RootState) => state.categories);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);

  useEffect(() => {
    dispatch(fetchBudgets());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddClick = () => {
    setEditingBudget(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (budget: Budget) => {
    setEditingBudget(budget);
    setIsDialogOpen(true);
  };

  const handleDeleteRequest = (id: string) => {
    const budget = budgets.find((b) => b.id === id);
    if (budget) {
      setBudgetToDelete(budget);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (budgetToDelete) {
      dispatch(deleteBudget(budgetToDelete.id));
      setIsDeleteDialogOpen(false);
      setBudgetToDelete(null);
    }
  };

  const handleSubmit = async (budgetData: any) => {
    if (editingBudget) {
      await dispatch(updateBudget({ ...budgetData, id: editingBudget.id }));
    } else {
      await dispatch(addBudget(budgetData));
    }
    dispatch(fetchBudgets());
    setIsDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  console.log(budgets);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Budgets
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Set and track your spending goals
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddClick}>
              <Plus className="mr-2 h-4 w-4" />
              Create Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingBudget ? "Edit Budget" : "Create New Budget"}
              </DialogTitle>
              <DialogDescription>
                {editingBudget
                  ? "Update your spending limit for this period."
                  : "Set a spending limit for a specific time period."}
              </DialogDescription>
            </DialogHeader>
            <BudgetForm
              key={editingBudget ? editingBudget.id : "new"}
              onSubmit={handleSubmit}
              initialData={editingBudget}
              loading={loadingAddAndUpdate}
              categories={categories}
            />
          </DialogContent>
        </Dialog>
      </motion.div>

      {!budgets || budgets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-12"
        >
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            No budgets created yet. Create your first budget to start tracking
            your spending goals!
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets?.map((budget, index) => {
            if (!budget || typeof budget !== "object" || !budget.id) {
              return null;
            }
            return (
              <BudgetCard
                key={budget.id}
                budget={budget}
                index={index}
                onEdit={handleEditClick}
                onDelete={handleDeleteRequest}
              />
            );
          })}
        </div>
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              <span className="font-semibold"> {budgetToDelete?.name} </span>
              budget.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
