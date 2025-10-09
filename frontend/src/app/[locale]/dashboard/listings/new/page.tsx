"use client";

import ListingForm from "@/components/ListingForm";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { deleteUserTmpImages } from "@/lib/supabase/listingImageUtils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  ownership_type: z.string(),
  listing_type: z.string(),
  location: z.string(),
  building_size: z.number().optional(),
  land_size: z.number().optional(),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  price: z.number().min(0),
  year_built: z.number().min(0).optional(),
  status: z.string(),
});

export default function Page() {
  const t = useTranslations("ListingForm");
  const router = useRouter();

  // Cleanup function to delete images in /tmp folder
  async function handleCancel(
    uploadedImages: { url: string }[],
    currentUser: { id: string }
  ) {
    if (uploadedImages && uploadedImages.length && currentUser) {
      await deleteUserTmpImages({
        supabase: createClient(),
        userId: currentUser.id,
        images: uploadedImages,
      });
    }
    router.push("/dashboard/listings");
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">
          {t("title_new")}
        </h1>
        <p className="mb-8 text-slate-600">{t("description_new")}</p>
        <ListingForm>
          {({ isSubmitting, uploadedImages, currentUser }) => (
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => handleCancel(uploadedImages, currentUser)}
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                variant="blue"
                disabled={isSubmitting}
                className="min-w-[100px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t("saving")}
                  </div>
                ) : (
                  t("save")
                )}
              </Button>
            </div>
          )}
        </ListingForm>
      </div>
    </div>
  );
}
