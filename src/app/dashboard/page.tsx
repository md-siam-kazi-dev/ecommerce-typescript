"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSession } from "@/lib/auth-client";
import { getUserRole } from "@/lib/user-role";
import { DashboardLoadingSkeleton } from "@/components/dashboard/dashboard-loading";

export default function DashboardIndexPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    const role = getUserRole(session?.user);
    router.replace(`/dashboard/${role}`);
  }, [isPending, session, router]);

  
}
