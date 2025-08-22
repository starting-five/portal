"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">{t("HomePage.title")}</h1>
      <h1 className="text-2xl font-bold mb-4">Portal Navigation</h1>

      <div className="mt-4">
        <Link href={`/${locale}/auth/login`}>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-gray-700 transition">
            Login
          </button>
        </Link>
      </div>
    </main>
  );
}
