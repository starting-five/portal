"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, usePathname } from "next/navigation";
import React from "react";

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export default function DashboardBreadcrumbs() {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();
  const { locale } = useParams();
  // Remove locale prefix and split path
  const path = pathname.replace(/^\/[a-z]{2}\//, "");
  const segments = path.split("/").filter(Boolean);

  // Map segment to translation key
  function getLabel(seg: string) {
    switch (seg) {
      case "dashboard":
        return t("home");
      case "listings":
        return t("my_listings");
      case "new":
        return t("new_listing");
      case "settings":
        return t("settings");
      default:
        return capitalize(seg);
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.length === 0 ? (
          <BreadcrumbItem>
            <BreadcrumbPage>{t("home")}</BreadcrumbPage>
          </BreadcrumbItem>
        ) : (
          segments.map((seg, idx) => (
            <React.Fragment key={seg}>
              <BreadcrumbItem>
                {idx === segments.length - 1 ? (
                  <BreadcrumbPage>{getLabel(seg)}</BreadcrumbPage>
                ) : (
                  <span className="text-muted-foreground">{getLabel(seg)}</span>
                )}
              </BreadcrumbItem>
              {idx < segments.length - 1 && (
                <span className="mx-1 text-muted-foreground">
                  <ChevronRight className="w-4 h-4 inline" />
                </span>
              )}
            </React.Fragment>
          ))
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
