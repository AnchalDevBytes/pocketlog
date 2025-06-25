"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { BankAccount } from "@/lib/features/accountSlice";
import type { Transaction } from "@/lib/features/transactionSlice";
import { motion } from "framer-motion";
import {
  CreditCard,
  Wallet,
  PiggyBank,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface AccountCardProps {
  account: BankAccount;
  transactions: Transaction[];
  index: number;
  onEdit: (account: BankAccount) => void;
  onDelete: (id: string) => void;
}

const accountIcons = {
  CHECKING: CreditCard,
  SAVINGS: PiggyBank,
  CREDIT_CARD: CreditCard,
  INVESTMENT: TrendingUp,
};

const accountColors = {
  CHECKING: "bg-blue-500",
  SAVINGS: "bg-green-500",
  CREDIT_CARD: "bg-red-500",
  INVESTMENT: "bg-purple-500",
};

export function AccountCard({
  account,
  transactions,
  index,
  onEdit,
  onDelete,
}: AccountCardProps) {
  const Icon = accountIcons[account.type] || Wallet;
  const colorClass = accountColors[account.type] || "bg-gray-500";

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const thisMonthTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    const now = new Date();
    return (
      transactionDate.getMonth() === now.getMonth() &&
      transactionDate.getFullYear() === now.getFullYear()
    );
  });

  const monthlySpent = thisMonthTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${colorClass} text-white`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{account.name}</CardTitle>
                <Badge variant="secondary" className="text-xs mt-1">
                  {account.type.replace("_", " ").toLowerCase()}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/dashboard/accounts/${account.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEdit(account)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => onDelete(account.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Current Balance
            </p>
            <p
              className={`text-2xl font-bold ${
                account.balance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(account.balance)}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This Month Spent
            </p>
            <p className="text-lg font-semibold text-red-600">
              {formatCurrency(monthlySpent)}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Recent Transactions
              </p>
              <Badge variant="outline" className="text-xs">
                {transactions.length} total
              </Badge>
            </div>

            {recentTransactions.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 max-h-[84px] min-h-[84px]">
                No recent transactions
              </p>
            ) : (
              <div className="space-y-2">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">
                        {transaction.category?.icon}
                      </span>
                      <span className="truncate max-w-[120px]">
                        {transaction.description}
                      </span>
                    </div>
                    <span
                      className={`font-medium ${
                        transaction.type === "INCOME"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "INCOME" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
