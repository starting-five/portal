"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  Bed,
  Calendar,
  CameraOff,
  Crop,
  Hash,
  LayoutGrid,
  MapPin,
  Pencil,
  Square,
  Sunrise,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import { deleteListing } from "@/lib/api/listings";
import { getCurrentUserJWT } from "@/lib/supabase/getCurrentUserJWT";
import { toast } from "sonner";

import {
  useFeatureLabel,
  useListingStatusLabel,
  useListingTypeLabel,
  useLocationLabel,
  useOwnershipLabel,
} from "@/hooks/useLookupLabels";
import type { ListingImage } from "@/lib/types";

// Property type definition
export type Property = {
  id: number;
  listing_id: string;
  title: string;
  location_id: number;
  price: string;
  images: ListingImage[];
  listing_type_id: number;
  ownership_type_id: number;
  status_id: number;
  user_id?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  building_size_sqm?: number | null;
  land_size_sqm?: number | null;
  year_built?: number | null;
  handover?: string | null;
  price_per_sqm?: string | null;
  features?: number[];
  description?: string;
};

interface PropertyCardProps {
  property: Property;
  locale?: string;
}

export default function PropertyCard({ property, locale }: PropertyCardProps) {
  const tCard = useTranslations("PropertyCard");
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [isFading, setIsFading] = React.useState(false);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);

  // Get current user ID on mount for UI display logic only
  React.useEffect(() => {
    const getCurrentUserId = async () => {
      try {
        const jwt = await getCurrentUserJWT();
        if (jwt) {
          const payload = JSON.parse(atob(jwt.split(".")[1]));
          setCurrentUserId(payload.sub);
        }
      } catch (error) {
        // Silently fail - not critical for functionality
      }
    };
    getCurrentUserId();
  }, []);

  // Simple UI logic: show buttons if user IDs match (backend handles real security)
  const canShowEditDelete = currentUserId && property.user_id === currentUserId;

  async function handleDelete() {
    try {
      setIsFading(true);
      // Get JWT for authentication
      const jwt = await getCurrentUserJWT();
      await deleteListing(property.listing_id, jwt || undefined);
      setDialogOpen(false);
      toast.success(tCard("deleted_success"));
    } catch (error: any) {
      setIsFading(false);
      toast.error(error?.message || tCard("delete_failed"));
    }
  }

  React.useEffect(() => {
    if (isFading) {
      const timeout = setTimeout(() => {
        router.refresh();
      }, 600); // match fade duration
      return () => clearTimeout(timeout);
    }
  }, [isFading, router]);

  const t = useTranslations("Features");
  const [currentSlide, setCurrentSlide] = React.useState(0);
  // Memoize keen-slider options to prevent remounts on resize
  const sliderOptions = React.useMemo(
    () => ({
      initial: 0,
      slideChanged(slider: any) {
        setCurrentSlide(slider.track.details.rel);
      },
      loop: true,
    }),
    []
  );
  const [sliderRef, instanceRef] = useKeenSlider(sliderOptions);

  // Only show keen-slider arrows on hover for desktop, always show for touch devices
  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  // Lookup labels using custom hooks
  // These hooks will fetch the necessary data from Redux store and return the localized label
  // This avoids the need to pass ownershipTypes, listingTypes, etc. as props
  // This is more efficient and keeps the component cleaner

  const ownershipLabel = useOwnershipLabel(
    property.ownership_type_id,
    locale || "en"
  );

  const listingTypeLabel = useListingTypeLabel(
    property.listing_type_id,
    locale || "en"
  );

  const listingStatusLabel = useListingStatusLabel(
    property.status_id,
    locale || "en"
  );

  const location = useLocationLabel(property.location_id);

  // const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
  //   // Prevent navigation if clicking edit/delete buttons
  //   if ((e.target as HTMLElement).closest('.property-action')) return;
  //   router.push(`/${locale || "en"}/dashboard/listings/${property.listing_id}`);
  // };

  return (
    <div
      className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg w-full mx-auto flex flex-col cursor-pointer"
      style={{
        pointerEvents: isFading ? "none" : undefined,
        opacity: isFading ? 0 : 1,
        transition: "opacity 600ms",
      }}
      role="button"
      tabIndex={0}
      aria-label={property.title}
    >
      {/* Edit and Delete buttons top-right - only show if user owns the listing */}
      {canShowEditDelete && (
        <div className="absolute top-3 right-3 z-20 flex gap-2">
          <Link
            href={`/${locale || ""}/dashboard/listings/${
              property.listing_id
            }/edit`}
            className="property-action rounded-full bg-white/80 p-2 text-gray-700 shadow hover:bg-blue-100 hover:text-blue-600 transition"
            title="Edit listing"
            onClick={(e) => e.stopPropagation()}
          >
            <Pencil className="h-3 w-3" />
          </Link>
          <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                className="property-action rounded-full bg-white/80 p-2 text-red-600 shadow hover:bg-red-100 hover:text-red-700 transition"
                title={tCard("delete_title")}
                onClick={(e) => {
                  e.stopPropagation();
                  setDialogOpen(true);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{tCard("delete_title")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {tCard("delete_confirm")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{tCard("cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {tCard("delete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
      {/* Grouped Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
          {ownershipLabel}
        </span>
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
          {listingTypeLabel}
        </span>
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
          {listingStatusLabel}
        </span>
      </div>
      {/* Property Image Carousel with fallback */}
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-gray-200">
        {property.images && property.images.length > 1 ? (
          <div
            ref={sliderRef}
            className="keen-slider h-full w-full"
            tabIndex={0}
            aria-label="Property images carousel"
          >
            {property.images.map((img, idx) => (
              <div
                className="keen-slider__slide h-full w-full flex items-center justify-center bg-gray-200"
                key={idx}
              >
                <Image
                  src={img.url}
                  alt={img.alt_text || "Property image"}
                  width={900}
                  height={600}
                  className="max-h-full max-w-full object-contain mx-auto my-auto transition-transform duration-300 group-hover:scale-105"
                  style={{ aspectRatio: "3/2", display: "block" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/window.svg";
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-200">
            {property.images && property.images.length === 1 ? (
              <Image
                src={property.images[0].url}
                alt={property.title || "Property image"}
                width={900}
                height={600}
                className="max-h-full max-w-full object-contain mx-auto my-auto"
                style={{ aspectRatio: "3/2", display: "block" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/window.svg";
                }}
              />
            ) : (
              <span className="flex flex-col items-center justify-center w-full h-full">
                <CameraOff
                  className="h-16 w-16 text-gray-400"
                  aria-label={tCard("no_photos_available")}
                />
                <span className="mt-2 text-sm text-gray-500">
                  {tCard("no_photos_available")}
                </span>
              </span>
            )}
          </div>
        )}
        {/* Arrows */}
        {property.images && property.images.length > 1 && (
          <div
            className={
              isTouchDevice
                ? ""
                : "opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            }
          >
            <button
              className="absolute top-1/2 left-2 z-20 -translate-y-1/2 rounded-full bg-gray-900/60 p-1 text-white hover:bg-gray-900"
              onClick={() => instanceRef.current?.prev()}
              aria-label="Previous image"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              className="absolute top-1/2 right-2 z-20 -translate-y-1/2 rounded-full bg-gray-900/60 p-1 text-white hover:bg-gray-900"
              onClick={() => instanceRef.current?.next()}
              aria-label="Next image"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}
        {/* Image count overlay */}
        {property.images && property.images.length > 1 && (
          <span className="absolute right-2 bottom-2 flex items-center gap-1 rounded-full bg-gray-900/80 px-2 py-1 text-xs text-white">
            <LayoutGrid className="h-3 w-3" />
            {(() => {
              const imageCount = property.images.length;
              return `${(currentSlide % imageCount) + 1}/${imageCount}`;
            })()}
          </span>
        )}
      </div>
      {/* Property Details */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {property.title}
              </h3>
            </div>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="inline-flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-gray-400" />
              {location}
            </span>
            {property.listing_id && (
              <span className="inline-flex items-center gap-0 text-sm text-gray-600 ml-2">
                <Hash className="h-4 w-4 text-gray-400" />
                {property.listing_id}
              </span>
            )}
          </div>
          {/* Icon-based Property Stats */}
          <div className="mt-4 flex items-center space-x-4 min-h-[32px]">
            {property.bedrooms != null && property.bedrooms !== 0 && (
              <div className="flex items-center space-x-1">
                <Bed className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {property.bedrooms}
                </span>
              </div>
            )}
            {property.bathrooms != null && property.bathrooms !== 0 && (
              <div className="flex items-center space-x-1">
                <Bath className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {property.bathrooms}
                </span>
              </div>
            )}
            {property.building_size_sqm != null && (
              <div className="flex items-center space-x-1">
                <Square className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {property.building_size_sqm} m²
                </span>
              </div>
            )}
            {property.land_size_sqm != null && (
              <div className="flex items-center space-x-1">
                <Crop className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {property.land_size_sqm} m²
                </span>
              </div>
            )}
            {property.year_built != null && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {property.year_built}
                </span>
              </div>
            )}
            {property.handover && (
              <div className="flex items-center space-x-1">
                <Sunrise className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {property.handover}
                </span>
              </div>
            )}
            {property.price_per_sqm && (
              <div className="flex items-center space-x-1">
                <Square className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {property.price_per_sqm}
                </span>
              </div>
            )}
          </div>
          {/* Features */}
          <div className="mt-3 flex flex-wrap gap-2">
            {property.features &&
              property.features.map((featureId) => (
                <span
                  key={featureId}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800"
                >
                  {useFeatureLabel(featureId, locale || "en")}
                </span>
              ))}
          </div>
        </div>
        {/* Price */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold text-gray-800">
              {typeof property.price === "number" ||
              !isNaN(Number(property.price))
                ? `IDR ${new Intl.NumberFormat("id-ID", {
                    maximumFractionDigits: 0,
                  }).format(Number(property.price))}`
                : property.price}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
