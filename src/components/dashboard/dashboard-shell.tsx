"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSession } from "@/lib/auth-client";
import { getUserRole } from "@/lib/user-role";
import { getDashboardNav } from "@/config/dashboard-nav";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const user = session?.user;
  const role = getUserRole(user);
  const nav = getDashboardNav(role);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/auth/login");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Skeleton className="h-8 w-40" />
      </div>
    );
  }

  if (!session) return null;

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
        <div className="p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
