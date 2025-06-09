import { toast } from "@/hooks/use-toast";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface BankAccount {
  id: string;
  name: string;
  balance: number;
  type: "CHECKING" | "SAVINGS" | "CREDIT_CARD" | "INVESTMENT";
}

interface AccountState {
  accounts: BankAccount[];
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  accounts: [],
  loading: false,
  error: null,
};

export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAccounts",
  async () => {
    const response = await fetch("/api/accounts");
    if (!response.ok) {
      throw new Error("Failed to fetch accounts");
    }
    return response.json();
  }
);

export const addAccount = createAsyncThunk(
  "accounts/addAccount",
  async (account: Omit<BankAccount, "id">) => {
    const response = await fetch("/api/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(account),
    });
    if (!response.ok) {
      throw new Error("Failed to add account");
    }
    return response.json();
  }
);

export const updateAccount = createAsyncThunk(
  "accounts/updateAccount",
  async (account: BankAccount) => {
    const response = await fetch("/api/accounts", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(account),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update account");
    }
    return response.json();
  }
);

export const deleteAccount = createAsyncThunk(
  "accounts/deleteAccount",
  async (id: string) => {
    const response = await fetch("/api/accounts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete account");
    }
    return id;
  }
);

const accountSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch accounts";
      })
      .addCase(addAccount.fulfilled, (state, action) => {
        state.accounts.push(action.payload);
      })

      .addCase(updateAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.accounts.findIndex(
          (acc) => acc.id === action.payload.id
        );
        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update account";
      })

      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = state.accounts.filter(
          (acc) => acc.id !== action.payload
        );
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete account";

        toast({
          title: "Error",
          description: "Failed to delete account",
          variant: "destructive",
        });
      });
  },
});

export default accountSlice.reducer;
