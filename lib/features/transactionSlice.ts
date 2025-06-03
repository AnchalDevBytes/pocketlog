import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export interface Transaction {
  id: string
  amount: number
  description: string
  type: "INCOME" | "EXPENSE"
  date: string
  categoryId: string
  accountId: string
  category?: {
    id: string
    name: string
    color: string
    icon: string
  }
  account?: {
    id: string
    name: string
  }
}

interface TransactionState {
  transactions: Transaction[]
  loading: boolean
  error: string | null
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
}

export const fetchTransactions = createAsyncThunk("transactions/fetchTransactions", async () => {
  const response = await fetch("/api/transactions")
  if (!response.ok) {
    throw new Error("Failed to fetch transactions")
  }
  return response.json()
})

export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transaction: Omit<Transaction, "id">) => {
    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    })
    if (!response.ok) {
      throw new Error("Failed to add transaction")
    }
    return response.json()
  },
)

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false
        state.transactions = action.payload
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch transactions"
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload)
      })
  },
})

export default transactionSlice.reducer
