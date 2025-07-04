import DeleteOwnershipTypeButton from "@/components/DeleteOwnershipTypeButton";
import { getOwnershipTypes } from "@/lib/api/ownershipTypes";
import { OwnershipType } from "@/lib/types";
import Link from "next/link";

export default async function OwnershipTypesPage() {
  const types = await getOwnershipTypes();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Ownership Types</h1>
      <Link
        href="/ownership-types/new"
        className="mb-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Ownership Type
      </Link>
      <table className="min-w-full border mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {types.map((type: OwnershipType) => (
            <tr key={type.id}>
              <td className="border px-4 py-2">{type.name}</td>
              <td className="border px-4 py-2">
                <Link
                  href={`/ownership-types/${type.id}/edit`}
                  className="text-blue-600 mr-2"
                >
                  Edit
                </Link>
                <DeleteOwnershipTypeButton id={type.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
