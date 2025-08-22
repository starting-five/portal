export type Feature = {
  id: number;
  key: string;
  sort_order: number;
  labels: Record<string, string>;
};

export type ListingImage = {
  id: number;
  listing_id: number;
  url: string;
  alt_text?: string;
  sort_order?: number;
  created_at?: string;
};

export type ListingType = {
  id: number;
  key: string;
  sort_order: number;
  labels: Record<string, string>;
};

export type Location = {
  id: number;
  name: string;
  sort_order: number;
};

export type OwnershipType = {
  id: number;
  key: string;
  sort_order: number;
  labels: Record<string, string>;
};

export type Listing = {
  id: number;
  listing_id: number;
  images: ListingImage[];
  [key: string]: unknown;
};

export type ListingFormState = {
  title: string;
  description: string;
  listing_type_id: number;
  ownership_type_id: number;
  location_id: number;
  bedrooms: number;
  bathrooms: number;
  land_size_sqm: number;
  building_size_sqm: number;
  status_id: number;
  price: number;
  year_built: number;
  features: number[];
};

export type DropdownOption = {
  id: number;
  name?: string;
  code?: string;
};

export type ListingStatus = {
  id: number;
  key: string;
  sort_order: number;
  labels: Record<string, string>;
};

export type FeatureItem = {
  id: number;
  key: string;
  category_key: string;
  sort_order: number;
  labels: Record<string, string>;
};

export type FeatureCategoryWithItems = {
  key: string;
  sort_order: number;
  labels: Record<string, string>;
  items: FeatureItem[];
};

export type FeatureCategory = {
  id: number;
  key: string;
  sort_order: number;
  labels: Record<string, string>;
};
