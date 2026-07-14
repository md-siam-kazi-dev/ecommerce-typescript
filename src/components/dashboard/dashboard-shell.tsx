"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSession } from "@/lib/auth-client";
import { getUserRole, type UserRole } from "@/lib/user-role";
import { getDashboardNav } from "@/config/dashboard-nav";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardLoadingSkeleton } from "@/components/dashboard/dashboard-loading";

function normalizeRole(role: unknown): UserRole | undefined {
  return role === "admin" || role === "user" ? role : undefined;
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const params = useParams<{ role?: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  const roleParam = normalizeRole(params.role);
  const role: UserRole = roleParam ?? "user";
  const actualRole = getUserRole(session?.user);
  const nav = getDashboardNav(role);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/auth/login");
      return;
    }
    if (!isPending && roleParam && roleParam !== actualRole) {
      router.replace(`/dashboard/${actualRole}`);
    }
  }, [isPending, session, router, roleParam, actualRole]);

  

  const activeTitle =
    nav.find((item) => item.href === pathname)?.title ?? "Dashboard";

  return (
    <SidebarProvider>
      <AppSidebar role={role} nav={nav} />
      <SidebarInset className="pt-24">
        <header className="sticky top-24 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
          <SidebarTrigger className="rounded-full" />
          <div className="flex flex-col leading-tight">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
              {role === "admin" ? "Admin" : "Account"}
            </span>
            <span className="font-heading text-sm font-medium">
              {activeTitle}
            </span>
          </div>
        </header>
        <div className="p-4 md:p-6">{session ? children : null}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
