"use client";

import { getPriceUnit, updatePriceUnit } from "@/lib/api/priceUnits";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPriceUnitPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");

  useEffect(() => {
    getPriceUnit(id).then((data) => {
      setName(data.name);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await updatePriceUnit(id, { name });
    router.push("/price-units");
  }

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Edit Price Unit</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          className="border p-2 w-full"
          placeholder="Price Unit Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </form>
    </main>
  );
}
