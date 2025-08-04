// Utility to get the localized ownership type label

import {
  Feature,
  FeatureCategory,
  ListingStatus,
  ListingType,
  Location,
  OwnershipType,
} from "@/lib/types";

/**
 * Get the localized label for an ownership type by id.
 * @param id The ownership type id
 * @param locale The current locale (e.g. 'en', 'id', 'es')
 * @param ownershipTypes The array of ownership types
 * @returns The localized label, or fallback to 'en', or empty string
 */
export function getOwnershipLabelById(
  id: number | undefined,
  locale: string,
  ownershipTypes: OwnershipType[]
): string {
  if (!id || !ownershipTypes) return "";
  const ownershipType = ownershipTypes.find((ot) => ot.id === id);
  if (!ownershipType || !ownershipType.labels) return "";
  return (
    ownershipType.labels[locale] ||
    ownershipType.labels["en"] ||
    Object.values(ownershipType.labels)[0] ||
    ""
  );
}

export function getListingTypeLabelById(
  id: number | undefined,
  locale: string,
  listingTypes: ListingType[]
): string {
  if (!id || !listingTypes) return "";
  const listingType = listingTypes.find((lt) => lt.id === id);
  if (!listingType || !listingType.labels) return "";
  return (
    listingType.labels[locale] ||
    listingType.labels["en"] ||
    Object.values(listingType.labels)[0] ||
    ""
  );
}

export function getListingStatusLabelById(
  id: number | undefined,
  locale: string,
  listingStatuses: ListingStatus[]
): string {
  if (!id || !listingStatuses) return "";
  const listingStatus = listingStatuses.find((ls) => ls.id === id);
  if (!listingStatus || !listingStatus.labels) return "";
  return (
    listingStatus.labels[locale] ||
    listingStatus.labels["en"] ||
    Object.values(listingStatus.labels)[0] ||
    ""
  );
}

export function getFeatureLabelById(
  id: number | undefined,
  locale: string,
  featuresById: { [id: number]: Feature }
): string {
  if (!id || !featuresById) return "";
  const feature = featuresById[id];
  if (!feature || !feature.labels) return "";
  return (
    feature.labels[locale] ||
    feature.labels["en"] ||
    Object.values(feature.labels)[0] ||
    ""
  );
}

export function getFeatureCategoryLabelById(
  id: number | undefined,
  locale: string,
  featureCategories: FeatureCategory[]
): string {
  if (!id || !featureCategories) return "";
  const featureCategory = featureCategories.find((fc) => fc.id === id);
  if (!featureCategory || !featureCategory.labels) return "";
  return (
    featureCategory.labels[locale] ||
    featureCategory.labels["en"] ||
    Object.values(featureCategory.labels)[0] ||
    ""
  );
}

export function getLocationLabelById(
  id: number | undefined,
  locale: string,
  locations: { id: number; name: string; sort_order: number }[]
): string {
  if (!id || !locations) return "";
  const location = locations.find((loc) => loc.id === id);
  if (!location) return "";
  return location.name; // Assuming name is already localized
}

export function getLocationNameById(
  id: number | undefined,
  locations: Location[]
): string {
  if (!id || !locations) return "";
  const location = locations.find((loc) => loc.id === id);
  return location ? location.name : "";
}
