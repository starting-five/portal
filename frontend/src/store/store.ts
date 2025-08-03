import { configureStore } from "@reduxjs/toolkit";
import lookupsReducer from "./lookupsSlice";

// Export a function that creates a new store instance
export const makeStore = () =>
  configureStore({
    reducer: {
      lookups: lookupsReducer,
    },
  });

export type RootState = ReturnType<ReturnType<typeof makeStore>["getState"]>;
export type AppDispatch = ReturnType<ReturnType<typeof makeStore>["dispatch"]>;
