import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { getListings } from "@/lib/api/listings";
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
  let listings = [];
  try {
    listings = await getListings({ lang: locale, user_id: user?.id });
  } catch (e) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
        <p className="text-red-600">{t("error")}</p>
      </main>
    );
  }

  // Render page content directly, providers are set up at a higher level
  const hasListings = listings.length > 0;
  return (
    <div className="p-8 min-h-[70vh] flex flex-col">
      {hasListings ? (
        <>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold leading-tight">
                  {t("title")}
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {t("description")}
                </p>
              </div>
            </div>
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
          <div
            className={`grid gap-6 mx-auto
              ${listings.length === 1 ? "max-w-xl grid-cols-1" : ""}
              ${
                listings.length === 2
                  ? "max-w-4xl grid-cols-1 md:grid-cols-2"
                  : ""
              }
              ${
                listings.length >= 3
                  ? "w-full [grid-template-columns:repeat(auto-fit,minmax(350px,1fr))]"
                  : ""
              }
            `}
          >
            {listings.map((listing: any) => (
              <PropertyCard
                key={listing.id}
                property={listing}
                locale={locale}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-8">
            {/* Illustration: simple house SVG */}
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="20"
                y="60"
                width="80"
                height="40"
                rx="8"
                fill="#F3F4F6"
              />
              <path
                d="M60 30L25 60H35V95H85V60H95L60 30Z"
                fill="#E0E7FF"
                stroke="#6366F1"
                strokeWidth="2"
              />
              <rect
                x="50"
                y="80"
                width="20"
                height="20"
                rx="3"
                fill="#6366F1"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground text-base mb-6 max-w-md">
            {t("empty_message", {
              defaultValue:
                "You have no listings yet. Start by adding your first property!",
            })}
          </p>
          <Link href={`/${locale}/dashboard/listings/new`}>
            <Button
              size="lg"
              variant="blue"
              className="px-6 py-3 rounded-lg flex items-center gap-2 text-base shadow-lg"
            >
              <Plus className="w-5 h-5" aria-label={t("add_listing")} />
              {t("add_listing")}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
