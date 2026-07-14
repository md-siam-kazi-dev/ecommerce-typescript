"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSession } from "@/lib/auth-client";
import { getUserRole, type UserRole } from "@/lib/user-role";
import { DashboardLoadingSkeleton } from "@/components/dashboard/dashboard-loading";

export function RequireRole({
  role,
  children,
}: {
  role: UserRole;
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const actualRole = getUserRole(session?.user);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/auth/login");
      return;
    }
    if (!isPending && actualRole !== role) {
      router.replace(`/dashboard/${actualRole}`);
    }
  }, [isPending, session, actualRole, role, router]);

  if (isPending || !session || actualRole !== role) {
    return <DashboardLoadingSkeleton />;
  }

  return <>{children}</>;
}
