"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  BookOpen,
  Gauge,
  Headset,
  LogOut,
  Search,
  Settings,
  Ticket,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hooks";
import { clearCredentials } from "@/lib/redux/features/auth/auth-slice";

type DashboardSidebarProps = {
  open: boolean;
  onClose: () => void;
};

const dashboardNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: Gauge, group: "Menu" },
  { label: "Courses", href: "/dashboard/courses", icon: BookOpen, group: "Menu" },
  { label: "Bookings", href: "/dashboard/bookings", icon: Ticket, group: "Menu" },
  { label: "Support", href: "/dashboard/support", icon: Headset, group: "Help" },
  { label: "Setting", href: "/dashboard/settings", icon: Settings, group: "Help" },
];

import { useGetProfileSettingsQuery } from "@/lib/redux/features/settings/settings-api";

export function DashboardSidebar({
  open,
  onClose,
}: DashboardSidebarProps) {
  const [logoutModalOpen, setLogoutModalOpen] = React.useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  
  const { data: profileSettings } = useGetProfileSettingsQuery();
  
  const profile = profileSettings?.data.screen.sidebarProfile;
  const displayName = profile?.name || "Learner";
  const displayEmail = profile?.email || "No email available";
  const avatar = profile?.avatar;

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-[#12214d]/25 backdrop-blur-sm transition lg:hidden ${
          open || logoutModalOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => {
          if (logoutModalOpen) {
            setLogoutModalOpen(false);
            return;
          }

          onClose();
        }}
      />

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-[250px] border-r border-[#dce8f7] bg-[#fdfefe] transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[#edf3fb] px-4 py-5">
            <div className="flex items-center gap-3">
              <Image
                src="/Logo (1) 1.png"
                alt="London Essex Electrical Training"
                width={228}
                height={34}
                priority
                className="h-auto w-[180px]"
              />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#d7e6f8] p-2 text-[#33469c] lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-4 py-5">
            <div className="flex items-center gap-3 rounded-xl bg-[#eef5fd] px-4 py-3 text-[#7b8db1]">
              <Search className="h-4 w-4" />
              <input
                type="search"
                placeholder="Search..."
                aria-label="Search navigation"
                className="w-full bg-transparent text-sm text-[#2b3d95] placeholder:text-[#7b8db1] outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4">
            {["Menu", "Help"].map((group) => (
              <div
                key={group}
                className="border-t border-[#edf3fb] py-5 first:border-t-0 first:pt-0"
              >
                <p className="mb-3 px-2 text-xs font-medium text-[#9da8b8]">
                  {group}
                </p>
                <div className="space-y-2">
                  {dashboardNavItems
                    .filter((item) => item.group === group)
                    .map((item) => {
                      const active =
                        item.href === "/dashboard"
                          ? pathname === item.href
                          : pathname === item.href || pathname.startsWith(`${item.href}/`);
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onClose}
                          className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-medium transition [&_svg]:shrink-0 [&>span]:text-inherit ${
                            active
                              ? "bg-[#1ea6df] text-white shadow-[0_10px_24px_rgba(30,166,223,0.22)] [&_svg]:text-white [&>span]:text-white"
                              : "text-[#2b3d95] hover:bg-[#f2f7fd]"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#edf3fb] px-4 py-5">
            <p className="mb-3 text-xs font-medium text-[#9da8b8]">Profile</p>
            <Link
              href="/dashboard/settings"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-[#f2f7fd]"
            >
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#3851bb]/10 bg-[#f8fbff]">
                {avatar?.imageUrl ? (
                  <Image
                    src={avatar.imageUrl}
                    alt={displayName}
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#3851bb] text-lg font-bold text-white">
                    {avatar?.initials || displayName[0]}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-medium text-[#2f3fa0]">
                  {displayName}
                </p>
                <p className="truncate text-xs text-[#93a2ba]">
                  {displayEmail}
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setLogoutModalOpen(true)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-[#9ddafd] bg-[#eef8ff] px-4 py-3 text-lg font-medium text-[#2f3fa0] shadow-[0_10px_22px_rgba(37,167,230,0.12)]"
            >
              <LogOut className="h-5 w-5" />
              Log out
            </button>
          </div>
        </div>
      </aside>

      {logoutModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-[20px] border border-[#dce8f7] bg-white p-6 shadow-[0_24px_60px_rgba(18,33,77,0.18)]">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#fff4e5] text-[#f59e0b]">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#2f3fa0]">
                  Log Out?
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#6e7f9d]">
                  Are you sure you want to log out of your account?
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setLogoutModalOpen(false)}
                className="rounded-[10px] border border-[#d8e4f6] bg-white px-5 py-2.5 text-sm font-medium text-[#33469c]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setLogoutModalOpen(false);
                  onClose();
                  dispatch(clearCredentials());
                  router.push("/login");
                }}
                className="rounded-[10px] bg-[#ff6b6b] px-5 py-2.5 text-sm font-medium text-white shadow-[0_10px_24px_rgba(255,107,107,0.22)]"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
