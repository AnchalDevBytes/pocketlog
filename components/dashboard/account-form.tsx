"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AccountFormProps {
  onSubmit: (data: any) => void
}

export function AccountForm({ onSubmit }: AccountFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    balance: "",
    type: "CHECKING" as "CHECKING" | "SAVINGS" | "CREDIT_CARD" | "INVESTMENT",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.balance) {
      return
    }
    onSubmit(formData)
    setFormData({
      name: "",
      balance: "",
      type: "CHECKING",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Account Name</Label>
        <Input
          id="name"
          placeholder="e.g., Main Checking Account"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Account Type</Label>
        <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CHECKING">Checking Account</SelectItem>
            <SelectItem value="SAVINGS">Savings Account</SelectItem>
            <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
            <SelectItem value="INVESTMENT">Investment Account</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="balance">Initial Balance</Label>
        <Input
          id="balance"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={formData.balance}
          onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Add Account
      </Button>
    </form>
  )
}
