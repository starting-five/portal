import { API_BASE } from "./apiBase";

export async function getUserById(id: string, accessToken: string) {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch user info from backend");
  return res.json();
}
