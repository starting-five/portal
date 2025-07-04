const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export async function getPriceUnits() {
  const res = await fetch(`${API_BASE}/price_units`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch price units");
  return res.json();
}

export async function getPriceUnit(id: string | number) {
  const res = await fetch(`${API_BASE}/price_units/${id}`);
  if (!res.ok) throw new Error("Failed to fetch price unit");
  return res.json();
}

export async function createPriceUnit(data: { name: string }) {
  const res = await fetch(`${API_BASE}/price_units`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create price unit");
  return res.json();
}

export async function updatePriceUnit(
  id: string | number,
  data: { name: string }
) {
  const res = await fetch(`${API_BASE}/price_units/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update price unit");
  return res.json();
}

export async function deletePriceUnit(id: number | string) {
  const res = await fetch(`${API_BASE}/price_units/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete price unit");
  if (res.status === 204) return;
  return res.json();
}
