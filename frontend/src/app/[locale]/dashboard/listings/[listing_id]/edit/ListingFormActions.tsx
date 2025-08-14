"use client";

import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

type ListingFormActionsProps = {
  isSubmitting?: boolean;
};

export default function ListingFormActions({ isSubmitting = false }: ListingFormActionsProps) {
  const t = useTranslations("ListingForm");
  const locale = useLocale();

  return (
    <div className="flex justify-end gap-2 pt-4">
      <Link
        href={`/${locale}/dashboard/listings`}
        className={`transition-colors duration-150 hover:bg-accent/20 focus:ring-2 focus:ring-primary/30 border border-input bg-background text-foreground rounded-md px-4 py-2 text-sm font-medium ${
          isSubmitting ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {t("cancel")}
      </Link>
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
