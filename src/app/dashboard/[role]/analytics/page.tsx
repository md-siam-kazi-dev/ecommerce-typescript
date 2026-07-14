"use client";

import { RequireRole } from "@/components/dashboard/role-gate";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

// Demo data — replace with real metrics from the analytics API later.
const stats = [
  { label: "Revenue (30d)", value: "$48,210", delta: "+12.4%" },
  { label: "Orders", value: "1,284", delta: "+8.1%" },
  { label: "New customers", value: "326", delta: "+5.6%" },
  { label: "Avg order value", value: "$37.55", delta: "+1.9%" },
];

const sales = [
  { month: "Jan", revenue: 3200 },
  { month: "Feb", revenue: 3800 },
  { month: "Mar", revenue: 4100 },
  { month: "Apr", revenue: 3600 },
  { month: "May", revenue: 4700 },
  { month: "Jun", revenue: 5200 },
  { month: "Jul", revenue: 4900 },
  { month: "Aug", revenue: 6100 },
  { month: "Sep", revenue: 5800 },
  { month: "Oct", revenue: 6900 },
  { month: "Nov", revenue: 7400 },
  { month: "Dec", revenue: 8100 },
];

const categories = [
  { category: "Ceramics", sales: 4200 },
  { category: "Textiles", sales: 3100 },
  { category: "Objects", sales: 2600 },
  { category: "Lighting", sales: 1900 },
  { category: "Kitchen", sales: 2300 },
];

const salesConfig = {
  revenue: { label: "Revenue", color: "#412D15" },
} satisfies ChartConfig;

const categoryConfig = {
  sales: { label: "Sales", color: "#412D15" },
} satisfies ChartConfig;

const currency = (value: number) =>
  `$${value.toLocaleString("en-US")}`;

export default function AdminAnalyticsPage() {
  return (
    <RequireRole role="admin">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl tracking-[-0.02em] text-foreground">
            Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            Track store performance and trends.
          </p>
        </div>

        {/* Demo KPI tiles */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} size="sm">
              <CardHeader>
                <CardDescription>{s.label}</CardDescription>
                <CardTitle className="text-2xl">{s.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-emerald-700">{s.delta} vs last period</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sales overview — area chart */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Sales overview</CardTitle>
            <CardDescription>Monthly revenue for the past year.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={salesConfig} className="aspect-auto h-[300px] w-full">
              <AreaChart data={sales} margin={{ left: 12, right: 12 }}>
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={56}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => currency(value as number)}
                    />
                  }
                />
                <Area
                  dataKey="revenue"
                  type="natural"
                  fill="url(#fillRevenue)"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Sales by category — bar chart */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Sales by category</CardTitle>
            <CardDescription>Revenue distribution across top categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={categoryConfig} className="aspect-auto h-[300px] w-full">
              <BarChart data={categories}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={48}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => currency(value as number)}
                    />
                  }
                />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={6} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </RequireRole>
  );
}
