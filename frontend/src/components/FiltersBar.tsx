"use client";

import { getPropertyTypeWithIcon, roomOptions } from "@/lib/filterOptions";
import { formatPrice } from "@/lib/priceFormat";
import { useAppSelector } from "@/store/hooks";
import { Bath, Bed, Search, SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import AdvancedFiltersModal from "./AdvancedFiltersModal";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Slider } from "./ui/slider";

type FiltersBarProps = {
  locale: string;
  basePath?: string; // Optional, defaults to 'properties'
  hideListingStatuses?: boolean; // Optional, defaults to false
};

export default function FiltersBar({
  locale,
  basePath = "properties",
  hideListingStatuses = false,
}: FiltersBarProps) {
  // Count active filters (move to just before return)
  // Track when to run search after modal apply
  const [shouldRunSearch, setShouldRunSearch] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("FiltersBar");

  // Locations from Redux lookups
  const lookups = useAppSelector((state) => state.lookups);
  const locations = lookups.locations as Array<{ id: number; name: string }>;

  // Property types from Redux lookups
  const propertyTypes = (lookups.listing_types || []).map(
    (ptRaw: { id: number; key: string; labels: Record<string, string> }) =>
      getPropertyTypeWithIcon(ptRaw, locale)
  );

  // Price constants
  const PRICE_MIN = 0;
  const PRICE_MAX = 25000000000; // 25 Billion IDR
  const PRICE_STEP = 50000000; // 50M IDR

  // State initialized from query params
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<number[]>(
    []
  );
  const [selectedLocations, setSelectedLocations] = useState<number[]>([]);
  const [ownershipTypes, setOwnershipTypes] = useState<number[]>([]);
  const [listingStatuses, setListingStatuses] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [bedrooms, setBedrooms] = useState<string | null>(null);
  const [bathrooms, setBathrooms] = useState<string | null>(null);
  // Location search state (not the selected locations themselves)
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationPopover, setShowLocationPopover] = useState(false);
  // Price state
  const [minPrice, setMinPrice] = useState<number>(PRICE_MIN);
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_MAX);

  // Helper: collect all filter state for modal
  const filterState = {
    selectedPropertyTypes,
    selectedLocations,
    ownershipTypes,
    listingStatuses,
    features,
    bedrooms,
    bathrooms,
    minPrice,
    maxPrice,
  };

  // Handler for modal apply
  function handleApplyFilters(newFilters: typeof filterState) {
    // console.log("Applying filters from modal: ", newFilters);
    setSelectedPropertyTypes(newFilters.selectedPropertyTypes);
    setSelectedLocations(newFilters.selectedLocations);
    setOwnershipTypes(newFilters.ownershipTypes);
    setListingStatuses(newFilters.listingStatuses);
    setFeatures(newFilters.features);
    setBedrooms(newFilters.bedrooms);
    setBathrooms(newFilters.bathrooms);
    setMinPrice(newFilters.minPrice);
    setMaxPrice(newFilters.maxPrice);
    setShouldRunSearch(true);
  }

  // On mount, initialize state from query params
  useEffect(() => {
    // Helper to parse query param as string, fallback to "any"
    const parseRoom = (val: string | null) => val || null;
    setBedrooms(parseRoom(searchParams.get("bedrooms")));
    setBathrooms(parseRoom(searchParams.get("bathrooms")));
    setSelectedLocations(
      searchParams.get("locations")?.split(",")?.filter(Boolean).map(Number) ??
        []
    );
    setSelectedPropertyTypes(
      searchParams.get("types")?.split(",")?.filter(Boolean).map(Number) ?? []
    );
    setMinPrice(
      searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : PRICE_MIN
    );
    setMaxPrice(
      searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : PRICE_MAX
    );
  }, [searchParams]);

  // Summary for button
  let roomSummary = "Bedrooms & Bathrooms...";
  if (bedrooms && bathrooms) {
    roomSummary = `${bedrooms}+ Beds, ${bathrooms}+ Baths`;
  } else if (bedrooms) {
    roomSummary = `${bedrooms}+ Beds`;
  } else if (bathrooms) {
    roomSummary = `${bathrooms}+ Baths`;
  }

  // Price summary for button
  let priceSummary = "Price Range...";
  if (minPrice > PRICE_MIN || maxPrice < PRICE_MAX) {
    priceSummary = `IDR ${formatPrice(minPrice, locale)} - IDR ${formatPrice(
      maxPrice,
      locale
    )}`;
  }

  // Helper functions to format number inputs for Indonesian locale (always IDR)
  const formatNumberForInput = (num: number) => {
    return num.toLocaleString("id-ID"); // Always use Indonesian locale for IDR currency
  };

  const parseNumberFromInput = (value: string) => {
    // Always remove Indonesian thousands separators (dots) for IDR
    return Number(value.replace(/\./g, ""));
  };

  // Helper to build query string
  // buildQuery logic now inside handleSearch

  // Search button handler
  const handleSearch = React.useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const params = new URLSearchParams();
      if (bedrooms) params.set("bedrooms", String(bedrooms));
      if (bathrooms) params.set("bathrooms", String(bathrooms));
      if (selectedLocations.length)
        params.set("locations", selectedLocations.join(","));
      if (selectedPropertyTypes.length)
        params.set("types", selectedPropertyTypes.join(","));
      if (minPrice !== PRICE_MIN) params.set("minPrice", String(minPrice));
      if (maxPrice !== PRICE_MAX) params.set("maxPrice", String(maxPrice));
      if (ownershipTypes.length)
        params.set("ownershipTypes", ownershipTypes.join(","));
      if (listingStatuses.length)
        params.set("listingStatuses", listingStatuses.join(","));
      if (features.length) params.set("features", features.join(","));
      const query = params.toString();
      // console.log("Navigating with query: ", query);
      router.push(`/${locale}/${basePath}${query ? `?${query}` : ""}`, {
        scroll: false,
      });
    },
    [
      locale,
      router,
      bedrooms,
      bathrooms,
      selectedLocations,
      selectedPropertyTypes,
      minPrice,
      maxPrice,
      ownershipTypes,
      listingStatuses,
      features,
    ]
  );

  // Run search after all filter state is updated
  useEffect(() => {
    if (shouldRunSearch) {
      handleSearch();
      setShouldRunSearch(false);
    }
  }, [shouldRunSearch, handleSearch]);

  // Granular count: each checked value counts
  let activeFilterCount = 0;
  activeFilterCount += selectedLocations.length;
  activeFilterCount += selectedPropertyTypes.length;
  activeFilterCount += ownershipTypes.length;
  activeFilterCount += listingStatuses.length;
  activeFilterCount += features.length;
  if (bedrooms !== null) activeFilterCount += 1;
  if (bathrooms !== null) activeFilterCount += 1;
  if (minPrice > PRICE_MIN) activeFilterCount += 1;
  if (maxPrice < PRICE_MAX) activeFilterCount += 1;

  return (
    <>
      <form
        onSubmit={handleSearch}
        className="mx-auto mb-10 flex w-full max-w-[1440px] flex-col gap-4 rounded-2xl border-1 border-gray-300 bg-white px-6 py-6 shadow-lg"
      >
        <div className="flex w-full flex-col gap-4 [@media(max-width:980px)]:flex-col [@media(min-width:981px)]:flex-row">
          {/* Location Filter */}
          <div className="min-w-[180px] flex-1">
            <div className="w-full">
              <Popover
                open={showLocationPopover}
                onOpenChange={setShowLocationPopover}
              >
                <PopoverTrigger asChild>
                  <div className="w-full">
                    <Button
                      type="button"
                      variant="outline"
                      className="relative flex min-h-[48px] w-full cursor-pointer items-center justify-between border bg-white px-4 py-1"
                      style={{
                        height: "48px",
                        boxShadow: "none",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                      }}
                    >
                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <span
                          className={
                            selectedLocations.length === 0
                              ? "text-muted-foreground text-sm"
                              : "text-sm font-medium text-gray-500"
                          }
                          style={{
                            textAlign: "left",
                            transition: "color 0.2s, font-size 0.2s",
                            marginBottom:
                              selectedLocations.length > 0 ? "0px" : undefined,
                          }}
                        >
                          {t("location")}
                        </span>
                        {selectedLocations.length > 0 && (
                          <span
                            className="block text-sm text-gray-900"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              textAlign: "left",
                              marginTop: "0px",
                            }}
                          >
                            {/* Show location names for selected IDs */}
                            {selectedLocations
                              .map((id) => {
                                const loc = locations?.find((l) => l.id === id);
                                return loc?.name || id;
                              })
                              .join(", ")}
                          </span>
                        )}
                      </div>
                      {selectedLocations.length > 0 && (
                        <span
                          role="button"
                          tabIndex={0}
                          className="ml-2 flex-shrink-0 cursor-pointer text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={(e) => {
                            // console.log("clear locations");
                            e.stopPropagation();
                            setSelectedLocations([]);
                          }}
                          onKeyDown={(e) => {
                            // console.log("key down on clear locations");
                            if (e.key === "Enter" || e.key === " ") {
                              e.stopPropagation();
                              setSelectedLocations([]);
                            }
                          }}
                          aria-label="Clear locations"
                        >
                          <X className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent usePortal className="w-[300px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search locations..."
                      value={locationSearch}
                      onValueChange={setLocationSearch}
                    />
                    <CommandList>
                      <CommandEmpty>{t("noLocations")}</CommandEmpty>
                      <CommandGroup>
                        {locations
                          ?.filter((location) =>
                            location.name
                              .toLowerCase()
                              .includes(locationSearch.toLowerCase())
                          )
                          .map((location) => {
                            const checked = selectedLocations.includes(
                              location.id
                            );
                            const handleToggle = () => {
                              // console.log("toggle location", location.id);
                              setSelectedLocations((prev) =>
                                prev.includes(location.id)
                                  ? prev.filter((l) => l !== location.id)
                                  : [...prev, location.id]
                              );
                            };
                            return (
                              <CommandItem
                                key={location.id}
                                onSelect={handleToggle}
                                className="hover:bg-accent flex cursor-pointer items-center rounded-lg p-2 transition-colors"
                              >
                                <Checkbox
                                  checked={checked}
                                  className="pointer-events-none mr-2 h-5 w-5"
                                  id={`location-${location.id}`}
                                />
                                <Label
                                  htmlFor={`location-${location.id}`}
                                  className="pointer-events-none flex-1 cursor-pointer text-sm"
                                >
                                  {location.name}
                                </Label>
                              </CommandItem>
                            );
                          })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {/* Property Type Filter */}
          <div className="min-w-[180px] flex-1">
            <div className="w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="w-full">
                    <Button
                      type="button"
                      variant="outline"
                      className="relative flex min-h-[48px] w-full cursor-pointer items-center justify-between border bg-white px-4 py-1"
                      style={{
                        height: "48px",
                        boxShadow: "none",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                      }}
                    >
                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <span
                          className={
                            selectedPropertyTypes.length === 0
                              ? "text-muted-foreground text-sm"
                              : "text-sm font-medium text-gray-500"
                          }
                          style={{
                            textAlign: "left",
                            transition: "color 0.2s, font-size 0.2s",
                            marginBottom:
                              selectedPropertyTypes.length > 0
                                ? "0px"
                                : undefined,
                          }}
                        >
                          {t("propertyType")}
                        </span>
                        {selectedPropertyTypes.length > 0 && (
                          <span
                            className="block text-sm text-gray-900"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              textAlign: "left",
                              marginTop: "0px",
                            }}
                          >
                            {selectedPropertyTypes
                              .map(
                                (id) =>
                                  propertyTypes.find(
                                    (pt: {
                                      id: number;
                                      label: string;
                                      icon?: React.ComponentType<{
                                        className?: string;
                                      }>;
                                    }) => pt.id === id
                                  )?.label
                              )
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        )}
                      </div>
                      {selectedPropertyTypes.length > 0 && (
                        <span
                          role="button"
                          tabIndex={0}
                          className="ml-2 flex-shrink-0 cursor-pointer text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPropertyTypes([]);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.stopPropagation();
                              setSelectedPropertyTypes([]);
                            }
                          }}
                          aria-label="Clear property types"
                        >
                          <X className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent usePortal className="w-[320px] p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {propertyTypes.map(
                      ({
                        id,
                        label,
                        icon: Icon,
                      }: {
                        id: number;
                        label: string;
                        icon?: React.ComponentType<{ className?: string }>;
                      }) => {
                        const handleClick = () => {
                          setSelectedPropertyTypes((prev) =>
                            prev.includes(id)
                              ? prev.filter((type) => type !== id)
                              : [...prev, id]
                          );
                        };

                        return (
                          <div
                            key={id}
                            className={`hover:bg-accent flex min-w-0 cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors`}
                            onClick={handleClick}
                          >
                            <Checkbox
                              checked={selectedPropertyTypes.includes(id)}
                              className="pointer-events-none h-4 w-4 flex-shrink-0"
                            />
                            {Icon ? (
                              <Icon className="h-4 w-4 flex-shrink-0" />
                            ) : null}
                            <span className="min-w-0 flex-1 cursor-pointer truncate text-sm">
                              {label ?? ""}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {/* Beds & Baths Filter */}
          <div className="w-full min-w-[180px] flex-1">
            <div className="w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="w-full">
                    <Button
                      type="button"
                      variant="outline"
                      className="relative flex min-h-[48px] w-full cursor-pointer items-center justify-between border bg-white px-4 py-1"
                      style={{
                        height: "48px",
                        boxShadow: "none",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                      }}
                    >
                      <div className="flex w-full flex-col justify-center">
                        <span
                          className={
                            !bedrooms && !bathrooms
                              ? "text-muted-foreground text-sm"
                              : "text-sm font-medium text-gray-500"
                          }
                          style={{
                            textAlign: "left",
                            transition: "color 0.2s, font-size 0.2s",
                            position: "static",
                            width: "100%",
                            marginBottom:
                              bedrooms || bathrooms ? "0px" : undefined,
                          }}
                        >
                          {t("bedsBaths")}
                        </span>
                        {(bedrooms || bathrooms) && (
                          <span
                            className="block w-full text-sm text-gray-900"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "90%",
                              textAlign: "left",
                              marginTop: "0px",
                            }}
                          >
                            {roomSummary}
                          </span>
                        )}
                      </div>
                      {(bedrooms || bathrooms) && (
                        <span
                          role="button"
                          tabIndex={0}
                          className="ml-2 cursor-pointer text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBedrooms(null);
                            setBathrooms(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.stopPropagation();
                              setBedrooms(null);
                              setBathrooms(null);
                            }
                          }}
                          aria-label="Clear bedrooms and bathrooms"
                        >
                          <X className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent usePortal className="w-fit p-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2 flex items-center text-sm font-medium">
                        <Bed className="mr-1 h-4 w-4" /> {t("bedrooms")}
                      </Label>
                      <div className="flex gap-2">
                        {roomOptions.map((opt) => (
                          <Button
                            key={opt.label}
                            type="button"
                            variant={
                              bedrooms === opt.value ? "default" : "outline"
                            }
                            className="flex cursor-pointer items-center justify-center px-3 py-2 text-sm"
                            onClick={() =>
                              setBedrooms(
                                bedrooms === opt.value ? null : opt.value
                              )
                            }
                          >
                            {opt.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="mb-2 flex items-center text-sm font-medium">
                        <Bath className="mr-1 h-4 w-4" /> {t("bathrooms")}
                      </Label>
                      <div className="flex gap-2">
                        {roomOptions.map((opt) => (
                          <Button
                            key={opt.label}
                            type="button"
                            variant={
                              bathrooms === opt.value ? "default" : "outline"
                            }
                            className="flex cursor-pointer items-center justify-center px-3 py-2 text-sm"
                            onClick={() =>
                              setBathrooms(
                                bathrooms === opt.value ? null : opt.value
                              )
                            }
                          >
                            {opt.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {/* Price Range Filter */}
          <div className="min-w-[180px] flex-1">
            <div className="w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="w-full">
                    <Button
                      type="button"
                      variant="outline"
                      className="relative flex min-h-[48px] w-full cursor-pointer items-center justify-between border bg-white px-4 py-1"
                      style={{
                        height: "48px",
                        boxShadow: "none",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                      }}
                    >
                      <div className="flex min-w-0 flex-1 flex-col justify-center">
                        <span
                          className={
                            minPrice === PRICE_MIN && maxPrice === PRICE_MAX
                              ? "text-muted-foreground text-sm"
                              : "text-sm font-medium text-gray-500"
                          }
                          style={{
                            textAlign: "left",
                            transition: "color 0.2s, font-size 0.2s",
                            marginBottom:
                              minPrice !== PRICE_MIN || maxPrice !== PRICE_MAX
                                ? "0px"
                                : undefined,
                          }}
                        >
                          {t("priceRange")}
                        </span>
                        {(minPrice !== PRICE_MIN || maxPrice !== PRICE_MAX) && (
                          <span
                            className="block text-sm text-gray-900"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              textAlign: "left",
                              marginTop: "0px",
                            }}
                          >
                            {priceSummary}
                          </span>
                        )}
                      </div>
                      {(minPrice !== PRICE_MIN || maxPrice !== PRICE_MAX) && (
                        <span
                          role="button"
                          tabIndex={0}
                          className="ml-2 flex-shrink-0 cursor-pointer text-gray-400 hover:text-gray-600 focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMinPrice(PRICE_MIN);
                            setMaxPrice(PRICE_MAX);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.stopPropagation();
                              setMinPrice(PRICE_MIN);
                              setMaxPrice(PRICE_MAX);
                            }
                          }}
                          aria-label="Clear price range"
                        >
                          <X className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent usePortal className="w-[320px] p-4">
                  <Label className="mb-2 text-sm font-medium">
                    {t("priceRange")}
                  </Label>
                  <div className="mb-4 px-2">
                    <Slider
                      min={PRICE_MIN}
                      max={PRICE_MAX}
                      step={PRICE_STEP}
                      value={[minPrice, maxPrice]}
                      onValueChange={([min, max]: [number, number]) => {
                        setMinPrice(min);
                        setMaxPrice(max);
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex w-1/2 flex-col">
                      <Label htmlFor="minPrice" className="mb-1 text-xs">
                        {t("minPrice")}
                      </Label>
                      <input
                        id="minPrice"
                        type="text"
                        value={formatNumberForInput(minPrice)}
                        onChange={(e) => {
                          const parsedValue = parseNumberFromInput(
                            e.target.value
                          );
                          if (!isNaN(parsedValue)) {
                            const val = Math.max(
                              PRICE_MIN,
                              Math.min(parsedValue, maxPrice)
                            );
                            setMinPrice(val);
                          }
                        }}
                        className="w-full rounded border px-2 py-1 text-sm"
                        placeholder="Min"
                      />
                    </div>
                    <div className="flex w-1/2 flex-col">
                      <Label htmlFor="maxPrice" className="mb-1 text-xs">
                        {t("maxPrice")}
                      </Label>
                      <input
                        id="maxPrice"
                        type="text"
                        value={formatNumberForInput(maxPrice)}
                        onChange={(e) => {
                          const parsedValue = parseNumberFromInput(
                            e.target.value
                          );
                          if (!isNaN(parsedValue)) {
                            const val = Math.min(
                              PRICE_MAX,
                              Math.max(parsedValue, minPrice)
                            );
                            setMaxPrice(val);
                          }
                        }}
                        className="w-full rounded border px-2 py-1 text-sm"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {/* Advanced Filter Button & Search Button */}
          <div className="flex items-end gap-4 [@media(max-width:980px)]:flex-col [@media(max-width:980px)]:gap-3">
            <AdvancedFiltersModal
              locale={locale}
              trigger={
                <Button
                  type="button"
                  variant="outline"
                  className="relative flex h-12 flex-shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 whitespace-nowrap [@media(max-width:980px)]:w-full"
                  style={{ minWidth: "auto" }}
                  aria-label={t("advancedFilter")}
                >
                  <SlidersHorizontal className="h-5 w-5" />
                  <span className="hidden [@media(max-width:980px)]:inline [@media(min-width:1130px)]:inline">
                    <span style={{ display: "flex", alignItems: "center" }}>
                      <span>{t("advancedFilter")}</span>
                      {activeFilterCount > 0 && (
                        <>
                          <span
                            style={{
                              fontSize: "1.2em",
                              margin: "0 0.15em",
                              verticalAlign: "middle",
                            }}
                          >
                            •
                          </span>
                          <span
                            style={{
                              fontSize: "1em",
                              fontWeight: 500,
                              verticalAlign: "middle",
                              marginLeft: "0.05em",
                            }}
                          >
                            {activeFilterCount}
                          </span>
                        </>
                      )}
                    </span>
                  </span>
                </Button>
              }
              initialFilters={filterState}
              onApplyFilters={handleApplyFilters}
              hideListingStatuses={hideListingStatuses}
            />
            <Button
              type="submit"
              className="flex h-12 flex-shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-6 whitespace-nowrap text-white shadow-lg hover:bg-blue-700 [@media(max-width:1069px)]:px-3 [@media(max-width:980px)]:w-full"
              style={{ minWidth: "auto" }}
              aria-label={t("search")}
            >
              <Search className="h-5 w-5" />
              <span className="mr-0.5 hidden [@media(max-width:980px)]:inline [@media(min-width:1070px)]:inline">
                {t("search")}
              </span>
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
