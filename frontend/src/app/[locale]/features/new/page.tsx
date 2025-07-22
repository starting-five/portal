"use client";

import { createFeature } from "@/lib/api/features";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewFeaturePage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createFeature({ name, category });
    router.push("/features");
  }

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Add Feature</h1>
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
          Add
        </button>
      </form>
    </main>
  );
}
