"use client";

import { deleteCurrency } from "@/lib/api/currencies";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteCurrencyButton({ id }: { id: number | string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteCurrency(id);
      router.refresh(); // This will re-fetch data for the current page
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      className="text-red-600"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
