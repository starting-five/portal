"use client";

import ListingForm from "@/components/ListingForm";
import { getListing } from "@/lib/api/listings";
import { notFound } from "next/navigation";
import { use } from "react";
import ListingFormActions from "./ListingFormActions";

type EditListingContentProps = {
  listingId: string;
};

export default function EditListingContent({ listingId }: EditListingContentProps) {
  // Use React's `use` hook to unwrap the promise in Suspense
  const listing = use(getListing(listingId));

  if (!listing) {
    notFound();
  }

  // No frontend authorization check needed - backend will handle it
  // If user doesn't own the listing, the update will fail with 403

  return (
    <ListingForm initialValues={listing} mode="edit">
      {({ isSubmitting }) => <ListingFormActions isSubmitting={isSubmitting} />}
    </ListingForm>
  );
}
