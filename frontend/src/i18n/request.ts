import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { LOCALE_CODES, DEFAULT_LOCALE } from "@/i18n/locales";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(LOCALE_CODES, requested)
    ? requested
    : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: "UTC", // <--- Add this line for a global default
  };
});
