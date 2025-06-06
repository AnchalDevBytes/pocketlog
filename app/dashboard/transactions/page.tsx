"use client";

import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import {
  fetchTransactions,
  addTransaction,
} from "@/lib/features/transactionSlice";
import { addCategory, fetchCategories } from "@/lib/features/categorySlice";
import { fetchAccounts } from "@/lib/features/accountSlice";
import { TransactionForm } from "@/components/dashboard/transaction-form";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { TransactionFilters } from "@/components/dashboard/transaction-filters";
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
import { CategoryForm } from "@/components/dashboard/category-form";
import { useToast } from "@/hooks/use-toast";

export default function TransactionsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { transactions, loading } = useSelector(
    (state: RootState) => state.transactions
  );
  const { categories } = useSelector((state: RootState) => state.categories);

  const { accounts } = useSelector((state: RootState) => state.accounts);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
    dispatch(fetchAccounts());
  }, [dispatch]);

  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  const handleAddTransaction = async (transactionData: any) => {
    await dispatch(addTransaction(transactionData));
    setIsDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleCreateCategory = async (categoryData: any) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        const newCategory = await response.json();
        dispatch(addCategory(newCategory));
        setShowCategoryForm(false);
        toast({
          title: "Success",
          description: "Category created successfully",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message || "Failed to create category",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create category",
          variant: "destructive",
        });
      }
    }
  };

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
            Transactions
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Manage and track all your financial transactions
          </p>
        </div>

        <div className="flex items-center gap-5">
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
                <DialogDescription>
                  Enter the details of your transaction below.
                </DialogDescription>
              </DialogHeader>
              <TransactionForm
                categories={categories}
                accounts={accounts}
                onSubmit={handleAddTransaction}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={showCategoryForm} onOpenChange={setShowCategoryForm}>
            <DialogTrigger asChild>
              <Button variant={"outline"}>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <CategoryForm onSubmit={handleCreateCategory} />
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <TransactionFilters
        transactions={transactions}
        categories={categories}
        accounts={accounts}
        onFilter={setFilteredTransactions}
      />

      <TransactionList transactions={filteredTransactions} />
    </div>
  );
}
