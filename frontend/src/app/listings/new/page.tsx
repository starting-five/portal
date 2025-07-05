"use client";

import { getCurrencies } from "@/lib/api/currencies";
import { getFeatures } from "@/lib/api/features";
import { createListing } from "@/lib/api/listings";
import { getListingStatuses } from "@/lib/api/listingStatuses";
import { getListingTypes } from "@/lib/api/listingTypes";
import { getLocations } from "@/lib/api/locations";
import { getOwnershipTypes } from "@/lib/api/ownershipTypes";
import { getPriceUnits } from "@/lib/api/priceUnits";
import { useRouter } from "next/navigation";
import { Feature, ListingFormState, DropdownOption } from "@/lib/types";
import { useEffect, useState } from "react";

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
  status_id: {
    label: "Status",
    fetch: getListingStatuses,
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
};

const INITIAL_FIELDS: ListingFormState = {
  title: "",
  description: "",
  listing_type_id: null,
  ownership_type_id: null,
  location_id: null,
  bedrooms: "",
  bathrooms: "",
  land_size_sqm: "",
  building_size_sqm: "",
  status_id: null,
  price: "",
  currency_id: null,
  price_unit_id: null,
  year_built: "",
  facilities: "",
  features: [],
};

export default function NewListingPage() {
  const router = useRouter();
  const [fields, setFields] = useState<ListingFormState>(INITIAL_FIELDS);
  const [dropdownOptions, setDropdownOptions] = useState<
    Record<string, DropdownOption[]>
  >({});
  const [featuresOptions, setFeaturesOptions] = useState<Feature[]>([]);

  useEffect(() => {
    async function fetchOptions() {
      const entries = await Promise.all(
        Object.entries(DROPDOWN_FIELDS).map(async ([key, { fetch }]) => [
          key,
          await fetch(),
        ])
      );
      setDropdownOptions(Object.fromEntries(entries));
      setFeaturesOptions(await getFeatures());
    }
    fetchOptions();
  }, []);

  function handleChange(key: string, value: string) {
    if (DROPDOWN_FIELDS[key]) {
      setFields((prev) => ({
        ...prev,
        [key]: value ? parseInt(value, 10) : null,
      }));
    } else if (key === "facilities") {
      setFields((prev) => ({ ...prev, facilities: value }));
    } else if (
      [
        "bedrooms",
        "bathrooms",
        "land_size_sqm",
        "building_size_sqm",
        "price",
        "year_built",
      ].includes(key)
    ) {
      setFields((prev) => ({
        ...prev,
        [key]: value ? parseInt(value, 10) : "",
      }));
    } else {
      setFields((prev) => ({ ...prev, [key]: value }));
    }
  }

  function handleFeatureToggle(featureId: number) {
    setFields((prev) => {
      const prevFeatures = Array.isArray(prev.features) ? prev.features : [];
      if (prevFeatures.includes(featureId)) {
        return {
          ...prev,
          features: prevFeatures.filter((id: number) => id !== featureId),
        };
      } else {
        return { ...prev, features: [...prevFeatures, featureId] };
      }
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Prepare payload
    const payload: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (key === "facilities") {
        if (typeof value === "string" && value.trim() !== "") {
          try {
            payload.facilities = JSON.parse(value);
          } catch {
            payload.facilities = {};
          }
        }
      } else if (key === "features") {
        payload.features = value && Array.isArray(value) ? value : [];
      } else if (
        [
          "listing_type_id",
          "ownership_type_id",
          "location_id",
          "bedrooms",
          "bathrooms",
          "land_size_sqm",
          "building_size_sqm",
          "status_id",
          "price",
          "currency_id",
          "price_unit_id",
          "year_built",
        ].includes(key)
      ) {
        if (value !== "" && value !== null && value !== undefined) {
          payload[key] = Number(value);
        }
      } else if (value !== "") {
        payload[key] = value;
      }
    }

    await createListing(payload);
    router.push("/listings");
  }

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Add Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {(Object.keys(INITIAL_FIELDS) as (keyof ListingFormState)[]).map(
          (key) => {
            if (DROPDOWN_FIELDS[key]) {
              const options = dropdownOptions[key] || [];
              const { label, optionLabel } = DROPDOWN_FIELDS[key];
              return (
                <div key={key}>
                  <label className="block font-semibold mb-1">
                    {label}{" "}
                    <span className="text-red-600 text-xs">
                      (This field cannot be empty)
                    </span>
                  </label>
                  <select
                    className="border p-2 w-full"
                    value={Array.isArray(fields[key]) ? "" : fields[key] ?? ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    required
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
            if (key === "features") {
              return (
                <div key={key}>
                  <label className="block font-semibold mb-1">Features</label>
                  <div className="flex flex-wrap gap-4">
                    {featuresOptions.map((feature: Feature) => (
                      <label
                        key={feature.id}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={
                            Array.isArray(fields.features) &&
                            fields.features.includes(feature.id)
                          }
                          onChange={() => handleFeatureToggle(feature.id)}
                        />
                        {feature.name}
                      </label>
                    ))}
                  </div>
                </div>
              );
            }
            if (key === "title" || key === "description" || key === "price") {
              const label =
                key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
              return (
                <div key={key}>
                  <label className="block font-semibold mb-1">
                    {label}{" "}
                    <span className="text-red-600 text-xs">
                      (This field cannot be empty)
                    </span>
                  </label>
                  {key === "description" ? (
                    <textarea
                      className="border p-2 w-full"
                      value={fields.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      required
                    />
                  ) : (
                    <input
                      className="border p-2 w-full"
                      type={key === "price" ? "number" : "text"}
                      value={fields[key] ?? ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                      required
                    />
                  )}
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
                    value={fields.facilities}
                    onChange={(e) => handleChange("facilities", e.target.value)}
                    placeholder='e.g. { "AC Units": 4 }'
                  />
                  <small className="text-gray-500">
                    Enter as JSON: {'{ "AC Units": 4 }'}
                  </small>
                </div>
              );
            }
            // Default: text/numeric fields
            return (
              <div key={key}>
                <label className="block font-semibold mb-1">
                  {key.replace(/_/g, " ")}
                </label>
                <input
                  className="border p-2 w-full"
                  type={
                    [
                      "bedrooms",
                      "bathrooms",
                      "land_size_sqm",
                      "building_size_sqm",
                      "price",
                      "year_built",
                    ].includes(key)
                      ? "number"
                      : "text"
                  }
                  value={fields[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              </div>
            );
          }
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>
    </main>
  );
}
