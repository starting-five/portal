"use client";

import ListingForm from "@/components/ListingForm";
import { getListing } from "@/lib/api/listings";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import ListingFormActions from "./ListingFormActions";

export default function EditListingPage({ params }: { params: Promise<{ locale: string; listing_id: string }> }) {
  const [listingId, setListingId] = useState<string | null>(null);
  const [listing, setListing] = useState<any>(null);
  const t = useTranslations("ListingForm");

  useEffect(() => {
    async function loadData() {
      try {
        const { listing_id } = await params;
        // console.log('🔍 Loading listing with ID:', listing_id);
        setListingId(listing_id);
        
        const listingData = await getListing(listing_id);
        // console.log('📡 API response:', listingData);
        
        if (!listingData) {
          // console.log('❌ No listing data returned');
          notFound();
          return;
        }
        
        // console.log('✅ Setting listing data:', listingData);
        setListing(listingData);
      } catch (error) {
        // console.error("❌ Error loading listing:", error);
        notFound();
      }
    }
    
    loadData();
  }, [params]);

  // console.log('🎨 Rendering with listing state:', listing);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">
          {t("title_edit")}
        </h1>
        <p className="mb-8 text-slate-600">{t("description_edit")}</p>
        
        <ListingForm initialValues={listing} mode="edit">
          {({ isSubmitting }) => <ListingFormActions isSubmitting={isSubmitting} />}
        </ListingForm>
      </div>
    </div>
  );
}
