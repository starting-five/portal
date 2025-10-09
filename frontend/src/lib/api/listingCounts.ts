import { API_BASE } from "./apiBase";

export async function getListingCounts(user_id: string) {
  const res = await fetch(`${API_BASE}/listings/counts?user_id=${user_id}`);
  if (!res.ok) throw new Error("Failed to fetch listing counts");
  return res.json();
}
