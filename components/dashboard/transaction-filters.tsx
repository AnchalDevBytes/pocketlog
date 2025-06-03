"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Transaction } from "@/lib/features/transactionSlice"
import type { Category } from "@/lib/features/categorySlice"
import type { BankAccount } from "@/lib/features/accountSlice"
import { Search, Filter, X } from "lucide-react"

interface TransactionFiltersProps {
  transactions: Transaction[]
  categories: Category[]
  accounts: BankAccount[]
  onFilter: (filtered: Transaction[]) => void
}

export function TransactionFilters({ transactions, categories, accounts, onFilter }: TransactionFiltersProps) {
  const [filters, setFilters] = useState({
    search: "",
    type: "ALL",
    categoryId: "ALL",
    accountId: "ALL",
    dateFrom: "",
    dateTo: "",
  })

  const [activeFilters, setActiveFilters] = useState<string[]>([])

  useEffect(() => {
    let filtered = [...transactions]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter((t) => t.description.toLowerCase().includes(filters.search.toLowerCase()))
    }

    // Type filter
    if (filters.type !== "ALL") {
      filtered = filtered.filter((t) => t.type === filters.type)
    }

    // Category filter
    if (filters.categoryId !== "ALL") {
      filtered = filtered.filter((t) => t.categoryId === filters.categoryId)
    }

    // Account filter
    if (filters.accountId !== "ALL") {
      filtered = filtered.filter((t) => t.accountId === filters.accountId)
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter((t) => new Date(t.date) >= new Date(filters.dateFrom))
    }
    if (filters.dateTo) {
      filtered = filtered.filter((t) => new Date(t.date) <= new Date(filters.dateTo))
    }

    onFilter(filtered)

    // Update active filters
    const active = []
    if (filters.search) active.push(`Search: ${filters.search}`)
    if (filters.type !== "ALL") active.push(`Type: ${filters.type}`)
    if (filters.categoryId !== "ALL") {
      const category = categories.find((c) => c.id === filters.categoryId)
      active.push(`Category: ${category?.name}`)
    }
    if (filters.accountId !== "ALL") {
      const account = accounts.find((a) => a.id === filters.accountId)
      active.push(`Account: ${account?.name}`)
    }
    if (filters.dateFrom) active.push(`From: ${filters.dateFrom}`)
    if (filters.dateTo) active.push(`To: ${filters.dateTo}`)

    setActiveFilters(active)
  }, [filters, transactions, categories, accounts, onFilter])

  const clearFilters = () => {
    setFilters({
      search: "",
      type: "ALL",
      categoryId: "ALL",
      accountId: "ALL",
      dateFrom: "",
      dateTo: "",
    })
  }

  const removeFilter = (filterText: string) => {
    if (filterText.startsWith("Search:")) {
      setFilters((prev) => ({ ...prev, search: "" }))
    } else if (filterText.startsWith("Type:")) {
      setFilters((prev) => ({ ...prev, type: "ALL" }))
    } else if (filterText.startsWith("Category:")) {
      setFilters((prev) => ({ ...prev, categoryId: "ALL" }))
    } else if (filterText.startsWith("Account:")) {
      setFilters((prev) => ({ ...prev, accountId: "ALL" }))
    } else if (filterText.startsWith("From:")) {
      setFilters((prev) => ({ ...prev, dateFrom: "" }))
    } else if (filterText.startsWith("To:")) {
      setFilters((prev) => ({ ...prev, dateTo: "" }))
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="h-5 w-5 text-slate-600" />
            <h3 className="font-medium">Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search transactions..."
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>

            <Select value={filters.type} onValueChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.categoryId}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, categoryId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center space-x-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.accountId}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, accountId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Accounts</SelectItem>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="From date"
              value={filters.dateFrom}
              onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
            />

            <Input
              type="date"
              placeholder="To date"
              value={filters.dateTo}
              onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
            />
          </div>

          {activeFilters.length > 0 && (
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="text-sm text-slate-600 dark:text-slate-400">Active filters:</span>
              {activeFilters.map((filter, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{filter}</span>
                  <button
                    onClick={() => removeFilter(filter)}
                    className="ml-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
