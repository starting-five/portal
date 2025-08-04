import ClientProviders from "@/app/[locale]/ClientProviders";
import { getLookups } from "@/lib/api/lookups";
import { getMessages } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import React from "react";
import { Toaster } from "sonner";
import GlobalLookupsLoader from "@/store/GlobalLookupsLoader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch lookups and messages server-side for hydration
  const lookups = await getLookups();
  const messages = await getMessages();
  const locale = (messages && messages.locale) || "en";

  return (
    <html lang={locale} className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Place global providers here */}
        <ClientProviders lookups={lookups} locale={locale} messages={messages}>
          <Toaster
            position="top-center"
            richColors
            style={{ maxWidth: 400, width: "100%" }}
          />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
