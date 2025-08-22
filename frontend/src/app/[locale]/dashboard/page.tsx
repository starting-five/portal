import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect(`/${locale}/auth/login`);
  }

  return (
    <div>
      <h1>Welcome to your dashboard! (Locale: {locale})</h1>
      <pre>{JSON.stringify(data.claims, null, 2)}</pre>
    </div>
  );
}
