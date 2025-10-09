"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";
import { Home } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardHome() {
  const t = useTranslations("Dashboard");
  const user = useAppSelector((state) => state.authUser.user);
  const name = user?.name || t("defaultName");
  const email = user?.email || t("noEmail");
  const pathname = usePathname();
  // Extract locale from pathname (assumes /[locale]/...)
  const locale = pathname.split("/")[1] || "en";

  return (
    <div className="bg-slate-50 p-8 min-h-[70vh] flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{t("profileTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-blue-100 p-4 mb-2">
                <Home className="h-8 w-8 text-blue-600" />
              </div>
              <p className="font-semibold text-slate-800 text-lg">{name}</p>
              <p className="text-slate-600 text-sm">{email}</p>
              <Button asChild className="mt-4">
                <Link href={`/${locale}/dashboard/account`}>
                  {t("editProfile")}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
