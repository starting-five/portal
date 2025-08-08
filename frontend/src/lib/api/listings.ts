import { API_BASE } from "./apiBase";

export async function getListings(params?: { lang?: string }) {
  console.log("API_BASE (getListings):", API_BASE);
  const query = params?.lang ? `?lang=${params.lang}` : "";
  const res = await fetch(`${API_BASE}/listings${query}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch listings");
  return res.json();
}

export async function getListing(listing_id: string) {
  const res = await fetch(`${API_BASE}/listings/${listing_id}`);
  if (!res.ok) throw new Error("Failed to fetch listing");
  return res.json();
}

export async function createListing(data: unknown, jwt?: string) {
  console.log("API_BASE (createListing):", API_BASE);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
  const res = await fetch(`${API_BASE}/listings`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create listing");
  return res.json();
}

export async function updateListing(listing_id: string, data: unknown, jwt?: string) {
  console.log("API_BASE (updateListing):", API_BASE);
  console.log("Updating listing with ID:", listing_id);
  console.log("Data to update:", data);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
  const res = await fetch(`${API_BASE}/listings/${listing_id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update listing");
  return res.json();
}

export async function deleteListing(listing_id: string, jwt?: string) {
  console.log("API_BASE (deleteListing):", API_BASE);
  console.log("Deleting listing with listing ID:", listing_id);
  const headers: Record<string, string> = {};
  if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
  const res = await fetch(`${API_BASE}/listings/${listing_id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error("Failed to delete listing");
  if (res.status === 204) return;
  return res.json();
}
