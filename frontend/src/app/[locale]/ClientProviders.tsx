"use client";

import QueryClientWrapper from "@/components/QueryClientWrapper";
import { LookupsProvider } from "@/store/LookupsProvider";
import { store } from "@/store/store";
import { NextIntlClientProvider } from "next-intl";
import React from "react";
import { Provider } from "react-redux";

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
    <Provider store={store}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone="UTC"
      >
        <LookupsProvider lookups={lookups}>
          <QueryClientWrapper>{children}</QueryClientWrapper>
        </LookupsProvider>
      </NextIntlClientProvider>
    </Provider>
  );
}
