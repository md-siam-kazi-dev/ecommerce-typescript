"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { DashboardNavItem } from "@/config/dashboard-nav";
import type { UserRole } from "@/lib/user-role";

export function AppSidebar({
  role,
  nav,
}: {
  role: UserRole;
  nav: DashboardNavItem[];
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <Sidebar style={{ top: "6rem", height: "calc(100svh - 6rem)" }}>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 px-2 py-1">
          <span className="font-heading text-lg tracking-[-0.03em] text-sidebar-foreground">
            Aesthete
          </span>
          <span className="rounded-full bg-sidebar-accent px-2 py-0.5 font-mono text-[0.55rem] uppercase tracking-[0.18em] text-sidebar-accent-foreground">
            {role}
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Separator />
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={handleSignOut}
        >
          <LogOut />
          Sign out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
