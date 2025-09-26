import ListingsGridClient from "@/components/ListingsGridClient";
import Spinner from "@/components/ui/Spinner";
import { LISTING_STATUS_IDS } from "@/lib/app.constants";
import { createServerClient } from "@supabase/ssr";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { Suspense } from "react";

export default async function ArchivePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations("MyListings");
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  return (
    <div className="p-8 min-h-[70vh] flex flex-col">
      <h1 className="text-3xl font-bold mb-2">{t("archive_title")}</h1>
      <p className="text-muted-foreground mb-8">{t("archive_description")}</p>
      <Suspense fallback={<ArchiveLoadingSpinner />}>
        {/* FiltersBar for archive listings */}
        <FiltersBar
          locale={locale}
          basePath="dashboard/listings/archive"
          hideListingStatuses={true}
        />
        <ListingsGridClient
          locale={locale}
          searchParams={resolvedSearchParams}
          listingStatusIds={LISTING_STATUS_IDS.ARCHIVE}
          userId={userId}
          emptyLabelKey="archive_empty"
          context="archive"
        />
      </Suspense>
    </div>
  );
}

import FiltersBar from "@/components/FiltersBar";

function ArchiveLoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full min-h-[70vh]">
      <Spinner size={40} />
    </div>
  );
}
