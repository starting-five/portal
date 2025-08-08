// Simple client-side utility for UI display logic only
// Real authorization is handled by the backend

import { getCurrentUserJWT } from "@/lib/supabase/getCurrentUserJWT";

export async function getCurrentUserIdFromJWT(): Promise<string | null> {
  try {
    const jwt = await getCurrentUserJWT();
    if (!jwt) return null;
    
    const payload = JSON.parse(atob(jwt.split('.')[1]));
    return payload.sub || null;
  } catch (error) {
    console.log("Could not get user ID from JWT:", error);
    return null;
  }
}
