"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { LOCALES } from "@/i18n/locales";

export default function LocaleSwitcher({
  currentLocale,
}: {
  currentLocale: string;
}) {
  const [pending, setPending] = React.useState(false);
  const [optimisticLocale, setOptimisticLocale] = React.useState(currentLocale);
  const [open, setOpen] = React.useState(false);

  const t = useTranslations("LocaleSwitcher");
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    setOptimisticLocale(currentLocale);
    setPending(false);
    setOpen(false); // Ensure dropdown closes after route change
  }, [currentLocale]);

  const handleChange = (newLocale: string) => {
    setOptimisticLocale(newLocale); // Optimistic UI
    setPending(true); // Disable button
    setOpen(false); // Close dropdown immediately
    const newPath = pathname.replace(/^\/[a-z]{2}\//, `/${newLocale}/`);
    router.push(newPath);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="border rounded px-2 py-1 bg-white text-sm flex items-center gap-1 cursor-pointer min-w-[70px] justify-center"
          disabled={pending}
          aria-disabled={pending}
          aria-label={t("aria_label")}
        >
          <Globe className="w-4 h-4 text-muted-foreground" />
          {optimisticLocale.toUpperCase()}
        </button>
      </DropdownMenuTrigger>
      {!pending && (
        <DropdownMenuContent align="end">
          <DropdownMenuRadioGroup
            value={optimisticLocale}
            onValueChange={handleChange}
          >
            {LOCALES.map((loc) => (
              <DropdownMenuRadioItem key={loc.code} value={loc.code}>
                {loc.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
