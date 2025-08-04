"use client";

import React, { useEffect } from "react";
import { useAppDispatch } from "./hooks";
import { fetchLookups, setLookups } from "./lookupsSlice";

interface LookupsProviderProps {
  children: React.ReactNode;
  lookups?: any;
}

export const LookupsProvider: React.FC<LookupsProviderProps> = ({
  children,
  lookups,
}) => {
  const dispatch = useAppDispatch() as any;

  useEffect(() => {
    if (lookups) {
      dispatch(setLookups(lookups)); // hydrate Redux with SSR lookups
    } else {
      dispatch(fetchLookups()); // fallback: fetch on client if not provided
    }
  }, [dispatch, lookups]);

  return <>{children}</>;
};
