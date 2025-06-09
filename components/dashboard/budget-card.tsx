"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";
import type { Budget } from "@/lib/features/budgetSlice";
import { motion } from "framer-motion";
import { Calendar, Target, Edit, Trash2, AlertTriangle } from "lucide-react";

interface BudgetCardProps {
  budget: Budget;
  index: number;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

export function BudgetCard({
  budget,
  index,
  onEdit,
  onDelete,
}: BudgetCardProps) {
  const progress = (budget.spent / budget.amount) * 100;
  const isOverBudget = budget.spent > budget.amount;
  const remaining = budget.amount - budget.spent;

  const now = new Date();
  const startDate = new Date(budget.startDate);
  const endDate = new Date(budget.endDate);
  const isActive = now >= startDate && now <= endDate;
  const isExpired = now > endDate;

  const getStatusColor = () => {
    if (isExpired) return "bg-gray-500";
    if (isOverBudget) return "bg-red-500";
    if (progress > 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusText = () => {
    if (isExpired) return "Expired";
    if (isOverBudget) return "Over Budget";
    if (progress > 80) return "Near Limit";
    return "On Track";
  };

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
              <div className={`p-2 rounded-lg ${getStatusColor()} text-white`}>
                <Target className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{budget.name}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {budget.period.toLowerCase()}
                  </Badge>
                  <Badge
                    variant={
                      isOverBudget
                        ? "destructive"
                        : isExpired
                        ? "secondary"
                        : "default"
                    }
                    className="text-xs"
                  >
                    {getStatusText()}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => onEdit(budget)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => onDelete(budget.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Progress
              </p>
              <p className="text-sm font-medium">
                {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
              </p>
            </div>
            <Progress
              value={Math.min(progress, 100)}
              className={`h-3 ${isOverBudget ? "bg-red-100" : ""}`}
            />
            <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{progress.toFixed(1)}% used</span>
              <span>
                {isOverBudget
                  ? `${formatCurrency(budget.spent - budget.amount)} over`
                  : `${formatCurrency(remaining)} remaining`}
              </span>
            </div>
          </div>

          {isOverBudget && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-600 dark:text-red-400">
                You've exceeded this budget by{" "}
                {formatCurrency(budget.spent - budget.amount)}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
              <Calendar className="h-4 w-4" />
              <span>
                {startDate.toLocaleDateString()} -{" "}
                {endDate.toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Daily Average
                </p>
                <p className="font-semibold text-red-600">
                  {formatCurrency(
                    budget.spent /
                      Math.max(
                        1,
                        Math.ceil(
                          (now.getTime() - startDate.getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      )
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Days Left
                </p>
                <p className="font-semibold">
                  {isExpired
                    ? 0
                    : Math.max(
                        0,
                        Math.ceil(
                          (endDate.getTime() - now.getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                      )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
