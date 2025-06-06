import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: "INCOME" | "EXPENSE";
}

interface CategoryState {
  categories: Category[];
  categoryFetchLoading: boolean;
  categoryAddLoading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  categoryAddLoading: false,
  categoryFetchLoading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const response = await fetch("/api/categories");
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return response.json();
  }
);

export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async (category: Omit<Category, "id">, { rejectWithValue }) => {
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    });
    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.error || "Failed to add category");
    }

    return data;
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.categoryFetchLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoryFetchLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoryFetchLoading = false;
        state.error = action.error.message || "Failed to fetch categories";
      })

      .addCase(addCategory.pending, (state) => {
        state.categoryAddLoading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categoryAddLoading = false;
        state.categories.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.categoryAddLoading = false;
        state.error = action.error.message || "Failed to add category";
      });
  },
});

export default categorySlice.reducer;
