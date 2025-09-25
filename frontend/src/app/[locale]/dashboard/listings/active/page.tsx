import FiltersBar from "@/components/FiltersBar";
import ListingsGridClient from "@/components/ListingsGridClient";
import Spinner from "@/components/ui/Spinner";
import { LISTING_STATUS_IDS } from "@/lib/app.constants";
import { createServerClient } from "@supabase/ssr";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { Suspense } from "react";

export default async function ActivePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Record<string, string | string[]>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
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
  // Determine which listingStatusIds to use: from filter (searchParams) or default to ACTIVE
  let selectedListingStatusIds = LISTING_STATUS_IDS.ACTIVE;
  if (resolvedSearchParams.listingStatuses) {
    // listingStatuses can be a string ("1,2,3") or array
    if (Array.isArray(resolvedSearchParams.listingStatuses)) {
      selectedListingStatusIds = resolvedSearchParams.listingStatuses.map(
        (id) => Number(id)
      );
    } else {
      selectedListingStatusIds = resolvedSearchParams.listingStatuses
        .split(",")
        .map((id) => Number(id));
    }
  }
  return (
    <div className="p-8 min-h-[70vh] flex flex-col">
      <h1 className="text-3xl font-bold mb-2">{t("active_title")}</h1>
      <p className="text-muted-foreground mb-8">{t("active_description")}</p>
      <Suspense fallback={<ListingsLoadingSpinner />}>
        {/* FiltersBar for active listings */}
        <FiltersBar
          locale={locale}
          basePath="dashboard/listings/active"
          hideListingStatuses={false}
        />
        <ListingsGridClient
          locale={locale}
          searchParams={resolvedSearchParams}
          listingStatusIds={selectedListingStatusIds}
          userId={userId}
          emptyLabelKey="active_empty"
          context="active"
        />
      </Suspense>
    </div>
  );
}

function ListingsLoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full min-h-[70vh]">
      <Spinner size={40} />
    </div>
  );
}
