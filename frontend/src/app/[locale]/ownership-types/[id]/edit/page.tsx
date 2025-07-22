"use client";
import {
    getOwnershipType,
    updateOwnershipType,
} from "@/lib/api/ownershipTypes";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditOwnershipTypePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");

  useEffect(() => {
    getOwnershipType(id).then((data) => {
      setName(data.name);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await updateOwnershipType(id, { name });
    router.push("/ownership-types");
  }

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Edit Ownership Type</h1>
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
          Save
        </button>
      </form>
    </main>
  );
}
