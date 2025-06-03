import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export interface BankAccount {
  id: string
  name: string
  balance: number
  type: "CHECKING" | "SAVINGS" | "CREDIT_CARD" | "INVESTMENT"
}

interface AccountState {
  accounts: BankAccount[]
  loading: boolean
  error: string | null
}

const initialState: AccountState = {
  accounts: [],
  loading: false,
  error: null,
}

export const fetchAccounts = createAsyncThunk("accounts/fetchAccounts", async () => {
  const response = await fetch("/api/accounts")
  if (!response.ok) {
    throw new Error("Failed to fetch accounts")
  }
  return response.json()
})

export const addAccount = createAsyncThunk("accounts/addAccount", async (account: Omit<BankAccount, "id">) => {
  const response = await fetch("/api/accounts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(account),
  })
  if (!response.ok) {
    throw new Error("Failed to add account")
  }
  return response.json()
})

const accountSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false
        state.accounts = action.payload
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch accounts"
      })
      .addCase(addAccount.fulfilled, (state, action) => {
        state.accounts.push(action.payload)
      })
  },
})

export default accountSlice.reducer
