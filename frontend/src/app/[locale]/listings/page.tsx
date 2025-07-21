import DeleteListingButton from "@/components/DeleteListingButton";
import ListingCard from "@/components/ListingCard";
import { getListings } from "@/lib/api/listings";
import { Listing } from "@/lib/types";
import Link from "next/link";

export default async function ListingsPage() {
  let listings = [];
  try {
    listings = await getListings();
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
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Property Listings</h1>
      <Link
        href="/listings/new"
        className="mb-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Listing
      </Link>
      {listings.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {listings.map((listing: Listing) => (
            <div key={listing.id} className="relative">
              <ListingCard listing={listing} />
              <div className="mt-2 flex gap-2">
                <Link
                  href={`/listings/${listing.listing_id}/edit`}
                  className="text-blue-600 underline"
                >
                  Edit
                </Link>
                <DeleteListingButton id={listing.listing_id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
