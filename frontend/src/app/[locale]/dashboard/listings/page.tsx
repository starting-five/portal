import StatCardGrid from "@/components/StatCardGrid";
import { Button } from "@/components/ui/button";
import { createServerClient } from "@supabase/ssr";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Fetch lookups on the server for SSR hydration
  const t = await getTranslations("MyListings");
  const tSidebar = await getTranslations("Sidebar");
  // Get Supabase user ID server-side
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
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Main page layout
  // Get translated sidebar labels
  const draftsLabel = tSidebar("drafts");
  const activeLabel = tSidebar("active");
  const archiveLabel = tSidebar("archive");

  return (
    <div className="p-8 min-h-[70vh] flex flex-col w-full">
      <div className="flex items-start justify-between mb-4 w-full">
        <h1 className="text-3xl font-bold text-left">{t("title")}</h1>
        <Link href={`/${locale}/dashboard/listings/new`}>
          <Button
            size="lg"
            variant="blue"
            className="px-5 py-2 rounded-lg flex items-center gap-2 text-base"
          >
            <Plus className="w-5 h-5" aria-label={t("add_listing")} />
            {t("add_listing")}
          </Button>
        </Link>
      </div>
      <p className="text-muted-foreground text-base mb-4 text-left w-full">
        {t("description")}
      </p>
      <StatCardGrid
        locale={locale}
        userId={user?.id ? String(user.id) : ""}
        draftsLabel={draftsLabel}
        activeLabel={activeLabel}
        archiveLabel={archiveLabel}
      />
      {/* ...existing page content (listings grid, etc.) can go below... */}
    </div>
  );
}
