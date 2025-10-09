import { API_BASE } from "./apiBase";

export async function bulkCreateListingImages(
  images: Array<{
    listing_id: string | number;
    url: string;
    alt_text?: string;
    sort_order?: number;
  }>,
  jwt?: string
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
  const res = await fetch(`${API_BASE}/listing_images/bulk`, {
    method: "POST",
    headers,
    body: JSON.stringify(images),
  });
  if (!res.ok) throw new Error("Failed to bulk create listing images");
  return res.json();
}

export async function getListingImages() {
  const res = await fetch(`${API_BASE}/listing_images`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch listing images");
  return res.json();
}

export async function getListingImage(id: string | number) {
  const res = await fetch(`${API_BASE}/listing_images/${id}`);
  if (!res.ok) throw new Error("Failed to fetch listing image");
  return res.json();
}

export async function createListingImage(data: {
  listing_id: number;
  url: string;
  alt_text?: string;
  sort_order?: number;
}) {
  const res = await fetch(`${API_BASE}/listing_images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create listing image");
  return res.json();
}

export async function updateListingImage(
  id: string | number,
  data: {
    listing_id: number;
    url: string;
    alt_text?: string;
    sort_order?: number;
  }
) {
  const res = await fetch(`${API_BASE}/listing_images/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update listing image");
  return res.json();
}

export async function deleteListingImage(id: number | string) {
  const res = await fetch(`${API_BASE}/listing_images/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete listing image");
  if (res.status === 204) return;
  return res.json();
}
