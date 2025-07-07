const isServer = typeof window === "undefined";

export const API_BASE = isServer
  ? process.env.NEXT_PUBLIC_API_URL // for server-side (inside Docker)
  : process.env.NEXT_PUBLIC_RELATIVE_API_BASE; // for client-side (browser)
