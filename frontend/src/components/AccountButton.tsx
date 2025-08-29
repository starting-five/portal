"use client";

import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";

export function AccountButton() {
  const router = useRouter();
  const t = useTranslations();
  return (
    <div
      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100"
      onClick={() => router.push("/dashboard/account")}
    >
      <User className="size-4" />
      {t("AccountButton.account")}
    </div>
  );
}
