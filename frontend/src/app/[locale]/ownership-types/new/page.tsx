"use client";

import { createOwnershipType } from "@/lib/api/ownershipTypes";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewOwnershipTypePage() {
  const [name, setName] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createOwnershipType({ name });
    router.push("/ownership-types");
  }

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Add Ownership Type</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          className="border p-2 w-full"
          placeholder="Ownership Type Name"
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
