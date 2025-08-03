// Centralized locale definitions for the frontend
export const LOCALES = [
  { code: "en", label: "English" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "es", label: "Español" },
];

export const LOCALE_CODES = LOCALES.map(l => l.code);
export const DEFAULT_LOCALE = "en";
