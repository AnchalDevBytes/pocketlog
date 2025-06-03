import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export interface Category {
  id: string
  name: string
  color: string
  icon: string
  type: "INCOME" | "EXPENSE"
}

interface CategoryState {
  categories: Category[]
  loading: boolean
  error: string | null
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
}

export const fetchCategories = createAsyncThunk("categories/fetchCategories", async () => {
  const response = await fetch("/api/categories")
  if (!response.ok) {
    throw new Error("Failed to fetch categories")
  }
  return response.json()
})

export const addCategory = createAsyncThunk("categories/addCategory", async (category: Omit<Category, "id">) => {
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  })
  if (!response.ok) {
    throw new Error("Failed to add category")
  }
  return response.json()
})

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch categories"
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload)
      })
  },
})

export default categorySlice.reducer
