"use client";

import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import {
    ArrowLeft,
    ArrowRight,
    Bath,
    Bed,
    Dumbbell,
    LayoutGrid,
    MapPin,
    Maximize,
    Mountain,
    Sparkles,
    Square,
    Sunrise,
    Trees,
    Waves,
    Pencil,
    Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";
import Link from "next/link";

export type Property = {
  id: number;
  title: string;
  location: string;
  price: string;
  images: string[];
  type: string;
  ownership: string;
  status: string[];
  bedrooms?: number | null;
  bathrooms?: number | null;
  building_size_sqm?: number | null;
  land_size_sqm?: number | null;
  year_built?: number | null;
  handover?: string | null;
  price_per_sqm?: string | null;
  features?: string[];
  description?: string;
};

function getFeatureIcon(feature: string) {
    console.log("Feature:", feature);
  switch (feature.name.toLowerCase()) {
    case "pool":
    case "ocean view":
    case "beachfront":
      return <Waves className="h-3 w-3" />;
    case "sunset view":
      return <Sunrise className="h-3 w-3" />;
    case "gym":
      return <Dumbbell className="h-3 w-3" />;
    case "spa":
    case "resort":
      return <Sparkles className="h-3 w-3" />;
    case "garden":
      return <Trees className="h-3 w-3" />;
    case "rice view":
    case "cliff top":
    case "quiet":
      return <Mountain className="h-3 w-3" />;
    case "golf view":
      return <MapPin className="h-3 w-3" />;
    default:
      return <MapPin className="h-3 w-3" />;
  }
}

export default function PropertyCard({ property, locale }: { property: Property; locale?: string }) {
  const t = useTranslations("Features");
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    loop: true,
  });

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg w-full mx-auto">
      {/* Edit and Delete buttons top-right */}
      <div className="absolute top-3 right-3 z-20 flex gap-2">
        <Link
          href={`/${locale || ''}/dashboard/listings/${property.id}/edit`}
          className="rounded-full bg-white/80 p-2 text-gray-700 shadow hover:bg-blue-100 hover:text-blue-600 transition"
          title="Edit listing"
        >
          <Pencil className="h-3 w-3" />
        </Link>
        <button
          type="button"
          className="rounded-full bg-white/80 p-2 text-red-600 shadow hover:bg-red-100 hover:text-red-700 transition"
          title="Delete listing"
          onClick={() => {/* TODO: Add delete logic/confirmation */}}
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
      {/* Grouped Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
          {property.ownership ? property.ownership : "Freehold"}
        </span>
      </div>
      {/* Property Image Carousel with fallback */}
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-gray-200">
        <div
          ref={sliderRef}
          className="keen-slider h-full w-full"
          tabIndex={0}
          aria-label="Property images carousel"
        >
          {(property.images && property.images.length > 0
            ? property.images
            : ["/window.svg"] // fallback image in public/
          ).map((img, idx) => (
            <div className="keen-slider__slide" key={idx}>
              <Image
                src={img}
                alt={property.title}
                width={800}
                height={600}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/window.svg";
                }}
              />
            </div>
          ))}
        </div>
        {/* Arrows */}
        {(property.images && property.images.length > 1) && (
          <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
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
        <span className="absolute right-2 bottom-2 flex items-center gap-1 rounded-full bg-gray-900/80 px-2 py-1 text-xs text-white">
          <LayoutGrid className="h-3 w-3" />
          {currentSlide + 1}/
          {property.images && property.images.length > 0 ? property.images.length : 1}
        </span>
      </div>
      {/* Property Details */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {property.title}
            </h3>
            <span className="mt-1 inline-flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-gray-400" />
              {property.location}
            </span>
          </div>
        </div>
        {/* Icon-based Property Stats */}
        <div className="mt-4 flex items-center space-x-4">
          {property.bedrooms != null && (
            <div className="flex items-center space-x-1">
              <Bed className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms != null && (
            <div className="flex items-center space-x-1">
              <Bath className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{property.bathrooms}</span>
            </div>
          )}
          {property.building_size_sqm != null && (
            <div className="flex items-center space-x-1">
              <Square className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{property.building_size_sqm} m²</span>
            </div>
          )}
          {property.land_size_sqm != null && (
            <div className="flex items-center space-x-1">
              <Maximize className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{property.land_size_sqm} m²</span>
            </div>
          )}
          {property.year_built != null && (
            <div className="flex items-center space-x-1">
              <Sparkles className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{property.year_built}</span>
            </div>
          )}
          {property.handover && (
            <div className="flex items-center space-x-1">
              <Sunrise className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{property.handover}</span>
            </div>
          )}
          {property.price_per_sqm && (
            <div className="flex items-center space-x-1">
              <Square className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{property.price_per_sqm}</span>
            </div>
          )}
        </div>
        {/* Features */}
        <div className="mt-3 flex flex-wrap gap-2">
          {property.features &&
            property.features.map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800"
              >
                {getFeatureIcon(feature)}
                {t(feature)}
              </span>
            ))}
        </div>
        {/* Price and year built */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-semibold text-gray-800">
            {property.price}
          </p>
        </div>
        {/* Description */}
        {property.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{property.description}</p>
        )}
      </div>
    </div>
  );
}
