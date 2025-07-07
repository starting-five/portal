import { API_BASE } from "./apiBase";

export async function getListingStatuses() {
  const res = await fetch(`${API_BASE}/listing_statuses`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch listing statuses");
  return res.json();
}

export async function getListingStatus(id: string | number) {
  const res = await fetch(`${API_BASE}/listing_statuses/${id}`);
  if (!res.ok) throw new Error("Failed to fetch listing status");
  return res.json();
}

export async function createListingStatus(data: { name: string }) {
  const res = await fetch(`${API_BASE}/listing_statuses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create listing status");
  return res.json();
}

export async function updateListingStatus(
  id: string | number,
  data: { name: string }
) {
  const res = await fetch(`${API_BASE}/listing_statuses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update listing status");
  return res.json();
}

export async function deleteListingStatus(id: number | string) {
  const res = await fetch(`${API_BASE}/listing_statuses/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete listing status");
  if (res.status === 204) return;
  return res.json();
}
