import enMessages from "@/../messages/en.json";
import esMessages from "@/../messages/es.json";
import idMessages from "@/../messages/id.json";
import { LOCALE_CODES } from "@/i18n/locales";
import { getLookups } from "@/lib/api/lookups";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Localized metadata using imported messages
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  let messages;
  switch (locale) {
    case "es":
      messages = esMessages;
      break;
    case "id":
      messages = idMessages;
      break;
    default:
      messages = enMessages;
  }
  return {
    title: messages.metadata?.title || "Property Portal",
    description:
      messages.metadata?.description ||
      "A portal for managing property listings",
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(LOCALE_CODES, locale)) {
    notFound();
  }
  const lookups = await getLookups();
  let messages;
  switch (locale) {
    case "es":
      messages = esMessages;
      break;
    case "id":
      messages = idMessages;
      break;
    default:
      messages = enMessages;
  }

  const ClientProviders = (await import("./ClientProviders")).default;
  return (
    <ClientProviders lookups={lookups} locale={locale} messages={messages}>
      {children}
    </ClientProviders>
  );
}
