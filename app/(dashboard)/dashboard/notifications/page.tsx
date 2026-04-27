"use client";

import { useState } from "react";
import { 
  Bell, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  CheckCircle2, 
  Trash2, 
  MoreVertical,
  Filter,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetNotificationSettingsQuery,
  useGetNotificationsQuery,
} from "@/lib/redux/features/settings/settings-api";

type NotificationType = "all" | "unread" | "courses" | "support";

interface Notification {
  id: string;
  type: "course" | "support" | "system" | "booking";
  title: string;
  description: string;
  time: string;
  unread: boolean;
  actionLabel?: string;
  actionUrl?: string;
}


export default function NotificationsPage() {
  const [filter, setFilter] = useState<NotificationType>("all");
  
  const { data: settingsData, isLoading: isSettingsLoading } = useGetNotificationSettingsQuery();
  const { data: notificationsData, isLoading: isNotificationsLoading } = useGetNotificationsQuery();
  
  const screenData = settingsData?.data.screen;
  const notifications = notificationsData?.data.notifications || [];

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return n.unread;
    // We'll use a simple includes check for other filters since the API might have different types
    if (filter === "courses") return n.title.toLowerCase().includes("course");
    if (filter === "support") return n.title.toLowerCase().includes("support") || n.title.toLowerCase().includes("ticket");
    return true;
  });

  const markAllAsRead = () => {
    // To be implemented with mutation
  };

  const deleteNotification = (id: string) => {
    // To be implemented with mutation
  };

  const markAsRead = (id: string) => {
    // To be implemented with mutation
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "course": return <BookOpen className="h-5 w-5" />;
      case "support": return <MessageSquare className="h-5 w-5" />;
      case "booking": return <CheckCircle2 className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getIconBg = (type: string, unread: boolean) => {
    if (!unread) return "bg-gray-100 text-gray-500";
    switch (type) {
      case "course": return "bg-blue-100 text-blue-600";
      case "support": return "bg-purple-100 text-purple-600";
      case "booking": return "bg-green-100 text-green-600";
      default: return "bg-amber-100 text-amber-600";
    }
  };

  if (isSettingsLoading) {
    return <div className="py-20 text-center text-[#7a88a3]">Loading notification center...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">
            {screenData?.title === "Setting" ? "Notification Center" : screenData?.title || "Notification Center"}
          </h1>
          <p className="text-[#64748b] mt-1">
            {screenData?.section.subtitle || "Manage all your course updates, system alerts, and support messages."}
          </p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#e2eaf5] rounded-xl text-sm font-semibold text-[#3851bb] shadow-sm hover:bg-[#f8fbff] transition-all"
        >
          <Check className="h-4 w-4" />
          Mark all as read
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {(["all", "unread", "courses", "support"] as NotificationType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium capitalize transition-all whitespace-nowrap ${
              filter === tab
                ? "bg-[#3851bb] text-white shadow-md"
                : "bg-white text-[#64748b] border border-[#e2eaf5] hover:border-[#3851bb]/50 hover:bg-[#f8fbff]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`group relative bg-white rounded-2xl border transition-all hover:shadow-lg hover:border-[#3851bb]/30 ${
                  notification.unread ? "border-[#3851bb]/20 shadow-sm" : "border-[#e2eaf5]"
                }`}
              >
                <div className="p-5 flex gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${getIconBg(notification.type, notification.unread)}`}>
                    {getIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-[15px] font-semibold truncate ${notification.unread ? "text-[#1e293b]" : "text-[#475569]"}`}>
                          {notification.title}
                        </h3>
                        {notification.unread && (
                          <span className="h-2 w-2 rounded-full bg-[#3851bb] animate-pulse" />
                        )}
                      </div>
                      <span className="text-xs font-medium text-[#94a3b8] whitespace-nowrap">
                        {notification.time}
                      </span>
                    </div>
                    
                    <p className={`mt-1 text-sm leading-relaxed ${notification.unread ? "text-[#475569]" : "text-[#64748b]"}`}>
                      {notification.description}
                    </p>

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-3">
                      {notification.actionLabel && (
                        <a 
                          href={notification.actionUrl}
                          className="text-xs font-bold text-[#3851bb] hover:underline flex items-center gap-1"
                        >
                          {notification.actionLabel}
                        </a>
                      )}
                      
                      <div className="ml-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {notification.unread && (
                          <button 
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-[#3851bb] hover:bg-blue-50 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#e2eaf5]"
            >
              <div className="h-20 w-20 bg-[#f8fbff] rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-10 w-10 text-[#cfe0fb]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1e293b]">All caught up!</h3>
              <p className="text-[#64748b] mt-1">You don't have any notifications in this category.</p>
              <button 
                onClick={() => setFilter("all")}
                className="mt-6 text-sm font-bold text-[#3851bb] hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
