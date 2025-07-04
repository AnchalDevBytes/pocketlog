"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Budget } from "@/lib/features/budgetSlice";
import { Category } from "@/lib/features/categorySlice";
import { X } from "lucide-react";
import { Badge } from "../ui/badge";

interface BudgetFormProps {
  onSubmit: (data: any) => void;
  initialData?: Budget | null;
  loading?: boolean;
  categories: Category[];
}

const calculateEndDate = (startDate: string, period: string) => {
  const start = new Date(startDate);
  const end = new Date(start.valueOf() + start.getTimezoneOffset() * 60 * 1000);

  switch (period) {
    case "WEEKLY":
      end.setDate(start.getDate() + 7);
      break;
    case "MONTHLY":
      end.setMonth(start.getMonth() + 1);
      break;
    case "YEARLY":
      end.setFullYear(start.getFullYear() + 1);
      break;
  }

  return end.toISOString().split("T")[0];
};

const getDefaultFormData = () => {
  const today = new Date().toISOString().split("T")[0];
  return {
    name: "",
    amount: "",
    period: "MONTHLY" as "WEEKLY" | "MONTHLY" | "YEARLY",
    startDate: today,
    endDate: calculateEndDate(today, "MONTHLY"),
    categoryIds: [],
  };
};

export function BudgetForm({
  onSubmit,
  initialData,
  loading,
  categories,
}: BudgetFormProps) {
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        name: initialData.name,
        amount: initialData.amount.toString(),
        period: initialData.period,
        startDate: new Date(initialData.startDate).toISOString().split("T")[0],
        endDate: new Date(initialData.endDate).toISOString().split("T")[0],
        categoryIds: initialData.categories?.map((cat) => cat.id) || [],
      };
    }
    return { ...getDefaultFormData(), categoryIds: [] };
  });

  const isEditMode = !!initialData;

  const expenseCategories = categories.filter((cat) => cat.type === "EXPENSE");
  const selectedCategories = formData.categoryIds.map((id) =>
    categories.find((cat) => cat.id === id)
  );

  // Filter out categories that are already assigned to another budget
  const availableCategories = expenseCategories.filter((cat) => {
    // 1. It's not assigned to any budget.
    // @ts-ignore - budgetId is on the category from the API now.
    if (!cat.budgetId) return true;

    // 2. It's assigned to the budget we are currently editing.
    // @ts-ignore
    if (isEditMode && cat.budgetId === initialData?.id) return true;

    // 3. It's assigned to a budget, but that budget has already expired.
    // @ts-ignore
    if (cat.budget && new Date(cat.budget.endDate) < new Date()) {
      return true;
    }

    // It's assigned to the budget we are currently editing
    return false; // It's assigned to some other budget
  });

  const handlePeriodChange = (period: "WEEKLY" | "MONTHLY" | "YEARLY") => {
    const endDate = calculateEndDate(formData.startDate, period);
    setFormData({ ...formData, period, endDate });
  };

  const handleStartDateChange = (startDate: string) => {
    const endDate = calculateEndDate(startDate, formData.period);
    setFormData({ ...formData, startDate, endDate });
  };

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId && !formData.categoryIds.includes(categoryId)) {
      setFormData({
        ...formData,
        categoryIds: [...formData.categoryIds, categoryId],
      });
    }
  };

  const handleCategoryRemove = (categoryId: string) => {
    setFormData({
      ...formData,
      categoryIds: formData.categoryIds.filter((id) => id !== categoryId),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.amount ||
      !formData.startDate ||
      !formData.endDate ||
      formData.categoryIds.length === 0
    ) {
      alert("Please fill out name, amount, and select at least one category.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Budget Name</Label>
        <Input
          id="name"
          placeholder="e.g., Monthly Groceries"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Budget Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="period">Period</Label>
          <Select value={formData.period} onValueChange={handlePeriodChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Budget Categories</Label>
          <Select onValueChange={handleCategorySelect} value="">
            <SelectTrigger>
              <SelectValue placeholder="Add categories to this budget..." />
            </SelectTrigger>
            <SelectContent>
              {availableCategories
                .filter((cat) => !formData.categoryIds.includes(cat.id))
                .map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center space-x-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 pt-2 min-h-[24px]">
            {selectedCategories.map(
              (cat) =>
                cat && (
                  <Badge
                    key={cat.id}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {cat.name}
                    <button
                      type="button"
                      onClick={() => handleCategoryRemove(cat.id)}
                      className="rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )
            )}
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading
          ? isEditMode
            ? "Updating..."
            : "Creating..."
          : isEditMode
          ? "Update Budget"
          : "Create Budget"}
      </Button>
    </form>
  );
}
