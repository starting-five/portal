import { API_BASE } from "./apiBase";

export async function getCurrencies() {
  const res = await fetch(`${API_BASE}/currencies`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch currencies");
  return res.json();
}

export async function createCurrency(data: { code: string; name: string }) {
  const res = await fetch(`${API_BASE}/currencies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create currency");
  return res.json();
}

export async function getCurrency(id: string | number) {
  const res = await fetch(`${API_BASE}/currencies/${id}`);
  if (!res.ok) throw new Error("Failed to fetch currency");
  return res.json();
}

export async function updateCurrency(
  id: string | number,
  data: { code: string; name: string }
) {
  const res = await fetch(`${API_BASE}/currencies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update currency");
  return res.json();
}

export async function deleteCurrency(id: number | string) {
  const res = await fetch(`${API_BASE}/currencies/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete currency");
  // If response is empty (204 No Content), don't try to parse JSON
  if (res.status === 204) return;
  return res.json();
}
