"use client";

import DetailsGrid from "@/components/DetailsGrid";
import ListingGallery from "@/components/ListingGallery";
import type { Property } from "@/components/PropertyCard";
import { useAppSelector } from "@/store/hooks";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Expandable description component
function ExpandableDescription({ description }: { description: string }) {
  const t = useTranslations("ListingDetail");
  const [isExpanded, setIsExpanded] = useState(false);
  const CHAR_LIMIT = 600;
  
  // Check if description needs truncation
  const needsTruncation = description.length > CHAR_LIMIT;
  
  // Get truncated text at a natural break point (end of sentence or word)
  const getTruncatedText = () => {
    if (!needsTruncation) return description;
    
    let truncated = description.substring(0, CHAR_LIMIT);
    // Try to break at the end of a sentence
    const lastPeriod = truncated.lastIndexOf('.');
    if (lastPeriod > CHAR_LIMIT * 0.7) {
      return description.substring(0, lastPeriod + 1);
    }
    
    // Otherwise break at the end of a word
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 0) {
      return description.substring(0, lastSpace) + '...';
    }
    
    return truncated + '...';
  };

  const displayText = isExpanded ? description : getTruncatedText();

  return (
    <div className="text-gray-600 text-sm leading-6">
      <div className="whitespace-pre-wrap">
        {displayText}
      </div>
      {needsTruncation && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-gray-600 hover:text-gray-800 text-sm transition-colors duration-200 flex items-center gap-1 cursor-pointer"
        >
          {isExpanded ? (
            <>
              {t("show_less")}
              <ChevronUp size={14} />
            </>
          ) : (
            <>
              {t("show_more")}
              <ChevronDown size={14} />
            </>
          )}
        </button>
      )}
    </div>
  );
}

export default function ListingDetailPage() {
  const reduxListing = useAppSelector((state) => state.selectedListing.current);
  const [listing, setListing] = useState<Property | null>(reduxListing || null);
  const [loading, setLoading] = useState(!reduxListing);

  // description/title will be rendered as children of ListingGallery so it lines
  // up with the gallery wrapper (no JS width measurement required)

  useEffect(() => {
    if (reduxListing) {
      setListing(reduxListing);
      setLoading(false);
      return;
    }
    // Fallback: fetch listing data from API
    const pathParts =
      typeof window !== "undefined" ? window.location.pathname.split("/") : [];
    const context = pathParts[pathParts.length - 3];
    const listingId = pathParts[pathParts.length - 1];
    if (context && listingId) {
      fetch(`/api/listings/${context}/${listingId}`)
        .then((res) => res.json())
        .then((data) => setListing(data))
        .catch(() => setListing(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [reduxListing]);

  if (loading) return <div>Loading...</div>;
  if (!listing) return <div>Listing not found.</div>;

  // lookups from redux (same pattern as PropertyCard)
  const lookups = useAppSelector((state) => state.lookups);
  const params = useParams() as { locale?: string } | null;
  const routeLocale = params?.locale || "en";

  const t = useTranslations("ListingDetail");

  const getLocationLabel = (id: number | undefined) => {
    if (!id) return "";
    if (
      !lookups ||
      !lookups.locations ||
      !Array.isArray(lookups.locations) ||
      lookups.locations.length === 0
    )
      return "";
    const location = (
      lookups.locations as Array<{ id: number; name: string }>
    ).find((l) => l.id === id);
    return location?.name || "";
  };

  const getFeatureLabel = (feature: number | { id: number } | string) => {
    if (typeof feature === "string") return feature;
    const id = typeof feature === "object" ? feature.id : feature;
    if (
      !lookups ||
      !lookups.features_by_id ||
      Object.keys(lookups.features_by_id).length === 0
    )
      return "";
    const featureData = lookups.features_by_id[id] as
      | { labels?: Record<string, string> }
      | undefined;
    return (
      featureData?.labels?.[routeLocale as string] ||
      featureData?.labels?.en ||
      featureData?.labels?.id ||
      featureData?.labels?.es ||
      ""
    );
  };

  // use same lookup labels as PropertyCard for the three top pills: ownership, listing type, status
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
      item?.labels?.[routeLocale as string] ||
      item?.labels?.en ||
      item?.labels?.id ||
      item?.labels?.es ||
      ""
    );
  };

  const badgeLabels = [
    getLabel("ownership_types", (listing as any).ownership_type_id),
    getLabel("listing_types", (listing as any).listing_type_id),
    getLabel("listing_statuses", (listing as any).status_id),
  ].filter(Boolean) as string[];

  const topFeatures = badgeLabels.slice(0, 3);
  const locationName =
    getLocationLabel((listing as any).location_id) ||
    (listing as any).location_name ||
    (listing as any).city ||
    "";
  const formatPrice = (value: any) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (Number.isFinite(num)) {
      try {
        // Use currency code prefix (IDR) to match PropertyCard's display
        return `IDR ${new Intl.NumberFormat("id-ID", {
          maximumFractionDigits: 0,
        }).format(num)}`;
      } catch (e) {
        return String(num);
      }
    }
    return String(value ?? "");
  };

  return (
    <div className="py-8">
      {/* Title moved above the gallery but kept inside the same centered wrapper for alignment */}
      <div className="max-w-[1400px] mx-auto px-6 mb-[6px]">
        <div className="max-w-[1100px]">
          <h1 className="text-2xl font-bold">{listing.title}</h1>

          {/* Top features (3) - inline chips */}
          {topFeatures.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {topFeatures.map((t, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Location left / Price right on the same row, aligned to the outer wrapper */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-600 mr-2 mt-0.5" />
            <span>{locationName || "Unknown location"}</span>
          </div>
          <div className="text-2xl md:text-3xl font-semibold">
            {formatPrice((listing as any).price)}
          </div>
        </div>
      </div>

      <ListingGallery 
        images={listing.images?.map(img => img.url) || []} 
        youtubeUrl={listing.youtube_url || undefined}
        kuulaUrl={listing.kuula_url || undefined}
      >
        <div className="mt-6 text-left">
          {/* Structured details grid (no location/price duplication) */}
          <DetailsGrid
            listing={listing}
            lookups={lookups}
            locale={routeLocale}
          />

          {/* Description / About card */}
          <div className="mt-4">
            <div className="bg-white border border-gray-100 rounded-md p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">
                {t("about_heading")}
              </h2>
              {listing.description ? (
                <ExpandableDescription description={listing.description} />
              ) : (
                <div className="text-gray-500 text-sm">
                  No description provided.
                </div>
              )}
            </div>
          </div>

          {/* Features card (separate from About) */}
          {Array.isArray((listing as any).features) &&
            (listing as any).features.length > 0 && (
              <div className="mt-3">
                <div className="bg-white border border-gray-100 rounded-md p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    {t("features_heading")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(listing as any).features.map((f: any, i: number) => {
                      const label = getFeatureLabel(f);
                      return (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800"
                        >
                          {label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
        </div>
      </ListingGallery>
    </div>
  );
}
