"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Menu, Check, ExternalLink, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { 
  useGetNotificationsQuery,
  useGetProfileSettingsQuery
} from "@/lib/redux/features/settings/settings-api";
import { motion, AnimatePresence } from "framer-motion";

type DashboardTopbarProps = {
  onMenuClick: () => void;
};

const breadcrumbMap: Record<string, string[]> = {
  "/dashboard": ["Dashboard", "Overview"],
  "/dashboard/courses": ["Dashboard", "Courses"],
  "/dashboard/bookings": ["Dashboard", "Bookings"],
  "/dashboard/support": ["Dashboard", "Support"],
  "/dashboard/settings": ["Dashboard", "Settings"],
};

export function DashboardTopbar({ onMenuClick }: DashboardTopbarProps) {
  const pathname = usePathname();
  const { data: profileSettings } = useGetProfileSettingsQuery();
  const profile = profileSettings?.data.screen.sidebarProfile;

  const displayName = profile?.name || "Learner";
  const displayEmail = profile?.email || "No email available";
  const avatar = profile?.avatar;
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const crumbs =
    pathname.startsWith("/dashboard/courses/")
      ? pathname.endsWith("/book")
        ? ["Dashboard", "Courses", "Booking"]
        : ["Dashboard", "Courses", "Details"]
      : breadcrumbMap[pathname] ?? ["Dashboard"];

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const { data: notificationsData } = useGetNotificationsQuery();
  const notifications = notificationsData?.data.notifications || [];
  const unreadCount = notifications.filter((n) => n.unread).length;


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
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative grid h-10 w-10 place-items-center rounded-full border transition-all duration-200 ${
                showNotifications
                  ? "border-[#3851bb] bg-[#3851bb] text-white shadow-lg"
                  : "border-[#cfe0fb] bg-[#f7fbff] text-[#3851bb] hover:border-[#3851bb] hover:bg-[#ebf3ff]"
              }`}
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-3 w-[320px] overflow-hidden rounded-2xl border border-[#e2eaf5] bg-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-xl sm:w-[380px]"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-[#f0f5fa] px-5 py-4">
                    <h3 className="text-sm font-semibold text-[#1e293b]">
                      Notifications
                    </h3>
                    <button className="text-[11px] font-medium text-[#3851bb] transition-colors hover:text-[#2a3c8e]">
                      Mark all as read
                    </button>
                  </div>

                  <div className="max-h-[360px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`group flex gap-4 border-b border-[#f0f5fa] px-5 py-4 transition-colors hover:bg-[#f8fbff] ${
                            notification.unread ? "bg-[#fcfdfe]" : ""
                          }`}
                        >
                          <div className="mt-1 flex-shrink-0">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                notification.unread
                                  ? "bg-[#3851bb]/10 text-[#3851bb]"
                                  : "bg-[#94a3b8]/10 text-[#64748b]"
                              }`}
                            >
                              <Bell className="h-4 w-4" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium text-[#1e293b]">
                                {notification.title}
                              </p>
                              {notification.unread && (
                                <span className="h-1.5 w-1.5 rounded-full bg-[#3851bb]" />
                              )}
                            </div>
                            <p className="mt-0.5 text-[13px] leading-relaxed text-[#64748b]">
                              {notification.description}
                            </p>
                            <p className="mt-1.5 text-[11px] font-medium text-[#94a3b8]">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-10 text-center text-sm text-[#94a3b8]">
                        No new notifications
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="bg-[#f8fbff] p-3 text-center">
                    <Link
                      href="/dashboard/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3851bb] transition-colors hover:text-[#2a3c8e]"
                    >
                      View all notifications
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/dashboard/settings"
            className="hidden items-center gap-3 rounded-full border border-[#bde3fd] bg-[#fbfdff]/95 px-2 py-1.5 pr-5 text-left shadow-[0_8px_18px_rgba(58,165,228,0.08)] sm:flex"
          >
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#3851bb]/10 bg-[#f8fbff]">
              {avatar?.imageUrl ? (
                <Image
                  src={avatar.imageUrl}
                  alt={displayName}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#3851bb] text-base font-bold text-white">
                  {avatar?.initials || displayName[0]}
                </div>
              )}
            </div>
            <div>
              <p className="text-[16px] font-medium leading-none text-[#3646a5]">
                {displayName}
              </p>
              <p className="mt-1 text-xs text-[#93a2ba]">
                {displayEmail}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
