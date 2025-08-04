
const isServer = typeof window === "undefined";

export const API_BASE = isServer
  ? process.env.NEXT_PUBLIC_API_URL_SERVER // for server-side (inside Docker)
  : process.env.NEXT_PUBLIC_API_URL_CLIENT; // for client-side (browser)
