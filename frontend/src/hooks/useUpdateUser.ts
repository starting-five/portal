import { API_BASE } from "@/lib/api/apiBase";
import { useMutation } from "@tanstack/react-query";

export interface UpdateUserInput {
  id: string;
  name?: string;
  phone?: string;
  avatar_url?: string;
  watermark_url?: string | null;
  accessToken: string;
}

async function updateUser(input: UpdateUserInput) {
  const { id, accessToken, ...user } = input;
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(user),
  });
  if (!res.ok) {
    throw new Error("Failed to update user");
  }
  return res.json();
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: updateUser,
  });
}
