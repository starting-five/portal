const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export async function getListingTypes() {
  const res = await fetch(`${API_BASE}/listing_types`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch listing types");
  return res.json();
}

export async function getListingType(id: string | number) {
  const res = await fetch(`${API_BASE}/listing_types/${id}`);
  if (!res.ok) throw new Error("Failed to fetch listing type");
  return res.json();
}

export async function createListingType(data: { name: string }) {
  const res = await fetch(`${API_BASE}/listing_types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create listing type");
  return res.json();
}

export async function updateListingType(
  id: string | number,
  data: { name: string }
) {
  const res = await fetch(`${API_BASE}/listing_types/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update listing type");
  return res.json();
}

export async function deleteListingType(id: number | string) {
  const res = await fetch(`${API_BASE}/listing_types/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete listing type");
  if (res.status === 204) return;
  return res.json();
}
