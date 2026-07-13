"use client";

import { useSession } from "@/lib/auth-client";
import { getUserRole } from "@/lib/user-role";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const userStats = [
  { label: "Open orders", value: "3" },
  { label: "Saved items", value: "12" },
  { label: "Reward points", value: "240" },
  { label: "Addresses", value: "2" },
];

const adminStats = [
  { label: "Revenue (30d)", value: "$18.4k" },
  { label: "Orders", value: "126" },
  { label: "Active products", value: "48" },
  { label: "New customers", value: "19" },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const role = getUserRole(session?.user);
  const isAdmin = role === "admin";
  const stats = isAdmin ? adminStats : userStats;
  const name = session?.user?.name ?? session?.user?.email ?? "there";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl tracking-[-0.02em] text-foreground">
          {isAdmin ? "Admin dashboard" : "Your dashboard"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, {name}. This is your {role} workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} size="sm">
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* TODO: implement dashboard logic later */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">
            {isAdmin ? "Store overview" : "Your activity"}
          </CardTitle>
          <CardDescription>
            Detailed widgets and tables will be implemented later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Use the sidebar to navigate {isAdmin ? "admin" : "account"} sections.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
