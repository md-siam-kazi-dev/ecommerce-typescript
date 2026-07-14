"use client";

import { useParams } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserOverviewSection } from "@/components/dashboard/user-overview";

const adminStats = [
  { label: "Revenue (30d)", value: "$18.4k" },
  { label: "Orders", value: "126" },
  { label: "Active products", value: "48" },
  { label: "New customers", value: "19" },
];

function AdminOverview() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl tracking-[-0.02em] text-foreground">
          Admin dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Store performance at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {adminStats.map((stat) => (
          <Card key={stat.label} size="sm">
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Store overview</CardTitle>
          <CardDescription>
            Detailed widgets and tables will be implemented later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Use the sidebar to manage products, orders, customers, and analytics.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function UserOverview() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl tracking-[-0.02em] text-foreground">
          Your dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          A snapshot of your account activity.
        </p>
      </div>

      <UserOverviewSection />
    </div>
  );
}

export default function DashboardOverviewPage() {
  const params = useParams<{ role: string }>();
  return params.role === "admin" ? <AdminOverview /> : <UserOverview />;
}
