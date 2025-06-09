"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import {
  fetchAccounts,
  addAccount,
  BankAccount,
  deleteAccount,
  updateAccount,
} from "@/lib/features/accountSlice";
import { fetchTransactions } from "@/lib/features/transactionSlice";
import { AccountCard } from "@/components/dashboard/account-card";
import { AccountForm } from "@/components/dashboard/account-form";
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

export default function AccountsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { accounts, loading } = useSelector(
    (state: RootState) => state.accounts
  );
  const { transactions } = useSelector(
    (state: RootState) => state.transactions
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<BankAccount | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchAccounts());
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleAddClick = () => {
    setEditingAccount(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (account: BankAccount) => {
    setEditingAccount(account);
    setIsDialogOpen(true);
  };

  const handleDeleteRequest = (id: string) => {
    const account = accounts.find((acc) => acc.id === id);
    if (account) {
      setAccountToDelete(account);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (accountToDelete) {
      dispatch(deleteAccount(accountToDelete.id));
      setIsDeleteDialogOpen(false);
      setAccountToDelete(null);
    }
  };

  const handleSubmit = async (accountData: any) => {
    if (editingAccount) {
      await dispatch(updateAccount({ ...accountData, id: editingAccount.id }));
    } else {
      await dispatch(addAccount(accountData));
    }
    setIsDialogOpen(false);
  };

  if (loading && accounts.length === 0) {
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
            Accounts
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Manage your bank accounts and track balances
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddClick}>
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingAccount ? "Edit Account" : "Add New Account"}
              </DialogTitle>
              <DialogDescription>
                {editingAccount
                  ? "Update the details of your account."
                  : "Create a new bank account to track your finances."}
              </DialogDescription>
            </DialogHeader>
            <AccountForm
              key={editingAccount ? editingAccount.id : "new"}
              onSubmit={handleSubmit}
              initialData={editingAccount}
              loading={loading}
            />
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account, index) => (
              <AccountCard
                key={account.id}
                account={account}
                transactions={transactions.filter(
                  (t) => t.accountId === account.id
                )}
                index={index}
                onEdit={handleEditClick}
                onDelete={handleDeleteRequest}
              />
            ))}
          </div>

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
                  <span className="font-semibold">
                    {" "}
                    {accountToDelete?.name}{" "}
                  </span>
                  account.
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
        </>
      )}
    </div>
  );
}
