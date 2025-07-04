import DeleteCurrencyButton from "@/components/DeleteCurrencyButton";
import { getCurrencies } from "@/lib/api/currencies";
import { Currency } from "@/lib/types";
import Link from "next/link";

export default async function CurrenciesPage() {
  const currencies = await getCurrencies();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Currencies</h1>
      <Link
        href="/currencies/new"
        className="mb-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Currency
      </Link>
      <table className="min-w-full border mt-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">Code</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currencies.map((currency: Currency) => (
            <tr key={currency.id}>
              <td className="border px-4 py-2">{currency.code}</td>
              <td className="border px-4 py-2">{currency.name}</td>
              <td className="border px-4 py-2">
                <Link
                  href={`/currencies/${currency.id}/edit`}
                  className="text-blue-600 mr-2"
                >
                  Edit
                </Link>
                <DeleteCurrencyButton id={currency.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
