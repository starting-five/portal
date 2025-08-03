export default async function DashboardHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div>
      <h1>Welcome to your dashboard! (Locale: {locale})</h1>
      {/* Dashboard content here */}
    </div>
  );
}
