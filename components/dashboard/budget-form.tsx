"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BudgetFormProps {
  onSubmit: (data: any) => void
}

export function BudgetForm({ onSubmit }: BudgetFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    period: "MONTHLY" as "WEEKLY" | "MONTHLY" | "YEARLY",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  })

  // Auto-calculate end date based on period
  const calculateEndDate = (startDate: string, period: string) => {
    const start = new Date(startDate)
    const end = new Date(start)

    switch (period) {
      case "WEEKLY":
        end.setDate(start.getDate() + 7)
        break
      case "MONTHLY":
        end.setMonth(start.getMonth() + 1)
        break
      case "YEARLY":
        end.setFullYear(start.getFullYear() + 1)
        break
    }

    return end.toISOString().split("T")[0]
  }

  const handlePeriodChange = (period: string) => {
    const endDate = calculateEndDate(formData.startDate, period)
    setFormData({ ...formData, period: period as any, endDate })
  }

  const handleStartDateChange = (startDate: string) => {
    const endDate = calculateEndDate(startDate, formData.period)
    setFormData({ ...formData, startDate, endDate })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.amount || !formData.startDate || !formData.endDate) {
      return
    }
    onSubmit(formData)
    setFormData({
      name: "",
      amount: "",
      period: "MONTHLY",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
    })
  }

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
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Create Budget
      </Button>
    </form>
  )
}
