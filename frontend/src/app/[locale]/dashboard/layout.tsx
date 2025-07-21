import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
    // console.log("DashboardLayout params:", params);
    // console.log("locale:", params.locale);
    const { locale } = await params;
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar locale={locale} />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}
