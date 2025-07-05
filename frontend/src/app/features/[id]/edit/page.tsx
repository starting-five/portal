"use client";

import { getFeature, updateFeature } from "@/lib/api/features";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditFeaturePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    getFeature(id).then((data) => {
      setName(data.name);
      setCategory(data.category);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await updateFeature(id, { name, category });
    router.push("/features");
  }

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Edit Feature</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          className="border p-2 w-full"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="border p-2 w-full"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
