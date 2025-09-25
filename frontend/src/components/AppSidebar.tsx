"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import type { RootState } from "@/store/store";
import { Home, List } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSelector } from "react-redux";
import { NavUser } from "./nav-user";
import { Separator } from "./ui/separator";

export function AppSidebar({ locale }: { locale: string }) {
  const t = useTranslations("Sidebar");
  const user = useSelector((state: RootState) => state.authUser?.user);

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
      items: [
        {
          title: t("drafts"),
          url: `/${locale}/dashboard/listings/drafts`,
        },
        {
          title: t("active"),
          url: `/${locale}/dashboard/listings/active`,
        },
        {
          title: t("archive"),
          url: `/${locale}/dashboard/listings/archive`,
        },
      ],
    },
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
      <SidebarContent className="flex flex-col h-full">
        <div className="flex-1">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.items?.length ? (
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuItem key={subItem.title}>
                            <SidebarMenuButton asChild>
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenuSub>
                    ) : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ email: user?.email }} />
      </SidebarFooter>
    </Sidebar>
  );
}
