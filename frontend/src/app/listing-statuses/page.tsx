import DeleteListingStatusButton from "@/components/DeleteListingStatusButton";
import { getListingStatuses } from "@/lib/api/listingStatuses";
import { ListingStatus } from "@/lib/types";
import Link from "next/link";

export default async function ListingStatusesPage() {
  const statuses = await getListingStatuses();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Listing Statuses</h1>
      <Link
        href="/listing-statuses/new"
        className="mb-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Status
      </Link>
      <table className="min-w-full border mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {statuses.map((status: ListingStatus) => (
            <tr key={status.id}>
              <td className="border px-4 py-2">{status.name}</td>
              <td className="border px-4 py-2">
                <Link
                  href={`/listing-statuses/${status.id}/edit`}
                  className="text-blue-600 mr-2"
                >
                  Edit
                </Link>
                <DeleteListingStatusButton id={status.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
