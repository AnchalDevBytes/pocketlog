import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: "INCOME" | "EXPENSE";
  date: string;
  categoryId: string;
  accountId: string;
  category?: {
    id: string;
    name: string;
    color: string;
    icon: string;
  };
  account?: {
    id: string;
    name: string;
  };
}

interface TransactionState {
  transactions: Transaction[];
  loadingFetch: boolean;
  loadingAdd: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  loadingFetch: false,
  loadingAdd: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async () => {
    const response = await fetch("/api/transactions");
    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }
    return response.json();
  }
);

export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transaction: Omit<Transaction, "id">) => {
    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });
    if (!response.ok) {
      throw new Error("Failed to add transaction");
    }
    return response.json();
  }
);

export const updatedTransaction = createAsyncThunk(
  "transactions/updatedTransaction",
  async (transaction: Transaction) => {
    const response = await fetch("/api/transactions", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });
    if (!response.ok) {
      throw new Error("Failed to update transaction");
    }
    return response.json();
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id: string) => {
    const response = await fetch(`/api/transactions`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      throw new Error("Failed to delete transaction");
    }
    return id;
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loadingFetch = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loadingFetch = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loadingFetch = false;
        state.error = action.error.message || "Failed to fetch transactions";
      })

      .addCase(addTransaction.pending, (state) => {
        state.loadingAdd = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.loadingAdd = false;
        state.transactions.push(action.payload);
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.loadingAdd = false;
        state.error = action.error.message || "Failed to add transaction";
      })

      .addCase(updatedTransaction.pending, (state) => {
        state.loadingAdd = true;
        state.error = null;
      })
      .addCase(updatedTransaction.fulfilled, (state, action) => {
        state.loadingAdd = false;
        const index = state.transactions.findIndex(
          (t) => t.id === action.payload.id
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(updatedTransaction.rejected, (state, action) => {
        state.loadingAdd = false;
        state.error = action.error.message || "Failed to update transaction";
      })

      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (t) => t.id !== action.payload
        );
      });
  },
});

export default transactionSlice.reducer;
