import {
  BarChart3,
  Heart,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  User,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { UserRole } from "@/lib/user-role";

export interface DashboardNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export function getDashboardNav(role: UserRole): DashboardNavItem[] {
  if (role === "admin") {
    return [
      { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { title: "Products", href: "/dashboard/products", icon: Package },
      { title: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
      { title: "Customers", href: "/dashboard/customers", icon: Users },
      { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    ];
  }

  return [
    { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { title: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { title: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { title: "Profile", href: "/dashboard/profile", icon: User },
    { title: "Settings", href: "/dashboard/settings", icon: Settings },
  ];
}
