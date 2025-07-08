import { API_BASE } from "./apiBase";

export async function getListings() {
  const res = await fetch(`${API_BASE}/listings`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch listings");
  return res.json();
}

export async function getListing(id: string | number) {
  const res = await fetch(`${API_BASE}/listings/${id}`);
  if (!res.ok) throw new Error("Failed to fetch listing");
  return res.json();
}

export async function createListing(data: unknown) {
  const res = await fetch(`${API_BASE}/listings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create listing");
  return res.json();
}

export async function updateListing(id: string | number, data: unknown) {
    console.log("Updating listing with ID:", id);
    console.log("Data to update:", data);
  const res = await fetch(`${API_BASE}/listings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update listing");
  return res.json();
}

export async function deleteListing(id: number | string) {
  console.log("Deleting listing with ID:", id);
  const res = await fetch(`${API_BASE}/listings/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete listing");
  if (res.status === 204) return;
  return res.json();
}
