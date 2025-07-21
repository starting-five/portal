import DeleteFeatureButton from "@/components/DeleteFeatureButton";
import { getFeatures } from "@/lib/api/features";
import { Feature } from "@/lib/types";
import Link from "next/link";

export default async function FeaturesPage() {
  const features = await getFeatures();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Features</h1>
      <Link
        href="/features/new"
        className="mb-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Feature
      </Link>
      <table className="min-w-full border mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature: Feature) => (
            <tr key={feature.id}>
              <td className="border px-4 py-2">{feature.name}</td>
              <td className="border px-4 py-2">{feature.category}</td>
              <td className="border px-4 py-2">
                <Link
                  href={`/features/${feature.id}/edit`}
                  className="text-blue-600 mr-2"
                >
                  Edit
                </Link>
                <DeleteFeatureButton id={feature.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
