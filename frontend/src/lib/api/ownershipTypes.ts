const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export async function getOwnershipTypes() {
  const res = await fetch(`${API_BASE}/ownership_types`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch ownership types");
  return res.json();
}

export async function getOwnershipType(id: string | number) {
  const res = await fetch(`${API_BASE}/ownership_types/${id}`);
  if (!res.ok) throw new Error("Failed to fetch ownership type");
  return res.json();
}

export async function createOwnershipType(data: { name: string }) {
  const res = await fetch(`${API_BASE}/ownership_types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create ownership type");
  return res.json();
}

export async function updateOwnershipType(
  id: string | number,
  data: { name: string }
) {
  const res = await fetch(`${API_BASE}/ownership_types/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update ownership type");
  return res.json();
}

export async function deleteOwnershipType(id: number | string) {
  const res = await fetch(`${API_BASE}/ownership_types/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete ownership type");
  if (res.status === 204) return;
  return res.json();
}
