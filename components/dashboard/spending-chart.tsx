"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Transaction } from "@/lib/features/transactionSlice";
import { motion } from "framer-motion";
import { getDateRange } from "@/lib/utils";

interface SpendingChartProps {
  transactions: Transaction[];
}

export function SpendingChart({ transactions }: SpendingChartProps) {
  // Get last 7 days data
  const { start } = getDateRange("week");
  const last7Days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last7Days.push({
      date: date.toISOString().split("T")[0],
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      amount: 0,
    });
  }

  // Calculate spending for each day
  transactions.forEach((transaction) => {
    if (transaction.type === "EXPENSE") {
      const transactionDate = new Date(transaction.date)
        .toISOString()
        .split("T")[0];
      const dayData = last7Days.find((day) => day.date === transactionDate);
      if (dayData) {
        dayData.amount += transaction.amount;
      }
    }
  });

  // Category spending data for pie chart
  const categorySpending = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, transaction) => {
      const categoryName = transaction.category?.name || "Other";
      const categoryColor = transaction.category?.color || "#8884d8";

      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          value: 0,
          color: categoryColor,
        };
      }
      acc[categoryName].value += transaction.amount;
      return acc;
    }, {} as Record<string, { name: string; value: number; color: string }>);

  const pieData = Object.values(categorySpending).slice(0, 6); // Top 6 categories

  if (transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Spending Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400">
                No spending data available. Add some transactions to see your
                analytics!
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Last 7 Days Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, "Spent"]} />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
