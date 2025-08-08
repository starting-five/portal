import { createBrowserClient } from "@supabase/ssr";

export function getCurrentUserJWT() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return supabase.auth.getSession().then(({ data }) => data.session?.access_token || null);
}
