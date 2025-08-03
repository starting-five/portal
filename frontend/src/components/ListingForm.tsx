"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createListing } from "@/lib/api/listings";
import {
  selectFeatures,
  selectListingStatuses,
  selectListingTypes,
  selectLocations,
  selectOwnershipTypes,
} from "@/store/lookups";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { z } from "zod";
import ListingFeatures from "./ListingFeatures";

const translationSchema = z.object({
  language_code: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

const formSchema = z.object({
  translations: z.array(translationSchema).min(1),
  ownership_type_id: z.number({ required_error: "required_field" }),
  listing_type_id: z.number({ required_error: "required_field" }),
  location_id: z.number({ required_error: "required_field" }),
  building_size_sqm: z.number().optional(),
  land_size_sqm: z.number().optional(),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  features: z.array(z.number()).optional(),
  price: z.number({ required_error: "required_field" }).min(0),
  year_built: z.number().min(0).optional(),
  status_id: z.number({ required_error: "required_field" }),
});

import {
  FeatureCategoryWithItems,
  ListingStatus,
  ListingType,
  Location,
  OwnershipType,
} from "@/lib/types";
import { useLocale, useTranslations } from "next-intl";
import React from "react";

type ListingFormProps = {
  children?: React.ReactNode;
  initialValues?: any;
  mode?: "create" | "edit";
};

import { updateListing } from "@/lib/api/listings";

export default function ListingForm({
  children,
  initialValues,
  mode,
}: ListingFormProps) {
  const router = useRouter();
  const t = useTranslations("ListingForm");
  const locale = useLocale();
  const ownershipTypes =
    (useSelector(selectOwnershipTypes) as OwnershipType[]) || [];
  const listingTypes = (useSelector(selectListingTypes) as ListingType[]) || [];
  const locations = (useSelector(selectLocations) as Location[]) || [];
  const listingStatuses =
    (useSelector(selectListingStatuses) as ListingStatus[]) || [];
  const features =
    (useSelector(selectFeatures) as FeatureCategoryWithItems[]) || [];

  // Remove "archived" and "deleted" statuses if they exist
  const filteredListingStatuses = listingStatuses.filter(
    (status) => status.key !== "archived" && status.key !== "deleted"
  );
  // debugger;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialValues,
      price:
        initialValues?.price !== undefined && initialValues?.price !== null
          ? Number(initialValues.price)
          : undefined,
      year_built:
        initialValues?.year_built !== undefined && initialValues?.year_built !== null && initialValues?.year_built !== ""
          ? Number(initialValues.year_built)
          : undefined,
    },
  });

  async function handleSubmit(values: any) {
    try {
      let result;
      if (mode === "edit" && initialValues && initialValues.listing_id) {
        result = await updateListing(initialValues.listing_id, values);
        toast.success("Listing updated successfully!");
      } else {
        result = await createListing(values);
        toast.success("Listing created successfully!");
        console.log("New listing created:", values);
      }
      router.push(`/${locale}/dashboard/listings`);
    } catch (error: any) {
      toast.error(
        error?.message ||
          (mode === "edit"
            ? "Failed to update listing"
            : "Failed to create listing")
      );
    }
  }

  function handleInvalid() {
    toast.error(t("form_invalid"));
  }

  const languages = [
    { code: "en", label: "English" },
    { code: "id", label: "Bahasa Indonesia" },
    { code: "es", label: "Español" },
  ];

  // Ensure translations array is always present and has 3 items (one per language), but do not reorder; match by language_code when rendering
  React.useEffect(() => {
    const current = form.getValues("translations") || [];
    // Add missing language objects if not present
    const missing = languages.filter(
      (lang) =>
        !current.some(
          (t: { language_code: string }) => t.language_code === lang.code
        )
    );
    if (missing.length > 0) {
      form.setValue("translations", [
        ...current,
        ...missing.map((lang) => ({
          language_code: lang.code,
          title: "",
          description: "",
        })),
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log("Current form values:", form.watch());

  // Build a map from language_code to index for translations
  const translations = form.watch("translations") || [];
  const langIdxMap: Record<string, number> = {};
  translations.forEach((t: { language_code: string }, i: number) => {
    langIdxMap[t.language_code] = i;
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, handleInvalid)}
        className="space-y-10"
      >
        {/* Property Details Section */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            {t("property_details_header")}
          </h2>
          <div className="space-y-6">
            <div>
              {(() => {
                // Determine if any title is missing and form is submitted
                const translations = form.watch("translations") || [];
                const hasAnyMissing = languages.some(
                  (l, i) =>
                    !translations[i]?.title || translations[i]?.title === ""
                );
                const showError = form.formState.isSubmitted && hasAnyMissing;
                return (
                  <FormLabel
                    className={`mb-1 block${showError ? " text-red-600" : ""}`}
                  >
                    {t("title_label")}
                  </FormLabel>
                );
              })()}
              <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                <Tabs defaultValue="en" className="w-full">
                  <TabsList>
                    {languages.map((lang) => {
                      const idx = langIdxMap[lang.code];
                      const translations = form.watch("translations") || [];
                      // Only show red dot if form has been submitted and field is missing
                      const missingTitle =
                        typeof idx === "number" &&
                        (!translations[idx]?.title ||
                          translations[idx]?.title === "");
                      const showDot =
                        form.formState.isSubmitted && missingTitle;
                      return (
                        <TabsTrigger
                          key={lang.code}
                          value={lang.code}
                          className="relative"
                        >
                          {lang.label}
                          {showDot && (
                            <span
                              className="absolute top-0 right-2 h-2 w-2 rounded-full bg-red-500"
                              style={{ transform: "translateX(5px)" }}
                            />
                          )}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                  {languages.map((lang) => {
                    const idx = langIdxMap[lang.code];
                    const fieldName =
                      typeof idx === "number"
                        ? `translations.${idx}.title`
                        : undefined;
                    return (
                      <TabsContent
                        key={lang.code}
                        value={lang.code}
                        className="pt-0"
                      >
                        {fieldName ? (
                          <FormField
                            control={form.control}
                            name={fieldName}
                            render={({ field }) => (
                              <FormItem className="m-0">
                                <FormLabel className="sr-only">
                                  {t("title_placeholder")} ({lang.label})
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={`${t("title_placeholder")} (${
                                      lang.label
                                    })`}
                                    type="text"
                                    {...field}
                                    className="w-full"
                                    value={field.value ?? ""}
                                  />
                                </FormControl>
                                {/* Reserve space for error message to prevent layout shift */}
                                <div className="min-h-[18px]">
                                  {(() => {
                                    const translations =
                                      form.watch("translations") || [];
                                    // Only show error if form has been submitted and any field is missing
                                    const hasAnyMissing = languages.some(
                                      (l, i) =>
                                        !translations[i]?.title ||
                                        translations[i]?.title === ""
                                    );
                                    if (
                                      !form.formState.isSubmitted ||
                                      !hasAnyMissing
                                    )
                                      return null;
                                    return (
                                      <div className="text-xs text-red-500">
                                        {t("title_error_message")}
                                      </div>
                                    );
                                  })()}
                                </div>
                              </FormItem>
                            )}
                          />
                        ) : (
                          <Input
                            placeholder={`Property title (${lang.label})`}
                            type="text"
                            className="w-full"
                            value={""}
                            readOnly
                          />
                        )}
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </div>
            </div>
            <div>
              {(() => {
                // Determine if any description is missing and form is submitted
                const translations = form.watch("translations") || [];
                const hasAnyMissing = languages.some(
                  (l, i) =>
                    !translations[i]?.description ||
                    translations[i]?.description === ""
                );
                const showError = form.formState.isSubmitted && hasAnyMissing;
                return (
                  <FormLabel
                    className={`mb-1 block${showError ? " text-red-600" : ""}`}
                  >
                    {t("description_label")}
                  </FormLabel>
                );
              })()}
              <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                <Tabs defaultValue="en" className="w-full">
                  <TabsList>
                    {languages.map((lang) => {
                      const idx = langIdxMap[lang.code];
                      const translations = form.watch("translations") || [];
                      // Only show red dot if form has been submitted and field is missing
                      const missingDesc =
                        typeof idx === "number" &&
                        (!translations[idx]?.description ||
                          translations[idx]?.description === "");
                      const showDot = form.formState.isSubmitted && missingDesc;
                      return (
                        <TabsTrigger
                          key={lang.code}
                          value={lang.code}
                          className="relative"
                        >
                          {lang.label}
                          {showDot && (
                            <span
                              className="absolute top-0 right-2 h-2 w-2 rounded-full bg-red-500"
                              style={{ transform: "translateX(5px)" }}
                            />
                          )}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                  {languages.map((lang) => {
                    const idx = langIdxMap[lang.code];
                    const fieldName =
                      typeof idx === "number"
                        ? `translations.${idx}.description`
                        : undefined;
                    return (
                      <TabsContent
                        key={lang.code}
                        value={lang.code}
                        className="pt-0"
                      >
                        {fieldName ? (
                          <FormField
                            control={form.control}
                            name={fieldName}
                            render={({ field }) => (
                              <FormItem className="m-0">
                                <FormLabel className="sr-only">
                                  Description ({lang.label})
                                </FormLabel>
                                <FormControl>
                                  <textarea
                                    className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                                    placeholder={`${t(
                                      "description_placeholder"
                                    )} (${lang.label})`}
                                    rows={4}
                                    {...field}
                                    value={field.value ?? ""}
                                  />
                                </FormControl>
                                {/* Reserve space for error message to prevent layout shift */}
                                <div className="min-h-[18px]">
                                  {(() => {
                                    const translations =
                                      form.watch("translations") || [];
                                    // Only show error if form has been submitted and any field is missing
                                    const hasAnyMissing = languages.some(
                                      (l, i) =>
                                        !translations[i]?.description ||
                                        translations[i]?.description === ""
                                    );
                                    if (
                                      !form.formState.isSubmitted ||
                                      !hasAnyMissing
                                    )
                                      return null;
                                    return (
                                      <div className="text-xs text-red-500">
                                        {t("title_error_message")}
                                      </div>
                                    );
                                  })()}
                                </div>
                              </FormItem>
                            )}
                          />
                        ) : (
                          <textarea
                            className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                            placeholder={`Short description (${lang.label})`}
                            rows={4}
                            value={""}
                            readOnly
                          />
                        )}
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <FormField
                  control={form.control}
                  name="ownership_type_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="min-h-[24px] min-w-[160px] md:min-w-[200px]">
                        {t("ownership_type_label")}
                      </FormLabel>
                      <Select
                        onValueChange={(val) =>
                          field.onChange(val ? +val : undefined)
                        }
                        defaultValue={
                          field.value ? String(field.value) : undefined
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("ownership_type_placeholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ownershipTypes.map((ot) => (
                            <SelectItem key={ot.id} value={String(ot.id)}>
                              {ot.labels?.[locale] || ot.labels?.["en"]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="min-h-[18px] text-xs leading-tight !mt-0 text-red-600">
                        {typeof form.formState.errors.ownership_type_id
                          ?.message === "string"
                          ? t(form.formState.errors.ownership_type_id.message)
                          : null}
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="listing_type_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="min-h-[24px] min-w-[160px] md:min-w-[200px]">
                        {t("listing_type_label")}
                      </FormLabel>
                      <Select
                        onValueChange={(val) =>
                          field.onChange(val ? +val : undefined)
                        }
                        defaultValue={
                          field.value ? String(field.value) : undefined
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("listing_type_placeholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {listingTypes.map((lt) => (
                            <SelectItem key={lt.id} value={String(lt.id)}>
                              {lt.labels?.[locale] || lt.labels?.["en"]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="min-h-[18px] text-xs leading-tight !mt-0 text-red-600">
                        {typeof form.formState.errors.listing_type_id
                          ?.message === "string"
                          ? t(form.formState.errors.listing_type_id.message)
                          : null}
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="location_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="min-h-[24px] min-w-[160px] md:min-w-[200px]">
                        {t("location_label")}
                      </FormLabel>
                      <Select
                        onValueChange={(val) =>
                          field.onChange(val ? +val : undefined)
                        }
                        defaultValue={
                          field.value ? String(field.value) : undefined
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("location_placeholder")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {locations.map((loc) => (
                            <SelectItem key={loc.id} value={String(loc.id)}>
                              {loc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="min-h-[18px] text-xs leading-tight !mt-0 text-red-600">
                        {typeof form.formState.errors.location_id?.message ===
                        "string"
                          ? t(form.formState.errors.location_id.message)
                          : null}
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Size & Features Section */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            {t("size_features_header")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                control={form.control}
                name="building_size_sqm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="min-h-[24px] min-w-[160px] md:min-w-[200px]">
                      {t("building_size_label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("building_size_placeholder")}
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : +e.target.value
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="land_size_sqm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="min-h-[24px] min-w-[160px] md:min-w-[200px]">
                      {t("land_size_label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("land_size_placeholder")}
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : +e.target.value
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="min-h-[24px] min-w-[160px] md:min-w-[200px]">
                      {t("bedrooms_label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("bedrooms_placeholder")}
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : +e.target.value
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="min-h-[24px] min-w-[160px] md:min-w-[200px]">
                      {t("bathrooms_label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("bathrooms_placeholder")}
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : +e.target.value
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Features Selection */}
          <div className="mt-6">
            <ListingFeatures
              features={features}
              selected={form.watch("features") || []}
              onChange={(newSelected) => form.setValue("features", newSelected)}
              locale={locale}
            />
          </div>
        </div>
        {/* Pricing & Status Section */}
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            {t("pricing_status_header")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="min-h-[24px] min-w-[160px] md:min-w-[200px]">
                      {t("price_label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("price_placeholder")}
                        type="number"
                        step={1}
                        {...field}
                        value={
                          field.value !== undefined &&
                          field.value !== null &&
                          field.value !== ""
                            ? Math.trunc(Number(field.value))
                            : ""
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(
                            val === "" ? undefined : Math.trunc(Number(val))
                          );
                        }}
                      />
                    </FormControl>
                    <div className="min-h-[18px] text-xs leading-tight !mt-0 text-red-600">
                      {typeof form.formState.errors.price?.message === "string"
                        ? t(form.formState.errors.price.message)
                        : null}
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="year_built"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="min-h-[24px] min-w-[160px] md:min-w-[200px]">
                      {t("year_built_label")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("year_built_placeholder")}
                        type="number"
                        {...field}
                        value={field.value === null || field.value === undefined ? "" : field.value}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === "" ? undefined : +val);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="status_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="min-h-[24px] min-w-[160px] md:min-w-[200px]">
                      {t("status_label")}
                    </FormLabel>
                    <Select
                      onValueChange={(val) =>
                        field.onChange(val ? +val : undefined)
                      }
                      defaultValue={
                        field.value ? String(field.value) : undefined
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="min-w-[240px]">
                          <SelectValue placeholder={t("status_placeholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredListingStatuses.map((ls) => (
                          <SelectItem key={ls.id} value={String(ls.id)}>
                            {ls.labels?.[locale] || ls.labels?.["en"]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="min-h-[24px] text-xs leading-tight !mt-0 text-red-600">
                      {typeof form.formState.errors.status_id?.message ===
                      "string"
                        ? t(form.formState.errors.status_id.message)
                        : null}
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        {children}
      </form>
    </Form>
  );
}
