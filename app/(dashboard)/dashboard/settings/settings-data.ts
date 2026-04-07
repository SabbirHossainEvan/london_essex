import { Bell, CircleUserRound, Shield } from "lucide-react";

export type SettingsTabKey = "profile" | "notifications" | "security";

export const settingsTabs = [
  { key: "profile" as const, label: "Profile", icon: CircleUserRound },
  { key: "notifications" as const, label: "Notifications", icon: Bell },
  { key: "security" as const, label: "Security", icon: Shield },
];

export const notificationSettings = [
  {
    title: "Course Updates",
    description: "Get notified about changes to your enrolled courses",
    enabled: true,
  },
  {
    title: "Booking Confirmations",
    description: "Receive confirmation emails when you book a course",
    enabled: true,
  },
  {
    title: "Checklist Reminders",
    description: "Get reminders to complete your AM2 checklist sections",
    enabled: true,
  },
  {
    title: "Document Requests",
    description: "Get notified when documents are requested or approved",
    enabled: true,
  },
  {
    title: "Signature Requests",
    description: "Get notified when signatures are needed or received",
    enabled: true,
  },
  {
    title: "Weekly Progress Digest",
    description: "Receive a weekly summary of your progress and upcoming deadlines",
    enabled: false,
  },
];
