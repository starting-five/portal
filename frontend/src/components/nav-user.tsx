"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/client";
import { clearAuthUser } from "@/store/authUserSlice";
import { ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AccountButton } from "./AccountButton";
import { LogoutButton } from "./LogoutButton";

export function NavUser({
  user,
  locale,
}: {
  user: {
    email: string;
  };
  locale: string;
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                {/* <span className="truncate font-medium">{user.name}</span> */}
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  {/* <span className="truncate font-medium">{user.name}</span> */}
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={() => {
                  router.push(`/${locale}/dashboard/account`);
                }}
                className="cursor-pointer hover:bg-gray-100"
              >
                <AccountButton />
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                dispatch(clearAuthUser());
                router.push(`/${locale}/`);
              }}
              className="cursor-pointer hover:bg-gray-100"
            >
              <LogoutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
