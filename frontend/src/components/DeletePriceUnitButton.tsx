"use client";

import { deletePriceUnit } from "@/lib/api/priceUnits";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeletePriceUnitButton({ id }: { id: number | string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deletePriceUnit(id);
      router.refresh();
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
