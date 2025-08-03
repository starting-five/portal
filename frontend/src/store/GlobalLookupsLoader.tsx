"use client";

import { useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";
import { fetchLookups } from "@/store/lookupsSlice";

export default function GlobalLookupsLoader() {
  const dispatch = useAppDispatch() as any;
  useEffect(() => {
    dispatch(fetchLookups());
  }, [dispatch]);
  return null;
}
// This component is used to trigger the fetchLookups action on app load
// It does not render anything but ensures lookups are available globally
// Make sure to include this component in your RootLayout or main app component
// to ensure lookups are fetched when the app initializes.
