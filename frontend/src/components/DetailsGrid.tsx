"use client";

import type { Property } from "@/components/PropertyCard";
import {
    Bath,
    Bed,
    Calendar,
    Crop,
    Hash,
    Key,
    Square,
    Tag,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

export default function DetailsGrid({
  listing,
  lookups,
  locale = "en",
}: {
  listing: Property;
  lookups?: any;
  locale?: string;
}) {
  if (!listing) return null;

  const t = useTranslations("ListingDetail");

  // Display only sqm values — no sqft conversion

  const getLabel = <T extends { id: number; labels: Record<string, string> }>(
    type: keyof typeof lookups,
    id: number | string | undefined
  ) => {
    if (!id) return "";
    if (
      !lookups ||
      !lookups[type] ||
      !Array.isArray(lookups[type]) ||
      lookups[type].length === 0
    )
      return "";
    const arr = lookups[type] as T[];
    const item = arr.find((i) => String(i.id) === String(id));
    return (
      item?.labels?.[locale as string] ||
      item?.labels?.en ||
      item?.labels?.id ||
      item?.labels?.es ||
      ""
    );
  };

  const items: Array<{
    key: string;
    label: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
  }> = [];

  // Only include fields in the overview when there's actual data for them
  if (listing.listing_id != null && String(listing.listing_id).trim() !== "") {
    items.push({
      key: "id",
      label: t("property_id"),
      value: listing.listing_id,
      icon: <Hash className="h-5 w-5 text-gray-600" />,
    });
  }

  const ownershipLabel =
    getLabel("ownership_types", (listing as any).ownership_type_id) ||
    (listing as any).ownership_type_name;
  if (ownershipLabel && String(ownershipLabel).trim() !== "") {
    items.push({
      key: "ownership",
      label: t("ownership"),
      value: ownershipLabel,
      icon: <Key className="h-5 w-5 text-gray-600" />,
    });
  }

  const typeLabel =
    getLabel("listing_types", (listing as any).listing_type_id) ||
    (listing as any).listing_type_name;
  if (typeLabel && String(typeLabel).trim() !== "") {
    items.push({
      key: "type",
      label: t("property_type"),
      value: typeLabel,
      icon: <Tag className="h-5 w-5 text-gray-600" />,
    });
  }

  if (listing.bedrooms != null)
    items.push({
      key: "beds",
      label: t("bedrooms"),
      value: String(listing.bedrooms),
      icon: <Bed className="h-5 w-5 text-gray-600" />,
    });
  if (listing.bathrooms != null)
    items.push({
      key: "baths",
      label: t("bathrooms"),
      value: String(listing.bathrooms),
      icon: <Bath className="h-5 w-5 text-gray-600" />,
    });
  if (listing.building_size_sqm != null)
    items.push({
      key: "building",
      label: t("building_size"),
      value: `${listing.building_size_sqm} m²`,
      icon: <Square className="h-5 w-5 text-gray-600" />,
    });
  if (listing.land_size_sqm != null)
    items.push({
      key: "land",
      label: t("land_size"),
      value: `${listing.land_size_sqm} m²`,
      icon: <Crop className="h-5 w-5 text-gray-600" />,
    });

  if (listing.year_built != null && String(listing.year_built).trim() !== "") {
    items.push({
      key: "year",
      label: t("year_built"),
      value: String(listing.year_built),
      icon: <Calendar className="h-5 w-5 text-gray-600" />,
    });
  }

  return (
    <section aria-labelledby="overview-heading" className="mt-4">
      <div className="bg-white border border-gray-100 rounded-md p-4">
        <h3
          id="overview-heading"
          className="text-sm font-semibold text-gray-700 mb-3"
        >
          {t("overview_heading")}
        </h3>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {items.map((it) => (
            <div key={it.key} className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 text-gray-600">
                  {it.icon}
                </div>
                <div className="min-w-0">
                  <dt className="text-xs text-gray-500 truncate">{it.label}</dt>
                  <dd
                    className="mt-0.5 text-sm font-medium text-gray-800 truncate"
                    title={String(it.value)}
                  >
                    {it.value}
                  </dd>
                </div>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
