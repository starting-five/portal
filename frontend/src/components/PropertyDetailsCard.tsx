"use client";
import { Bath, Bed, Crop, Square } from "lucide-react";
import React from "react";

export interface PropertyDetailsCardProps {
  listingRef?: string;
  location?: string;
  price?: string | number;
  bedrooms?: number | string;
  bathrooms?: number | string;
  building_size_sqm?: number | string;
  land_size_sqm?: number | string;
  year_built?: number | string;
  features?: string[];
  badges?: string[];
  locale?: string;
  currency?: string;
}

export default function PropertyDetailsCard(props: PropertyDetailsCardProps) {
  const {
    listingRef,
    location,
    price,
    bedrooms,
    bathrooms,
    building_size_sqm,
    land_size_sqm,
    year_built,
    features,
    badges,
    locale,
    currency,
  } = props;

  const facts: Array<{ key: string; icon: React.ReactNode; label: string }> =
    [];
  if (bedrooms != null)
    facts.push({
      key: "beds",
      icon: <Bed className="h-4 w-4 text-gray-600" />,
      label: String(bedrooms),
    });
  if (bathrooms != null)
    facts.push({
      key: "baths",
      icon: <Bath className="h-4 w-4 text-gray-600" />,
      label: String(bathrooms),
    });
  if (building_size_sqm != null)
    facts.push({
      key: "bld",
      icon: <Square className="h-4 w-4 text-gray-600" />,
      label: `${building_size_sqm} m²`,
    });
  if (land_size_sqm != null)
    facts.push({
      key: "lot",
      icon: <Crop className="h-4 w-4 text-gray-600" />,
      label: `${land_size_sqm} m²`,
    });

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6">
      {/* Top badges */}
      {badges && badges.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {badges.map((b, i) => (
            <div
              key={i}
              className="bg-gray-100 text-sm text-gray-700 px-3 py-1 rounded-full"
            >
              {b}
            </div>
          ))}
        </div>
      )}

      {/* Listing reference */}
      <div className="flex items-start justify-between">
        <div />
        {listingRef && (
          <div className="text-sm text-gray-400">#{listingRef}</div>
        )}
      </div>

      {/* Compact facts row to make the card feel more substantial (no duplication of full grid) */}
      {facts.length > 0 && (
        <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-gray-700">
          {facts.map((f) => (
            <div key={f.key} className="flex items-center gap-2">
              <div className="text-gray-600">{f.icon}</div>
              <div className="text-sm text-gray-800">{f.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
