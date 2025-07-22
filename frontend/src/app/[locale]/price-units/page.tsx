import DeletePriceUnitButton from "@/components/DeletePriceUnitButton";
import { getPriceUnits } from "@/lib/api/priceUnits";
import { PriceUnit } from "@/lib/types";
import Link from "next/link";

export default async function PriceUnitsPage() {
  const units = await getPriceUnits();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Price Units</h1>
      <Link
        href="/price-units/new"
        className="mb-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Price Unit
      </Link>
      <table className="min-w-full border mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit: PriceUnit) => (
            <tr key={unit.id}>
              <td className="border px-4 py-2">{unit.name}</td>
              <td className="border px-4 py-2">
                <Link
                  href={`/price-units/${unit.id}/edit`}
                  className="text-blue-600 mr-2"
                >
                  Edit
                </Link>
                <DeletePriceUnitButton id={unit.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
