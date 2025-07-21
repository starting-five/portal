import Link from "next/link";
import { Building } from "lucide-react";
import { getListings } from "@/lib/api/listings";
import PropertyCard from "@/components/PropertyCard";

export default async function ListingsPage({ params }: { params: { locale: string } }) {
  let listings = [];
  try {
    listings = await getListings();
    // Add random Unsplash Bali property images to each listing
    const unsplashImages = [
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80", // modern villa
      "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=1200&q=80", // luxury house
      "https://images.unsplash.com/photo-1460518451285-97b6aa326961?auto=format&fit=crop&w=1200&q=80", // tropical home
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80", // pool property
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80", // beach house
      "https://images.unsplash.com/photo-1505691723518-41cb85eeaf1e?auto=format&fit=crop&w=1200&q=80", // garden villa
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80", // sunset view
      "https://images.unsplash.com/photo-1508341591423-4347093b3cde?auto=format&fit=crop&w=1200&q=80", // modern home
      "https://images.unsplash.com/photo-1465101178521-c1a4c8a0a8b7?auto=format&fit=crop&w=1200&q=80", // cliff top
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=80"  // luxury villa
    ];
    function getRandomImages() {
      const count = Math.floor(Math.random() * 4) + 3; // 3 to 6 images
      const shuffled = unsplashImages.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    }
    listings = listings.map((listing: any) => ({
      ...listing,
      images: getRandomImages(),
    }));
    console.log("Fetched listings:", listings);
  } catch (e) {
    console.error("Failed to fetch listings:", e);
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">Property Listings</h1>
        <p className="text-red-600">
          Failed to load listings. Please try again later.
        </p>
      </main>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <Building className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Properties</h1>
        <Link
          href="/dashboard/listings/new"
          className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Listing
        </Link>
      </div>

      <div
        className="grid gap-6 w-full mx-auto [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]"
      >
        {listings.map((listing: any) => (
          <PropertyCard key={listing.id} property={listing} locale={params.locale} />
        ))}
      </div>
    </div>
  );
}
