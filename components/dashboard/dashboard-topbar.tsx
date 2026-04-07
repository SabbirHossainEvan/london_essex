"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

type DashboardTopbarProps = {
  onMenuClick: () => void;
};

const breadcrumbMap: Record<string, string[]> = {
  "/dashboard": ["Dashboard", "Overview"],
  "/dashboard/courses": ["Dashboard", "Courses"],
  "/dashboard/bookings": ["Dashboard", "Bookings"],
  "/dashboard/progress": ["Dashboard", "Progress"],
  "/dashboard/support": ["Dashboard", "Support"],
  "/dashboard/settings": ["Dashboard", "Settings"],
};

export function DashboardTopbar({ onMenuClick }: DashboardTopbarProps) {
  const pathname = usePathname();
  const crumbs = breadcrumbMap[pathname] ?? ["Dashboard"];

  return (
    <header className="sticky top-0 z-20 border-b border-[#dde7f7] bg-[#fbfdff]/95 backdrop-blur">
      <div className="flex min-h-[74px] items-center justify-between gap-4 px-6 sm:px-8 lg:px-10">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-full border border-[#d7e6f8] bg-white p-2 text-[#32449f] shadow-sm lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>

          <nav className="hidden items-center gap-3 text-[13px] text-[#c4c9d6] sm:flex">
            {crumbs.map((crumb, index) => (
              <div key={`${crumb}-${index}`} className="flex items-center gap-3">
                <span
                  className={
                    index === crumbs.length - 1
                      ? "font-medium text-[#4451ac]"
                      : undefined
                  }
                >
                  {crumb}
                </span>
                {index < crumbs.length - 1 ? <span>/</span> : null}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-[#cfe0fb] bg-[#f7fbff] text-[#3851bb]"
          >
            <Bell className="h-4.5 w-4.5" />
          </button>

          <Link
            href="/dashboard/settings"
            className="hidden items-center gap-3 rounded-full border border-[#bde3fd] bg-[#fbfdff]/95 px-2 py-1.5 pr-5 text-left shadow-[0_8px_18px_rgba(58,165,228,0.08)] sm:flex"
          >
            <Image
              src="/hero-1.png"
              alt="Jenny Wilson"
              width={42}
              height={42}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div>
              <p className="text-[16px] font-medium leading-none text-[#3646a5]">
                Jenny Wilson
              </p>
              <p className="mt-1 text-xs text-[#93a2ba]">
                jeni.wilson@example.com
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
