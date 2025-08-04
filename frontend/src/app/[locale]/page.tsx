import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">{t("HomePage.title")}</h1>
      <h1 className="text-2xl font-bold mb-4">Portal Navigation</h1>

      <Link href={`/${locale}/dashboard`}>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Go to Dashboard
        </button>
      </Link>
    </main>
  );
}
