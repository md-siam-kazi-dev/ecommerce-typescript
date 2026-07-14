import {
  BarChart3,
  FileText,
  Heart,
  LayoutDashboard,
  Package,
  Plus,
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
  const base = `/dashboard/${role}`;

    if (role === "admin") {
      return [
        { title: "Overview", href: base, icon: LayoutDashboard },
        { title: "Products", href: `${base}/products`, icon: Package },
        { title: "Add product", href: `${base}/products/new`, icon: Plus },
        { title: "Add Blog", href: `${base}/blog/new`, icon: FileText },
        { title: "Orders", href: `${base}/orders`, icon: ShoppingBag },
        { title: "Customers", href: `${base}/customers`, icon: Users },
        { title: "Analytics", href: `${base}/analytics`, icon: BarChart3 },
      ];
    }

  return [
    { title: "Overview", href: base, icon: LayoutDashboard },
    { title: "Orders", href: `${base}/orders`, icon: ShoppingBag },
    { title: "Wishlist", href: `${base}/wishlist`, icon: Heart },
    { title: "Profile", href: `${base}/profile`, icon: User },
    { title: "Settings", href: `${base}/settings`, icon: Settings },
  ];
}
