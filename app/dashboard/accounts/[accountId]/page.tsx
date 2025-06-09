"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { RootState, AppDispatch } from "@/lib/store";
import { fetchAccounts } from "@/lib/features/accountSlice";
import { fetchTransactions } from "@/lib/features/transactionSlice";
import { TransactionList } from "@/components/dashboard/transaction-list";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default function AccountDetailsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const accountId = params.accountId as string;

  const { accounts, loading: accountsLoading } = useSelector(
    (state: RootState) => state.accounts
  );
  const { transactions, loadingFetch: transactionsLoading } = useSelector(
    (state: RootState) => state.transactions
  );

  useEffect(() => {
    if (accounts.length === 0) {
      dispatch(fetchAccounts());
    }
    if (transactions.length === 0) {
      dispatch(fetchTransactions());
    }
  }, [dispatch, accounts.length, transactions.length]);

  const account = accounts.find((acc) => acc.id === accountId);
  const accountTransactions = transactions.filter(
    (t) => t.accountId === accountId
  );

  if (accountsLoading || transactionsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">Account Not Found</h2>
        <p className="text-slate-500 mt-2">
          The account you are looking for does not exist.
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/accounts">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Accounts
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/accounts">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {account.name}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            {account.type.replace("_", " ")} Account
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Balance</CardTitle>
          <CardDescription>
            The total amount currently in this account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p
            className={`text-4xl font-bold ${
              account.balance >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatCurrency(account.balance)}
          </p>
        </CardContent>
      </Card>

      <TransactionList
        transactions={accountTransactions}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    </div>
  );
}
