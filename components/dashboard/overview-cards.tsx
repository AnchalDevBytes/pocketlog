"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import type { Transaction } from "@/lib/features/transactionSlice";
import type { BankAccount } from "@/lib/features/accountSlice";
import { FollowerPointerCard } from "../ui/following-pointer";

interface OverviewCardsProps {
  transactions: Transaction[];
  accounts: BankAccount[];
}

export function OverviewCards({ transactions, accounts }: OverviewCardsProps) {
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === currentMonth &&
      transactionDate.getFullYear() === currentYear
    );
  });

  const monthlyIncome = monthlyTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const cards = [
    {
      title: "Total Balance",
      value: totalBalance,
      icon: Wallet,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "Monthly Income",
      value: monthlyIncome,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "Monthly Expenses",
      value: monthlyExpenses,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900",
    },
    {
      title: "Net Income",
      value: monthlyIncome - monthlyExpenses,
      icon: DollarSign,
      color:
        monthlyIncome - monthlyExpenses >= 0
          ? "text-green-600"
          : "text-red-600",
      bgColor:
        monthlyIncome - monthlyExpenses >= 0
          ? "bg-green-100 dark:bg-green-900"
          : "bg-red-100 dark:bg-red-900",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <FollowerPointerCard title={card.title}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${card.color}`}>
                  {formatCurrency(card.value)}
                </div>
              </CardContent>
            </Card>
          </FollowerPointerCard>
        </motion.div>
      ))}
    </div>
  );
}
