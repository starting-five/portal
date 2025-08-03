// Selectors for lookups
// Adjust RootState import path if needed
import { RootState } from "./store";

export const selectOwnershipTypes = (state: RootState) =>
  state.lookups.ownership_types;
export const selectListingTypes = (state: RootState) =>
  state.lookups.listing_types;
export const selectListingStatuses = (state: RootState) =>
  state.lookups.listing_statuses;
export const selectFeatures = (state: RootState) => state.lookups.features;
export const selectFeaturesById = (state: RootState) =>
  state.lookups.features_by_id;
export const selectLocations = (state: RootState) => state.lookups.locations;
