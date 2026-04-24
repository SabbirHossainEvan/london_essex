"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { useAppSelector } from "@/lib/redux/hooks";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { accessToken, hydrated } = useAppSelector((state) => state.auth);

  React.useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!accessToken) {
      router.replace("/login");
    }
  }, [accessToken, hydrated, router]);

  if (!hydrated) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f8fbff] px-6 text-center text-sm text-[#66758b]">
        Restoring your session...
      </div>
    );
  }

  if (!accessToken) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f8fbff] px-6 text-center text-sm text-[#66758b]">
        Redirecting to login...
      </div>
    );
  }

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
