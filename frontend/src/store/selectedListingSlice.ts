import type { Property } from "@/components/PropertyCard";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Simple wrapper to work with Redux Toolkit's expectations
interface SelectedListingState {
  current: Property | null;
}

const initialState: SelectedListingState = {
  current: null,
};

const selectedListingSlice = createSlice({
  name: "selectedListing",
  initialState,
  reducers: {
    // Set the current property
    setSelectedListing: (state, action: PayloadAction<Property>) => {
      state.current = action.payload;
    },
    // Clear the current property
    clearSelectedListing: (state) => {
      state.current = null;
    },
  },
});

export const { setSelectedListing, clearSelectedListing } =
  selectedListingSlice.actions;

// Selector helper for easy access
export const selectSelectedListing = (state: {
  selectedListing: SelectedListingState;
}) => state.selectedListing.current;

export default selectedListingSlice.reducer;
