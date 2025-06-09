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

interface BudgetFormProps {
  onSubmit: (data: any) => void;
  initialData?: Budget | null;
  loading?: boolean;
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
  };
};

export function BudgetForm({
  onSubmit,
  initialData,
  loading,
}: BudgetFormProps) {
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        name: initialData.name,
        amount: initialData.amount.toString(),
        period: initialData.period,
        startDate: new Date(initialData.startDate).toISOString().split("T")[0],
        endDate: new Date(initialData.endDate).toISOString().split("T")[0],
      };
    }
    return getDefaultFormData();
  });

  const isEditMode = !!initialData;

  const handlePeriodChange = (period: "WEEKLY" | "MONTHLY" | "YEARLY") => {
    const endDate = calculateEndDate(formData.startDate, period);
    setFormData({ ...formData, period, endDate });
  };

  const handleStartDateChange = (startDate: string) => {
    const endDate = calculateEndDate(startDate, formData.period);
    setFormData({ ...formData, startDate, endDate });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.amount ||
      !formData.startDate ||
      !formData.endDate
    ) {
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
