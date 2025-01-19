"use client";

import DashboardSidebar from "@/modules/dashboard/components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen h-fit">
      <DashboardSidebar />
      <main className="flex-1 p-12 h-fit">{children}</main>
    </div>
  );
}
