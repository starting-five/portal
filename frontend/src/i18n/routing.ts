import { defineRouting } from "next-intl/routing";
import { LOCALE_CODES, DEFAULT_LOCALE } from "@/i18n/locales";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: LOCALE_CODES,

  // Used when no locale matches
  defaultLocale: DEFAULT_LOCALE,
});
