"use client";

import {
    getListingStatus,
    updateListingStatus,
} from "@/lib/api/listingStatuses";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditListingStatusPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");

  useEffect(() => {
    getListingStatus(id).then((data) => {
      setName(data.name);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await updateListingStatus(id, { name });
    router.push("/listing-statuses");
  }

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Edit Listing Status</h1>
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
          Save
        </button>
      </form>
    </main>
  );
}
