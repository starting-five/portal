"use client";

import { getCurrencies } from "@/lib/api/currencies";
import { getFeatures } from "@/lib/api/features";
import { getListing, updateListing } from "@/lib/api/listings";
import { getListingStatuses } from "@/lib/api/listingStatuses";
import { getListingTypes } from "@/lib/api/listingTypes";
import { getLocations } from "@/lib/api/locations";
import { getOwnershipTypes } from "@/lib/api/ownershipTypes";
import { getPriceUnits } from "@/lib/api/priceUnits";
import { DropdownOption, Feature, ListingFormState } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const DROPDOWN_FIELDS: Record<
  string,
  { label: string; fetch: () => Promise<DropdownOption[]>; optionLabel: string }
> = {
  listing_type_id: {
    label: "Listing Type",
    fetch: getListingTypes,
    optionLabel: "name",
  },
  ownership_type_id: {
    label: "Ownership Type",
    fetch: getOwnershipTypes,
    optionLabel: "name",
  },
  location_id: {
    label: "Location",
    fetch: getLocations,
    optionLabel: "name",
  },
  currency_id: {
    label: "Currency",
    fetch: getCurrencies,
    optionLabel: "code",
  },
  price_unit_id: {
    label: "Price Unit",
    fetch: getPriceUnits,
    optionLabel: "name",
  },
  status_id: {
    label: "Status",
    fetch: getListingStatuses,
    optionLabel: "name",
  },
};

const HIDDEN_FIELDS = [
  "id",
  "created_at",
  "updated_at",
  "search_vector",
  "listing_id",
  "location",
  "listing_type",
  "ownership_type",
  "listing_status",
  "currency",
  "price_unit",
  "status",
  "images",
];

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [fields, setFields] = useState<Partial<ListingFormState>>({});
  const [dropdownOptions, setDropdownOptions] = useState<
    Record<string, DropdownOption[]>
  >({});
  const [featuresOptions, setFeaturesOptions] = useState<Feature[]>([]);

  useEffect(() => {
    async function fetchData() {
      const listing = await getListing(id);

      // Normalize features to an array of IDs
      setFields({
        ...listing,
        features: Array.isArray(listing.features)
          ? listing.features.map((f: Feature) => f.id)
          : [],
      });

      // Fetch dropdown options in parallel
      const entries = await Promise.all(
        Object.entries(DROPDOWN_FIELDS).map(async ([key, { fetch }]) => [
          key,
          await fetch(),
        ])
      );
      setDropdownOptions(Object.fromEntries(entries));

      // Fetch features for multi-select
      const features = await getFeatures();
      setFeaturesOptions(features);
    }
    fetchData();
  }, [id]);

  function handleChange(key: string, value: string) {
    if (DROPDOWN_FIELDS[key]) {
      setFields((prev) => ({
        ...prev,
        [key]: value ? parseInt(value, 10) : null,
      }));
    } else if (key === "facilities") {
      setFields((prev) => ({ ...prev, facilities: value }));
    } else {
      setFields((prev) => ({ ...prev, [key]: value }));
    }
  }

  // Helper to remove hidden fields from the payload
  function filterFields(fields: Partial<ListingFormState>) {
    const filtered: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (!HIDDEN_FIELDS.includes(key)) {
        if (key === "facilities" && typeof value === "string") {
          try {
            filtered[key] = value ? JSON.parse(value) : {};
          } catch {
            filtered[key] = {};
          }
        } else {
          filtered[key] = value;
        }
      }
    }
    return filtered;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const filteredFields = filterFields(fields);
    await updateListing(id, filteredFields);
    router.push("/listings");
  }

  if (!fields || Object.keys(fields).length === 0)
    return <div className="p-8">Loading...</div>;

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Edit Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {Object.entries(fields).map(([key, value]) => {
          if (HIDDEN_FIELDS.includes(key) || key === "features") return null;

          if (DROPDOWN_FIELDS[key]) {
            const options = dropdownOptions[key] || [];
            const { label, optionLabel } = DROPDOWN_FIELDS[key];
            return (
              <div key={key}>
                <label className="block font-semibold mb-1">{label}</label>
                <select
                  className="border p-2 w-full"
                  value={Array.isArray(value) ? value.join(",") : value ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                >
                  <option value="">Select {label}</option>
                  {options.map((opt: DropdownOption) => (
                    <option key={opt.id} value={opt.id}>
                      {opt[optionLabel as keyof DropdownOption]}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (key === "description") {
            return (
              <div key={key}>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  className="border p-2 w-full"
                  value={Array.isArray(value) ? value.join(",") : value ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              </div>
            );
          }

          if (key === "facilities") {
            return (
              <div key={key}>
                <label className="block font-semibold mb-1">
                  Facilities (JSON)
                </label>
                <textarea
                  className="border p-2 w-full font-mono"
                  rows={4}
                  value={
                    typeof value === "string"
                      ? value
                      : JSON.stringify(value, null, 2)
                  }
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder='e.g. { "wifi": true, "pool": false }'
                />
                <small className="text-gray-500">
                  Enter as JSON: {'{ "wifi": true, "pool": false }'}
                </small>
              </div>
            );
          }

          return (
            <div key={key}>
              <label className="block font-semibold mb-1">
                {key.replace(/_/g, " ")}
              </label>
              <input
                className="border p-2 w-full"
                value={Array.isArray(value) ? value.join(",") : value ?? ""}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </div>
          );
        })}
        <div>
          <label className="block font-semibold mb-1">Features</label>
          <div className="flex flex-wrap gap-4">
            {featuresOptions.map((feature: Feature) => (
              <label key={feature.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    Array.isArray(fields.features) &&
                    fields.features.includes(feature.id)
                  }
                  onChange={(e) => {
                    setFields((prev: Partial<ListingFormState>) => {
                      const prevFeatures = Array.isArray(prev.features)
                        ? prev.features
                        : [];
                      if (e.target.checked) {
                        return {
                          ...prev,
                          features: [...prevFeatures, feature.id],
                        };
                      } else {
                        return {
                          ...prev,
                          features: prevFeatures.filter(
                            (fid: number) => fid !== feature.id
                          ),
                        };
                      }
                    });
                  }}
                />
                {feature.name}
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </form>
    </main>
  );
}
