"use client";

import { getListingImage, updateListingImage } from "@/lib/api/listingImages";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditListingImagePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [listingId, setListingId] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    getListingImage(id).then((data) => {
      setListingId(String(data.listing_id));
      setUrl(data.url);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await updateListingImage(id, { listing_id: Number(listingId), url });
    router.push("/listing-images");
  }

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Edit Listing Image</h1>
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
          Save
        </button>
      </form>
    </main>
  );
}
