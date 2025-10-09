import { API_BASE } from "./apiBase";

// export async function getLookups() {
//   console.log("Fetching lookups from API...");
//   console.log("API_BASE:", API_BASE);
//   const res = await fetch(`${API_BASE}/lookups`, { cache: "no-store" });
//   if (!res.ok) throw new Error("Failed to fetch lookups");
//   return res.json();
// }

export async function getLookups() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL_SERVER;
  console.log("Fetching lookups from API...");
  console.log("API_BASE:", apiBase);
  const res = await fetch(`${apiBase}/lookups`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch lookups");
  return res.json();
}
