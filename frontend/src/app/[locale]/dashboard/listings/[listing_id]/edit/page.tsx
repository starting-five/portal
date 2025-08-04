import ListingForm from "@/components/ListingForm";
import { getListing } from "@/lib/api/listings";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ListingFormActions from "./ListingFormActions";

export default async function EditListingPage({ params }: { params: Promise<{ locale: string; listing_id: string }> }) {
  const { locale, listing_id } = await params;
  const listing = await getListing(listing_id);
  const t = await getTranslations("ListingForm");

  if (!listing) {
    notFound();
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">
          {t("title_edit")}
        </h1>
        <p className="mb-8 text-slate-600">{t("description_edit")}</p>
        <ListingForm initialValues={listing} mode="edit">
          <ListingFormActions />
        </ListingForm>
      </div>
    </div>
  );
}
