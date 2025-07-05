const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export async function getLocations() {
  const res = await fetch(`${API_BASE}/locations`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch locations");
  return res.json();
}

export async function getLocation(id: string | number) {
  const res = await fetch(`${API_BASE}/locations/${id}`);
  if (!res.ok) throw new Error("Failed to fetch location");
  return res.json();
}

export async function createLocation(data: { name: string }) {
  const res = await fetch(`${API_BASE}/locations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create location");
  return res.json();
}

export async function updateLocation(
  id: string | number,
  data: { name: string }
) {
  const res = await fetch(`${API_BASE}/locations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update location");
  return res.json();
}

export async function deleteLocation(id: number | string) {
  const res = await fetch(`${API_BASE}/locations/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete location");
  if (res.status === 204) return;
  return res.json();
}
