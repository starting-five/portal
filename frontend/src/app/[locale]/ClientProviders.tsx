"use client";

import QueryClientWrapper from "@/components/QueryClientWrapper";
import { LookupsProvider } from "@/store/LookupsProvider";
import { ReduxProvider } from "@/store/ReduxProvider";
import { NextIntlClientProvider } from "next-intl";
import React from "react";

interface ClientProvidersProps {
  children: React.ReactNode;
  lookups: any;
  locale: string;
  messages: Record<string, any>;
}

export default function ClientProviders({
  children,
  lookups,
  locale,
  messages,
}: ClientProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ReduxProvider>
        <LookupsProvider lookups={lookups}>
          <QueryClientWrapper>{children}</QueryClientWrapper>
        </LookupsProvider>
      </ReduxProvider>
    </NextIntlClientProvider>
  );
}
