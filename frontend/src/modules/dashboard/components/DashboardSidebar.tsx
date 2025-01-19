"use client";

import { BarChart3, Home, LineChart } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/modules/common/utils/common.utils";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Holdings",
    url: "/dashboard/holdings",
    icon: BarChart3,
  },
  {
    title: "Trading Signals",
    url: "/dashboard/signals",
    icon: LineChart,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-background-lighter border-r border-border">
      <div className="p-6">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-white mb-4">Navigation</h2>
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                pathname === item.url
                  ? "bg-primary text-white hover:bg-primary hover:text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
