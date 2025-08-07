"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // Redirect to login or home page after logout
    // If you have locale in the path, extract it
    const segments = pathname.split("/").filter(Boolean);
    const locale = segments.length > 0 ? segments[0] : "";
    router.push(locale ? `/${locale}/` : "/");
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start gap-2"
      onClick={handleLogout}
    >
      <LogOut className="size-4" />
      Logout
    </Button>
  );
}
