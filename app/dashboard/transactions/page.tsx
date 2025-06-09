"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import {
  fetchTransactions,
  addTransaction,
  updatedTransaction,
  type Transaction,
  deleteTransaction,
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

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
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

  const handleDeleteRequest = (id: string) => {
    const transaction = transactions.find(
      (transaction) => transaction.id === id
    );
    if (transaction) {
      setTransactionToDelete(transaction);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      dispatch(deleteTransaction(transactionToDelete.id));
      setIsDeleteDialogOpen(false);
      setTransactionToDelete(null);
    }
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
        onDelete={handleDeleteRequest}
      />

      {/* --- DELETE CONFIRMATION DIALOG --- */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              transaction:
              <span className="block font-semibold mt-2">
                {transactionToDelete?.description}
              </span>
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
