import { API_BASE } from "./apiBase";

export async function getLookups() {
  console.log("Fetching lookups from API...");
  console.log("API_BASE:", API_BASE);
  const res = await fetch(`${API_BASE}/lookups`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch lookups");
  return res.json();
}
