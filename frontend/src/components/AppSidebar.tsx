import { Calendar, Home, Inbox, List, Search, Settings } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { Separator } from "./ui/separator";

export function AppSidebar({ locale }: { locale: string }) {
  const t = useTranslations("Sidebar");
  // Menu items.
  const items = [
    {
      title: t("home"),
      url: `/${locale}/dashboard`,
      icon: Home,
    },
    {
      title: t("my_listings"),
      url: `/${locale}/dashboard/listings`,
      icon: List,
    },
    // {
    //   title: t("settings"),
    //   url: "#",
    //   icon: Settings,
    // },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <Link href={`/${locale}/dashboard`}>
          <h1 className="text-lg font-bold">Company Logo</h1>
        </Link>
      </SidebarHeader>
      <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
      />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}