"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  Heart,
  Loader2,
  ShoppingBag,
  Wallet,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiFetch } from "@/lib/api";

export interface UserOverview {
  totalSpend: number;
  totalOrder: number;
  totalCard: number;
  savedItem: number;
}

const apiConfigured = Boolean(process.env.NEXT_PUBLIC_API);

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Wallet;
}) {
  return (
    <Card size="sm">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardDescription className="text-muted-foreground">{label}</CardDescription>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardContent>
    </Card>
  );
}

export function UserOverviewSection() {
  const [data, setData] = useState<UserOverview | null>(null);
  const [isLoading, setIsLoading] = useState(apiConfigured);
  const [error, setError] = useState<string | null>(
    apiConfigured ? null : "NEXT_PUBLIC_API is not configured."
  );

  useEffect(() => {
    if (!apiConfigured) return;

    const controller = new AbortController();

    (async () => {
      try {
        const payload = await apiFetch<UserOverview>("/api/user", {
          signal: controller.signal,
        });
        setData(payload);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Failed to load overview.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Your activity</CardTitle>
          <CardDescription>Loading your account overview…</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Fetching latest data
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Your activity</CardTitle>
          <CardDescription>We couldn’t load your overview.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error ?? "No data available."}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total spent"
          value={currency.format(data.totalSpend)}
          icon={Wallet}
        />
        <StatCard
          label="Total orders"
          value={String(data.totalOrder)}
          icon={ShoppingBag}
        />
        <StatCard
          label="Saved cards"
          value={String(data.totalCard)}
          icon={CreditCard}
        />
        <StatCard
          label="Saved items"
          value={String(data.savedItem)}
          icon={Heart}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Your activity</CardTitle>
          <CardDescription>
            A snapshot of your spending, orders, and saved items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Use the sidebar to view your orders, wishlist, and profile.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
