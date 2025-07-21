"use client";

import { createCurrency } from "@/lib/api/currencies";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewCurrencyPage() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: createCurrency,
    onSuccess: () => router.push("/currencies"),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({ code, name });
  }

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Add Currency</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          className="border p-2 w-full"
          placeholder="Code (e.g. USD)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <input
          className="border p-2 w-full"
          placeholder="Name (e.g. US Dollar)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Adding..." : "Add"}
        </button>
        {mutation.isError && (
          <p className="text-red-600">
            Error: {(mutation.error as Error).message}
          </p>
        )}
      </form>
    </main>
  );
}
