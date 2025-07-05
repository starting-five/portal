"use client";

import { createListingStatus } from "@/lib/api/listingStatuses";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewListingStatusPage() {
  const [name, setName] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createListingStatus({ name });
    router.push("/listing-statuses");
  }

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Add Listing Status</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          className="border p-2 w-full"
          placeholder="Status Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>
    </main>
  );
}
