import { DEFAULT_LOCALE, LOCALE_CODES } from "@/i18n/locales";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(LOCALE_CODES, requested)
    ? requested
    : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: "UTC", // Global default timezone
    now: new Date(), // Provide consistent time for SSR/CSR
  };
});
