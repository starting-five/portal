export type Currency = {
  id: number;
  code: string;
  name: string;
};

export type Feature = {
  id: number;
  name: string;
  category: string;
};

export type ListingImage = {
  id: number;
  listing_id: number;
  url: string;
};

export type ListingStatus = {
  id: number;
  name: string;
};

export type ListingType = {
  id: number;
  name: string;
};

export type Location = {
  id: number;
  name: string;
};

export type OwnershipType = {
  id: number;
  name: string;
};

export type PriceUnit = {
  id: number;
  name: string;
};

// A more generic type for listings on the list page,
// as the ListingCard is designed to display any property.
export type Listing = {
  id: number;
  listing_id: number;
  [key: string]: unknown;
};

export type ListingFormState = {
  title: string;
  description: string;
  listing_type_id: number | null;
  ownership_type_id: number | null;
  location_id: number | null;
  bedrooms: number | string;
  bathrooms: number | string;
  land_size_sqm: number | string;
  building_size_sqm: number | string;
  status_id: number | null;
  price: number | string;
  currency_id: number | null;
  price_unit_id: number | null;
  year_built: number | string;
  facilities: string;
  features: number[];
};

export type DropdownOption = {
  id: number;
  name?: string;
  code?: string;
};
