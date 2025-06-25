"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { Budget } from "@/lib/features/budgetSlice";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface BudgetProgressProps {
  budgets: Budget[];
}

export function BudgetProgress({ budgets }: BudgetProgressProps) {
  if (budgets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                No budgets set yet. Create your first budget to track your
                spending goals!
              </p>
              <Link href="/dashboard/budgets">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Budget
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const activeBudgets = budgets.filter((budget) => {
    const now = new Date();
    const startDate = new Date(budget.startDate);
    const endDate = new Date(budget.endDate);
    return now >= startDate && now <= endDate;
  });

  const pieData = activeBudgets.map((budget, index) => ({
    name: budget.name,
    value: budget.spent,
    remaining: budget.amount - budget.spent,
    total: budget.amount,
    color: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Budget Progress</CardTitle>
          <Link href="/dashboard/budgets">
            <Button variant="outline" size="sm">
              Manage Budgets
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {activeBudgets.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-slate-500 dark:text-slate-400">
                No active budgets for this period
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [
                        formatCurrency(Number(value)),
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                {activeBudgets.map((budget, index) => {
                  const progress = (budget.spent / budget.amount) * 100;
                  const isOverBudget = budget.spent > budget.amount;

                  return (
                    <motion.div
                      key={budget.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <h4 className="text-sm md:text-base font-medium">
                            {budget.name}
                          </h4>
                          <Badge
                            variant={isOverBudget ? "destructive" : "secondary"}
                          >
                            {budget.period.toLowerCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {formatCurrency(budget.spent)} /{" "}
                          {formatCurrency(budget.amount)}
                        </div>
                      </div>
                      <Progress
                        value={Math.min(progress, 100)}
                        className={`h-2 ${isOverBudget ? "bg-red-100" : ""}`}
                      />
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>{progress.toFixed(1)}% used</span>
                        <span>
                          {isOverBudget
                            ? `${formatCurrency(
                                budget.spent - budget.amount
                              )} over budget`
                            : `${formatCurrency(
                                budget.amount - budget.spent
                              )} remaining`}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
