import {
  selectFeaturesById,
  selectListingStatuses,
  selectListingTypes,
  selectOwnershipTypes
} from "@/store/lookups";
import {
  getFeatureLabelById,
  getListingStatusLabelById,
  getListingTypeLabelById,
  getLocationNameById,
  getOwnershipLabelById,
} from "@/utils/lookupLabelUtils";
import { useSelector } from "react-redux";

import { ListingStatus, ListingType, OwnershipType } from "@/lib/types";
import { Feature } from "@/lib/types";

export function useOwnershipLabel(id: number, locale: string) {
  const ownershipTypes = useSelector(selectOwnershipTypes) as OwnershipType[];
  return getOwnershipLabelById(id, locale, ownershipTypes);
}

export function useListingTypeLabel(id: number, locale: string) {
  const listingTypes = useSelector(selectListingTypes) as ListingType[];
  return getListingTypeLabelById(id, locale, listingTypes);
}

export function useListingStatusLabel(id: number, locale: string) {
  const listingStatuses = useSelector(selectListingStatuses) as ListingStatus[];
  return getListingStatusLabelById(id, locale, listingStatuses);
}

export function useLocationLabel(id: number) {
  const locations = useSelector((state: any) => state.lookups.locations) as {
    id: number;
    name: string;
    sort_order: number;
  }[];
  return getLocationNameById(id, locations);
}

export function useFeatureLabel(id: number, locale: string) {
  const features = useSelector(selectFeaturesById) as Feature[];
  return getFeatureLabelById(id, locale, features);
}
