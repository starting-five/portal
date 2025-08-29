import { AppSidebar } from "@/components/AppSidebar";
import DashboardBreadcrumbs from "@/components/DashboardBreadcrumbs";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <SidebarProvider>
      <AppSidebar locale={locale} />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4 z-50">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <DashboardBreadcrumbs />
          <div className="ml-auto flex items-center">
            <LocaleSwitcher currentLocale={locale} />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center min-h-screen">
          <main className="flex-1 flex items-center justify-center min-h-screen">
            {children}
          </main>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
