"use client";

import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

export function LogoutButton() {
  const t = useTranslations("LogoutButton");
  return (
    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100">
      <LogOut className="size-4" />
      {t("logout")}
    </div>
  );
}
