"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { deleteUserTmpImages } from "@/lib/supabase/listingImageUtils";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";

type ListingFormActionsProps = {
  isSubmitting?: boolean;
  uploadedImages?: { url: string }[];
  currentUser?: { id: string };
};

export default function ListingFormActions({
  isSubmitting = false,
  uploadedImages,
  currentUser,
}: ListingFormActionsProps) {
  const t = useTranslations("ListingForm");
  const locale = useLocale();
  const router = useRouter();
  const params = useParams();
  const context = params?.context;

  async function handleCancel() {
    if (uploadedImages && uploadedImages.length && currentUser) {
      await deleteUserTmpImages({
        supabase: createClient(),
        userId: currentUser.id,
        images: uploadedImages,
      });
    }
    router.push(
      `/${locale}/dashboard/listings/${context || ""}`.replace(/\/$/, "")
    );
  }

  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button
        type="button"
        variant="outline"
        disabled={isSubmitting}
        onClick={handleCancel}
        className="transition-colors duration-150 hover:bg-accent/20 focus:ring-2 focus:ring-primary/30 border border-input bg-background text-foreground rounded-md px-4 py-2 text-sm font-medium"
      >
        {t("cancel")}
      </Button>
      <Button
        type="submit"
        variant="blue"
        className="transition-colors duration-150 focus:ring-2 focus:ring-primary/30 min-w-[100px]"
        disabled={isSubmitting}
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
  );
}
