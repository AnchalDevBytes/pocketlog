import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "./features/transactionSlice";
import categoryReducer from "./features/categorySlice";
import accountReducer from "./features/accountSlice";
import budgetReducer from "./features/budgetSlice";
import profileReducer from "./features/profileSlice";

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    categories: categoryReducer,
    accounts: accountReducer,
    budgets: budgetReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
