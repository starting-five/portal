import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { LISTING_STATUS_IDS } from "@/lib/app.constants";
import { getPropertyTypeWithIcon, roomOptions } from "@/lib/filterOptions";
import { formatPrice } from "@/lib/priceFormat";
import { useAppSelector } from "@/store/hooks";
import { Filter, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

// Property types from Redux lookups
const usePropertyTypes = (locale: string) => {
  const lookups = useAppSelector((state) => state.lookups);
  return (lookups.listing_types || []).map(
    (ptRaw: { id: number; key: string; labels: Record<string, string> }) =>
      getPropertyTypeWithIcon(ptRaw, locale)
  );
};

interface AdvancedFiltersModalProps {
  locale: string;
  trigger?: React.ReactNode;
  hideListingStatuses?: boolean; // New prop to hide listing status section
  initialFilters: {
    selectedPropertyTypes: number[];
    selectedLocations: number[];
    ownershipTypes: number[];
    listingStatuses: string[];
    features: string[];
    bedrooms: string | null;
    bathrooms: string | null;
    minPrice: number;
    maxPrice: number;
  };
  onApplyFilters: (filters: {
    selectedPropertyTypes: number[];
    selectedLocations: number[];
    ownershipTypes: number[];
    listingStatuses: string[];
    features: string[];
    bedrooms: string | null;
    bathrooms: string | null;
    minPrice: number;
    maxPrice: number;
  }) => void;
}

const AdvancedFiltersModal = ({
  trigger,
  initialFilters,
  onApplyFilters,
  locale,
  hideListingStatuses = false,
}: AdvancedFiltersModalProps) => {
  const t = useTranslations("FiltersBar");
  // Get locale from lookups or props (assume 'en' if not available)
  const lookups = useAppSelector((state: any) => state.lookups);
  // Populate feature categories from Redux state
  const featureCategories = React.useMemo(() => {
    const categories =
      (lookups.features as Array<{
        key: string;
        sort_order: number;
        labels: Record<string, string>;
        items: Array<{
          id: string;
          key: string;
          category_key: string;
          labels: Record<string, string>;
          sort_order: number;
        }>;
      }>) || [];
    return categories.map((category) => ({
      key: category.key,
      label:
        category.labels?.[locale] ||
        category.labels?.en ||
        category.labels?.es ||
        category.key,
      items: category.items.map((item) => ({
        id: item.id,
        label:
          item.labels?.[locale] ||
          item.labels?.en ||
          item.labels?.es ||
          item.key,
      })),
    }));
  }, [lookups.features, locale]);

  const propertyTypes = usePropertyTypes(locale);
  // Get ownership types from Redux lookups
  const ownershipTypes = (
    (lookups.ownership_types as Array<{
      id: number;
      labels: Record<string, string>;
    }>) || []
  ).map((ot) => ({
    id: ot.id,
    label:
      ot.labels?.[locale] ||
      ot.labels?.en ||
      ot.labels?.id ||
      ot.labels?.es ||
      String(ot.id),
  }));
  // Get listing statuses from Redux lookups
  // Only show ACTIVE statuses for active listings filter
  let listingStatuses = (
    (lookups.listing_statuses as Array<{
      id: string | number;
      labels: Record<string, string>;
    }>) || []
  ).map((ls) => ({
    id: ls.id,
    label: ls.labels?.[locale] || ls.labels?.en || ls.labels?.es || ls.id,
  }));
  // If not hiding listing statuses (i.e., on active page), only show statuses in LISTING_STATUS_IDS.ACTIVE
  if (!hideListingStatuses) {
    const activeIds = (
      Array.isArray(LISTING_STATUS_IDS.ACTIVE)
        ? LISTING_STATUS_IDS.ACTIVE
        : [LISTING_STATUS_IDS.ACTIVE]
    ).map(String);
    listingStatuses = listingStatuses.filter((ls) =>
      activeIds.includes(String(ls.id))
    );
  }
  const [localFilters, setLocalFilters] = React.useState({
    selectedPropertyTypes: initialFilters.selectedPropertyTypes || [],
    selectedLocations: initialFilters.selectedLocations || [],
    ownershipTypes: initialFilters.ownershipTypes || [],
    listingStatuses: initialFilters.listingStatuses || [],
    features: initialFilters.features || [],
    bedrooms: initialFilters.bedrooms ?? null,
    bathrooms: initialFilters.bathrooms ?? null,
    minPrice: initialFilters.minPrice ?? 0,
    maxPrice: initialFilters.maxPrice ?? 25000000000,
  });

  // Track modal open state to reset filters on open
  const [isOpen, setIsOpen] = React.useState(false);
  React.useEffect(() => {
    if (isOpen) {
      setLocalFilters({
        selectedPropertyTypes: initialFilters.selectedPropertyTypes || [],
        selectedLocations: initialFilters.selectedLocations || [],
        ownershipTypes: initialFilters.ownershipTypes || [],
        listingStatuses: initialFilters.listingStatuses || [],
        features: initialFilters.features || [],
        bedrooms: initialFilters.bedrooms ?? null,
        bathrooms: initialFilters.bathrooms ?? null,
        minPrice: initialFilters.minPrice ?? 0,
        maxPrice: initialFilters.maxPrice ?? 25000000000,
      });
    }
  }, [isOpen, initialFilters]);

  const [locationSearch, setLocationSearch] = React.useState("");
  const [showLocationPopover, setShowLocationPopover] = React.useState(false);
  const locations = lookups.locations as Array<{ id: number; name: string }>;

  // Location filter logic
  const toggleLocation = (id: number) => {
    setLocalFilters((prev) => ({
      ...prev,
      selectedLocations: prev.selectedLocations.includes(id)
        ? prev.selectedLocations.filter((l) => l !== id)
        : [...prev.selectedLocations, id],
    }));
  };

  // Property type filter logic
  const togglePropertyType = (id: number) => {
    setLocalFilters((prev) => ({
      ...prev,
      selectedPropertyTypes: prev.selectedPropertyTypes.includes(id)
        ? prev.selectedPropertyTypes.filter((typeId) => typeId !== id)
        : [...prev.selectedPropertyTypes, id],
    }));
  };

  // Ownership type filter logic
  const toggleOwnershipType = (id: number) => {
    setLocalFilters((prev) => ({
      ...prev,
      ownershipTypes: prev.ownershipTypes.includes(id)
        ? prev.ownershipTypes.filter((typeId) => typeId !== id)
        : [...prev.ownershipTypes, id],
    }));
  };

  // Listing status filter logic
  const toggleListingStatus = (id: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      listingStatuses: prev.listingStatuses.includes(id)
        ? prev.listingStatuses.filter((statusId) => statusId !== id)
        : [...prev.listingStatuses, id],
    }));
  };

  // Features filter logic
  const toggleFeature = (id: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      features: prev.features.includes(id)
        ? prev.features.filter((featureId) => featureId !== id)
        : [...prev.features, id],
    }));
  };

  // Helper functions to format number inputs with thousand separators (always Indonesian for IDR)
  const formatNumberForInput = (num: number) => {
    return num.toLocaleString("id-ID"); // Always use Indonesian locale for IDR
  };

  const parseNumberFromInput = (value: string) => {
    // Always remove Indonesian thousands separators (dots) for IDR
    return Number(value.replace(/\./g, ""));
  };

  const handleMinPriceChange = (value: string) => {
    const parsedValue = parseNumberFromInput(value);
    if (!isNaN(parsedValue)) {
      const minPrice = Math.max(
        0,
        Math.min(parsedValue, localFilters.minPrice)
      );
      setLocalFilters((prev) => ({
        ...prev,
        minPrice: minPrice,
      }));
    }
  };

  const handleMaxPriceChange = (value: string) => {
    const parsedValue = parseNumberFromInput(value);
    if (!isNaN(parsedValue)) {
      const maxPrice = Math.min(
        25000000000,
        Math.max(parsedValue, localFilters.maxPrice)
      );
      setLocalFilters((prev) => ({
        ...prev,
        maxPrice: maxPrice,
      }));
    }
  };

  const clearAllFilters = () => {
    setLocalFilters({
      selectedPropertyTypes: [],
      selectedLocations: [],
      ownershipTypes: [],
      listingStatuses: [],
      features: [],
      bedrooms: null,
      bathrooms: null,
      minPrice: 0,
      maxPrice: 25000000000,
    });
  };

  const hasActiveFilters =
    localFilters.selectedLocations.length > 0 ||
    localFilters.selectedPropertyTypes.length > 0 ||
    localFilters.ownershipTypes.length > 0 ||
    localFilters.listingStatuses.length > 0 ||
    localFilters.features.length > 0 ||
    localFilters.bedrooms !== null ||
    localFilters.bathrooms !== null ||
    localFilters.minPrice > 0 ||
    localFilters.maxPrice < 25000000000;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            {t("advancedFilter", { default: "Filters" })}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full max-w-[480px] sm:max-w-[580px] md:max-w-[700px] flex flex-col h-full p-0"
      >
        <SheetHeader className="p-4 sm:p-6 pb-0 flex-shrink-0 relative z-[60] bg-background">
          <SheetTitle className="text-lg sm:text-xl font-semibold">
            {t("advancedPropertyFilters", {
              default: "Advanced Property Filters",
            })}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 px-4 sm:px-6 overflow-y-auto">
          <div className="space-y-6 sm:space-y-8 pb-6 min-h-0">
            {/* Basic Filters */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">
                  {t("basicFilters", { default: "Basic Filters" })}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Location */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      {t("location")}
                    </Label>
                    <Popover
                      open={showLocationPopover}
                      onOpenChange={setShowLocationPopover}
                      modal={false}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="relative w-full justify-start text-left overflow-hidden pr-10 cursor-pointer"
                          style={{ cursor: "pointer" }}
                        >
                          <Search className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate mr-6">
                            {localFilters.selectedLocations.length > 0
                              ? localFilters.selectedLocations
                                  .map(
                                    (id) =>
                                      locations.find((l) => l.id === id)
                                        ?.name || id
                                  )
                                  .join(", ")
                              : t("searchLocations")}
                          </span>
                          {localFilters.selectedLocations.length > 0 && (
                            <span
                              aria-label="Clear locations"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLocalFilters((prev) => ({
                                  ...prev,
                                  selectedLocations: [],
                                }));
                              }}
                            >
                              <X className="h-3 w-3" />
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[300px] p-0 z-[100]"
                        side="bottom"
                        align="start"
                        avoidCollisions={true}
                        sticky="always"
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                      >
                        <Command value="">
                          <CommandInput
                            placeholder={t("searchLocations")}
                            value={locationSearch}
                            onValueChange={setLocationSearch}
                          />
                          <CommandList className="max-h-[200px]">
                            <CommandEmpty>{t("noLocations")}</CommandEmpty>
                            <CommandGroup>
                              {locations
                                .filter((location) =>
                                  location.name
                                    .toLowerCase()
                                    .includes(locationSearch.toLowerCase())
                                )
                                .map((location) => (
                                  <CommandItem
                                    key={location.id}
                                    value={location.name}
                                    onSelect={() => toggleLocation(location.id)}
                                    className="flex items-center space-x-2 cursor-pointer"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <Checkbox
                                      checked={localFilters.selectedLocations.includes(
                                        location.id
                                      )}
                                      onCheckedChange={() =>
                                        toggleLocation(location.id)
                                      }
                                      className="pointer-events-none"
                                    />
                                    {location.name}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Property Type */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      {t("propertyType")}
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {propertyTypes.map(
                        ({
                          id,
                          label,
                          icon: Icon,
                        }: {
                          id: number;
                          label: string;
                          icon?: React.ComponentType<{ className?: string }>;
                        }) => (
                          <div
                            key={`propertyType-${id}`}
                            className="flex items-center space-x-2 p-2 rounded-md border hover:bg-accent transition-colors cursor-pointer"
                            style={{ cursor: "pointer" }}
                            onClick={() => togglePropertyType(id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ")
                                togglePropertyType(id);
                            }}
                          >
                            <Checkbox
                              id={`propertyType-${id}`}
                              checked={localFilters.selectedPropertyTypes.includes(
                                id
                              )}
                              onCheckedChange={() => togglePropertyType(id)}
                            />
                            {Icon ? <Icon className="h-4 w-4" /> : null}
                            <Label
                              htmlFor={`propertyType-${id}`}
                              className="text-sm cursor-pointer pointer-events-none"
                            >
                              {label}
                            </Label>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      {t("bedrooms")}
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                      {roomOptions.map((option) => (
                        <Button
                          key={option.value}
                          variant={
                            localFilters.bedrooms === option.value
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setLocalFilters((prev) => ({
                              ...prev,
                              bedrooms:
                                prev.bedrooms === option.value
                                  ? null
                                  : option.value,
                            }))
                          }
                          className="text-xs cursor-pointer"
                          style={{ cursor: "pointer" }}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Bathrooms */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      {t("bathrooms")}
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                      {roomOptions.map((option) => (
                        <Button
                          key={option.value}
                          variant={
                            localFilters.bathrooms === option.value
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setLocalFilters((prev) => ({
                              ...prev,
                              bathrooms:
                                prev.bathrooms === option.value
                                  ? null
                                  : option.value,
                            }))
                          }
                          className="text-xs cursor-pointer"
                          style={{ cursor: "pointer" }}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3 mt-6">
                  <Label className="text-sm font-medium">
                    {t("priceRange")}: IDR{" "}
                    {formatPrice(localFilters.minPrice, locale)} - IDR{" "}
                    {formatPrice(localFilters.maxPrice, locale)}
                  </Label>

                  <div className="px-2 mb-4">
                    <Slider
                      value={[localFilters.minPrice, localFilters.maxPrice]}
                      onValueChange={(value) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          minPrice: value[0],
                          maxPrice: value[1],
                        }))
                      }
                      max={25000000000}
                      min={0}
                      step={50000000}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>IDR {formatPrice(0, locale)}</span>
                    <span>IDR {formatPrice(25000000000, locale)}+</span>
                  </div>

                  {/* Price Input Fields - matching FiltersBar style */}
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col w-1/2">
                      <Label htmlFor="minPrice" className="text-xs mb-1">
                        {t("minPrice")}
                      </Label>
                      <input
                        id="minPrice"
                        type="text"
                        value={formatNumberForInput(localFilters.minPrice)}
                        onChange={(e) => handleMinPriceChange(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="Min"
                      />
                    </div>
                    <div className="flex flex-col w-1/2">
                      <Label htmlFor="maxPrice" className="text-xs mb-1">
                        {t("maxPrice")}
                      </Label>
                      <input
                        id="maxPrice"
                        type="text"
                        value={formatNumberForInput(localFilters.maxPrice)}
                        onChange={(e) => handleMaxPriceChange(e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Ownership & Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Ownership Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    {t("ownershipType", { default: "Ownership Type" })}
                  </Label>
                  <div className="space-y-2">
                    {ownershipTypes.map(({ id, label }) => (
                      <div
                        key={`ownershipType-${id}`}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`ownershipType-${id}`}
                          checked={localFilters.ownershipTypes.includes(id)}
                          onCheckedChange={() => toggleOwnershipType(id)}
                        />
                        <Label
                          htmlFor={`ownershipType-${id}`}
                          className="text-sm"
                        >
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Listing Status */}
                {!hideListingStatuses && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      {t("listingStatus", { default: "Listing Status" })}
                    </Label>
                    <div className="space-y-2">
                      {listingStatuses.map(({ id, label }) => {
                        const idStr = String(id);
                        return (
                          <div
                            key={idStr}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={idStr}
                              checked={localFilters.listingStatuses.includes(
                                idStr
                              )}
                              onCheckedChange={() => toggleListingStatus(idStr)}
                            />
                            <Label htmlFor={idStr} className="text-sm">
                              {label}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Features */}
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-base sm:text-lg font-medium">
                  {t("featuresAmenities", { default: "Features & Amenities" })}
                </h3>
                {featureCategories.map((category) => (
                  <div key={category.key} className="space-y-3">
                    <Label className="text-sm font-medium">
                      {category.label}
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {category.items.map((item) => (
                        <div
                          key={`${category.key}-${item.id}`}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={item.id}
                            checked={localFilters.features.includes(item.id)}
                            onCheckedChange={() => toggleFeature(item.id)}
                          />
                          <Label htmlFor={item.id} className="text-sm">
                            {item.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t p-4 sm:p-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearAllFilters}
                className="cursor-pointer"
                style={{ cursor: "pointer" }}
              >
                {t("clearAllFilters", { default: "Clear All Filters" })}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <SheetClose asChild>
              <Button variant="outline" className="cursor-pointer">
                {t("cancel", { default: "Cancel" })}
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button
                onClick={() => onApplyFilters(localFilters)}
                className="cursor-pointer"
              >
                {t("applyFilters", { default: "Apply Filters" })}
              </Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdvancedFiltersModal;
