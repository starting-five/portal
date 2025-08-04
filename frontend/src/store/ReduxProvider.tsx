// ReduxProvider.tsx
"use client";

import React from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const store = makeStore(); // creates a new store per request
  return <Provider store={store}>{children}</Provider>;
}
