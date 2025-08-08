import { createBrowserClient } from "@supabase/ssr";

export async function getCurrentUser() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

export async function getCurrentUserId() {
  const user = await getCurrentUser();
  return user?.id || null;
}
