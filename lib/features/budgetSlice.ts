import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  period: "WEEKLY" | "MONTHLY" | "YEARLY";
  startDate: string;
  endDate: string;
  categories?: { id: string }[];
  categoryIds?: string[];
}

interface BudgetState {
  budgets: Budget[];
  loading: boolean;
  loadingAddAndUpdate: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  budgets: [],
  loading: false,
  loadingAddAndUpdate: false,
  error: null,
};

export const fetchBudgets = createAsyncThunk(
  "budgets/fetchBudgets",
  async () => {
    const response = await fetch("/api/budgets");
    if (!response.ok) {
      throw new Error("Failed to fetch budgets");
    }
    return response.json();
  }
);

export const addBudget = createAsyncThunk(
  "budgets/addBudget",
  async (budget: Omit<Budget, "id" | "spent" | "categories">) => {
    const response = await fetch("/api/budgets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(budget),
    });
    if (!response.ok) {
      throw new Error("Failed to add budget");
    }
    return response.json();
  }
);

export const updateBudget = createAsyncThunk(
  "budgets/updateBudget",
  async (budget: Omit<Budget, "spent" | "categories">) => {
    const response = await fetch(`/api/budgets`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(budget),
    });
    if (!response.ok) {
      throw new Error("Failed to update budget");
    }
    return response.json();
  }
);

export const deleteBudget = createAsyncThunk(
  "budgets/deleteBudget",
  async (id: string) => {
    const response = await fetch(`/api/budgets`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      throw new Error("Failed to delete budget");
    }
    return id;
  }
);

const budgetSlice = createSlice({
  name: "budgets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch budgets";
      })

      .addCase(addBudget.pending, (state) => {
        state.loadingAddAndUpdate = true;
        state.error = null;
      })
      .addCase(addBudget.fulfilled, (state, action) => {
        state.loadingAddAndUpdate = false;
        state.budgets.push(action.payload);
      })
      .addCase(addBudget.rejected, (state, action) => {
        state.loadingAddAndUpdate = false;
        state.error = action.error.message || "Failed to add budget";
      })

      .addCase(updateBudget.pending, (state) => {
        state.loadingAddAndUpdate = true;
        state.error = null;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.loadingAddAndUpdate = false;
        const index = state.budgets.findIndex(
          (budget) => budget.id === action.payload.id
        );
        if (index !== -1) {
          const oldBudget = state.budgets[index];
          state.budgets[index] = { ...oldBudget, ...action.payload };
        }
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.loadingAddAndUpdate = false;
        state.error = action.error.message || "Failed to update budget";
      })

      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.budgets = state.budgets.filter(
          (budget) => budget.id !== action.payload
        );
      });
  },
});

export default budgetSlice.reducer;
