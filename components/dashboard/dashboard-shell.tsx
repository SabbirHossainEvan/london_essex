"use client";

import React from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#f8fbff] text-[#1f2a44]">
      <DashboardSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-[250px]">
        <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="px-5 py-5 sm:px-6 lg:px-6 xl:px-7">{children}</main>
      </div>
    </div>
  );
}
