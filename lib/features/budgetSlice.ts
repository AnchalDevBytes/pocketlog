import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export interface Budget {
  id: string
  name: string
  amount: number
  spent: number
  period: "WEEKLY" | "MONTHLY" | "YEARLY"
  startDate: string
  endDate: string
}

interface BudgetState {
  budgets: Budget[]
  loading: boolean
  error: string | null
}

const initialState: BudgetState = {
  budgets: [],
  loading: false,
  error: null,
}

export const fetchBudgets = createAsyncThunk("budgets/fetchBudgets", async () => {
  const response = await fetch("/api/budgets")
  if (!response.ok) {
    throw new Error("Failed to fetch budgets")
  }
  return response.json()
})

export const addBudget = createAsyncThunk("budgets/addBudget", async (budget: Omit<Budget, "id" | "spent">) => {
  const response = await fetch("/api/budgets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(budget),
  })
  if (!response.ok) {
    throw new Error("Failed to add budget")
  }
  return response.json()
})

const budgetSlice = createSlice({
  name: "budgets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false
        state.budgets = action.payload
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch budgets"
      })
      .addCase(addBudget.fulfilled, (state, action) => {
        state.budgets.push(action.payload)
      })
  },
})

export default budgetSlice.reducer
