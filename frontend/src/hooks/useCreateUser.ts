import { useMutation } from '@tanstack/react-query';
import { API_BASE } from "@/lib/api/apiBase";

export interface CreateUserInput {
  id: string;
  email: string;
  name?: string;
  role?: string;
  phone?: string;
  avatar_url?: string;
  accessToken: string;
}

async function createUser(input: CreateUserInput) {
  const { accessToken, ...user } = input;
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(user),
  });
  if (!res.ok) {
    throw new Error('Failed to create user');
  }
  return res.json();
}

export function useCreateUser() {
  return useMutation({
    mutationFn: createUser,
  });
}
