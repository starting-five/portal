"use client";

import { getCurrency, updateCurrency } from "@/lib/api/currencies";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditCurrencyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["currency", id],
    queryFn: () => getCurrency(id),
    enabled: !!id,
  });

  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (data) {
      setCode(data.code);
      setName(data.name);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (newData: { code: string; name: string }) =>
      updateCurrency(id, newData),
    onSuccess: () => router.push("/currencies"),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({ code, name });
  }

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading currency</p>;

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Edit Currency</h1>
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
          {mutation.isPending ? "Saving..." : "Save"}
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
