import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import authUserReducer from "./authUserSlice";
import lookupsReducer from "./lookupsSlice";

// Combine all your reducers
const combinedReducer = combineReducers({
  lookups: lookupsReducer,
  authUser: authUserReducer,
  // add other reducers here
});

// Root reducer to handle HYDRATE
const rootReducer = (state: any, action: any) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // previous state
      ...action.payload, // server state
    };
    // Preserve client-only state for authUser
    if (state?.authUser) {
      nextState.authUser = state.authUser;
    }
    return nextState;
  }
  return combinedReducer(state, action);
};

// Create the store
// Create a makeStore function for SSR compatibility
export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

// Create and export a singleton store instance
export const store = makeStore();

// Types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
