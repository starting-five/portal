import DeleteLocationButton from "@/components/DeleteLocationButton";
import { getLocations } from "@/lib/api/locations";
import { Location } from "@/lib/types";
import Link from "next/link";

export default async function LocationsPage() {
  const locations = await getLocations();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Locations</h1>
      <Link
        href="/locations/new"
        className="mb-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Location
      </Link>
      <table className="min-w-full border mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((location: Location) => (
            <tr key={location.id}>
              <td className="border px-4 py-2">{location.name}</td>
              <td className="border px-4 py-2">
                <Link
                  href={`/locations/${location.id}/edit`}
                  className="text-blue-600 mr-2"
                >
                  Edit
                </Link>
                <DeleteLocationButton id={location.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
