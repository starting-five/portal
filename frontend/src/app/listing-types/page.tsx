import DeleteListingTypeButton from "@/components/DeleteListingTypeButton";
import { getListingTypes } from "@/lib/api/listingTypes";
import { ListingType } from "@/lib/types";
import Link from "next/link";

export default async function ListingTypesPage() {
  const types = await getListingTypes();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Listing Types</h1>
      <Link
        href="/listing-types/new"
        className="mb-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Listing Type
      </Link>
      <table className="min-w-full border mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {types.map((type: ListingType) => (
            <tr key={type.id}>
              <td className="border px-4 py-2">{type.name}</td>
              <td className="border px-4 py-2">
                <Link
                  href={`/listing-types/${type.id}/edit`}
                  className="text-blue-600 mr-2"
                >
                  Edit
                </Link>
                <DeleteListingTypeButton id={type.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
