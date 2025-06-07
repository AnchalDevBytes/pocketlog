"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import {
  fetchTransactions,
  addTransaction,
  updatedTransaction,
  type Transaction,
} from "@/lib/features/transactionSlice";
import { fetchCategories } from "@/lib/features/categorySlice";
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

export default function TransactionsPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { transactions, loadingFetch, loadingAdd } = useSelector(
    (state: RootState) => state.transactions
  );

  const { categories } = useSelector((state: RootState) => state.categories);
  const { accounts } = useSelector((state: RootState) => state.accounts);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchCategories());
    dispatch(fetchAccounts());
  }, [dispatch]);

  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (transactionData: any) => {
    if (editingTransaction) {
      await dispatch(
        updatedTransaction({ ...transactionData, id: editingTransaction.id })
      );
    } else {
      await dispatch(addTransaction(transactionData));
    }
    setIsDialogOpen(false);
  };

  if (loadingFetch) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Transactions
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Manage and track all your financial transactions
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingTransaction
                  ? "Edit Transaction"
                  : "Add New Transaction"}
              </DialogTitle>
              <DialogDescription>
                {editingTransaction
                  ? "Update the details of your transaction below."
                  : "Enter the details of your transaction below."}
              </DialogDescription>
            </DialogHeader>
            <TransactionForm
              key={editingTransaction ? editingTransaction.id : "new"}
              categories={categories}
              accounts={accounts}
              onSubmit={handleSubmit}
              loadingAdd={loadingAdd}
              initialData={editingTransaction}
            />
          </DialogContent>
        </Dialog>
      </motion.div>

      <TransactionFilters
        transactions={transactions}
        categories={categories}
        accounts={accounts}
        onFilter={setFilteredTransactions}
      />

      <TransactionList
        transactions={filteredTransactions}
        onEdit={handleEdit}
      />
    </div>
  );
}
