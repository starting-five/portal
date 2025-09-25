// Utility for formatting price for different locales
export function formatPrice(num: number, locale: string) {
  if (locale === "id") {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(num % 1000000000 === 0 ? 0 : 2) + "M";
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 2) + "Jt";
    } else {
      return (num / 1000000).toFixed(2) + "Jt";
    }
  } else if (locale === "es") {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(num % 1000000000 === 0 ? 0 : 2) + "MM";
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 2) + "M";
    } else {
      return (num / 1000000).toFixed(2) + "M";
    }
  } else {
    // Default: English
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(num % 1000000000 === 0 ? 0 : 2) + "B";
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 2) + "M";
    } else {
      return (num / 1000000).toFixed(2) + "M";
    }
  }
}
