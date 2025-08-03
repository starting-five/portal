import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { getListings } from "@/lib/api/listings";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Fetch lookups on the server for SSR hydration
  const t = await getTranslations("MyListings");
  let listings = [];
  try {
    listings = await getListings({ lang: locale });
    // Add random pexels images to each listing
    const demoImages = [
      "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg", // 1200x800, 3:2
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg", // 1200x800, 3:2
      "https://images.pexels.com/photos/221027/pexels-photo-221027.jpeg", // 1200x800, 3:2
      "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg", // 1200x800, 3:2
      "https://images.pexels.com/photos/261146/pexels-photo-261146.jpeg", // 1200x800, 3:2
      "https://images.pexels.com/photos/210557/pexels-photo-210557.jpeg", // 1200x800, 3:2
      "https://images.pexels.com/photos/210464/pexels-photo-210464.jpeg", // 1200x800, 3:2
      "https://images.pexels.com/photos/210600/pexels-photo-210600.jpeg", // 1200x800, 3:2
      "https://images.pexels.com/photos/210604/pexels-photo-210604.jpeg", // 1200x800, 3:2
    ];
    function getRandomImages() {
      const count = Math.floor(Math.random() * 4) + 3; // 3 to 6 images
      const shuffled = demoImages.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    }
    listings = listings.map((listing: any) => ({
      ...listing,
      images: getRandomImages(),
    }));
  } catch (e) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
        <p className="text-red-600">{t("error")}</p>
      </main>
    );
  }

  // Render page content directly, providers are set up at a higher level
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold leading-tight">{t("title")}</h1>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {t("add_listing")}
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 w-full mx-auto [grid-template-columns:repeat(auto-fit,minmax(350px,1fr))]">
        {listings.map((listing: any) => (
          <PropertyCard key={listing.id} property={listing} locale={locale} />
        ))}
      </div>
    </div>
  );
}
