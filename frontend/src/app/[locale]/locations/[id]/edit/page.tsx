"use client";

import { getLocation, updateLocation } from "@/lib/api/locations";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditLocationPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");

  useEffect(() => {
    getLocation(id).then((data) => {
      setName(data.name);
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await updateLocation(id, { name });
    router.push("/locations");
  }

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Edit Location</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          className="border p-2 w-full"
          placeholder="Location Name"
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
