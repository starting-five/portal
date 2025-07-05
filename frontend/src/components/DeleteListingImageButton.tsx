"use client";

import { deleteListingImage } from "@/lib/api/listingImages";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteListingImageButton({
  id,
}: {
  id: number | string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteListingImage(id);
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
