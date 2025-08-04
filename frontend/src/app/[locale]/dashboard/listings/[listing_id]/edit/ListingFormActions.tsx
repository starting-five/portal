"use client";

import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function ListingFormActions() {
  const t = useTranslations("ListingForm");
  const locale = useLocale();

  return (
    <div className="flex justify-end gap-2 pt-4">
      <Link
        href={`/${locale}/dashboard/listings`}
        className="transition-colors duration-150 hover:bg-accent/20 focus:ring-2 focus:ring-primary/30 border border-input bg-background text-foreground rounded-md px-4 py-2 text-sm font-medium"
      >
        {t("cancel")}
      </Link>
      <Button
        type="submit"
        variant="blue"
        className="transition-colors duration-150 focus:ring-2 focus:ring-primary/30"
      >
        {t("save")}
      </Button>
    </div>
  );
}
