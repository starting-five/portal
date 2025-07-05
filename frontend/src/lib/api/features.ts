const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export async function getFeatures() {
  const res = await fetch(`${API_BASE}/features`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch features");
  return res.json();
}

export async function getFeature(id: string | number) {
  const res = await fetch(`${API_BASE}/features/${id}`);
  if (!res.ok) throw new Error("Failed to fetch feature");
  return res.json();
}

export async function createFeature(data: { name: string; category: string }) {
  const res = await fetch(`${API_BASE}/features`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create feature");
  return res.json();
}

export async function updateFeature(
  id: string | number,
  data: { name: string; category: string }
) {
  const res = await fetch(`${API_BASE}/features/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update feature");
  return res.json();
}

export async function deleteFeature(id: number | string) {
  const res = await fetch(`${API_BASE}/features/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete feature");
  if (res.status === 204) return;
  return res.json();
}
