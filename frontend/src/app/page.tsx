import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Portal Navigation</h1>
      <ul className="space-y-4">
        <li>
          <Link href="/listings" className="text-blue-600 underline">
            Listings
          </Link>
        </li>
        <li>
          <Link href="/currencies" className="text-blue-600 underline">
            Currencies
          </Link>
        </li>
        <li>
          <Link href="/features" className="text-blue-600 underline">
            Features
          </Link>
        </li>
        <li>
          <Link href="/listing-statuses" className="text-blue-600 underline">
            Listing Statuses
          </Link>
        </li>
        <li>
          <Link href="/listing-types" className="text-blue-600 underline">
            Listing Types
          </Link>
        </li>
        <li>
          <Link href="/locations" className="text-blue-600 underline">
            Locations
          </Link>
        </li>
        <li>
          <Link href="/ownership-types" className="text-blue-600 underline">
            Ownership Types
          </Link>
        </li>
        <li>
          <Link href="/price-units" className="text-blue-600 underline">
            Price Units
          </Link>
        </li>
        <li>
          <Link href="/listing-images" className="text-blue-600 underline">
            Listing Images
          </Link>
        </li>
      </ul>
    </main>
  );
}
