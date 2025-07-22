"use client";

import { createListingImage } from "@/lib/api/listingImages";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewListingImagePage() {
  const [listingId, setListingId] = useState("");
  const [url, setUrl] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createListingImage({ listing_id: Number(listingId), url });
    router.push("/listing-images");
  }

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Add Listing Image</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          className="border p-2 w-full"
          placeholder="Listing ID"
          value={listingId}
          onChange={(e) => setListingId(e.target.value)}
          required
        />
        <input
          className="border p-2 w-full"
          placeholder="Image URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
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
