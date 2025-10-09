// Application-wide constants for listing statuses, pagination, etc.
// Update these values if backend status IDs or business logic changes

export const LISTING_STATUS_IDS = {
  ACTIVE: [1, 2, 3, 4, 5], // Example: replace with your actual active status IDs
  DRAFT: [6], // Example: replace with your actual draft status ID(s)
  ARCHIVE: [7], // Example: replace with your actual archive status ID(s)
};

export const PAGINATION = {
  LISTINGS_PAGE_SIZE: 6, // Default number of listings per page
};

export type ListingStatusGroup = keyof typeof LISTING_STATUS_IDS;
