"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { clearAuthUser } from "@/store/authUserSlice";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export function LogoutButton() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const t = useTranslations("LogoutButton");

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    dispatch(clearAuthUser());
    // Redirect to login or home page after logout
    // If you have locale in the path, extract it
    const segments = pathname.split("/").filter(Boolean);
    const locale = segments.length > 0 ? segments[0] : "";
    router.push(locale ? `/${locale}/` : "/");
  };

  return (
    <div
      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100"
      onClick={handleLogout}
    >
      <LogOut className="size-4" />
      {t("logout")}
    </div>
  );
}
