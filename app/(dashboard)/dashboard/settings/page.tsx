"use client";

import React, { useState, useEffect } from "react";
import NotificationSettingsList from "@/components/dashboard/notification-settings-list";
import SecuritySettingsForm from "@/components/dashboard/security-settings-form";
import SettingsSectionCard from "@/components/dashboard/settings-section-card";
import {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
  useGetSecuritySettingsQuery,
  useChangePasswordMutation,
} from "@/lib/redux/features/settings/settings-api";
import {
  settingsTabs,
  type SettingsTabKey,
} from "@/app/(dashboard)/dashboard/settings/settings-data";

export default function DashboardSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTabKey>("profile");
  
  // Notification States
  const { data: notificationData, isLoading: isNotificationLoading } = useGetNotificationSettingsQuery(undefined, {
    skip: activeTab !== "notifications",
  });
  const [updateNotifications, { isLoading: isUpdatingNotifications }] = useUpdateNotificationSettingsMutation();
  const [localNotificationSettings, setLocalNotificationSettings] = useState<Record<string, boolean>>({});

  // Security States
  const { data: securityData, isLoading: isSecurityLoading } = useGetSecuritySettingsQuery(undefined, {
    skip: activeTab !== "security",
  });
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [securityFormValues, setSecurityFormValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (notificationData) {
      const initial: Record<string, boolean> = {};
      notificationData.data.screen.section.toggles.forEach((t) => {
        initial[t.id] = t.value;
      });
      setLocalNotificationSettings(initial);
    }
  }, [notificationData]);

  const handleNotificationChange = (id: string, value: boolean) => {
    setLocalNotificationSettings((prev) => ({ ...prev, [id]: value }));
  };

  const handleSecurityChange = (id: string, value: string) => {
    setSecurityFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const isNotificationDirty = notificationData
    ? notificationData.data.screen.section.toggles.some(
        (t) => localNotificationSettings[t.id] !== t.value
      )
    : false;

  const isSecurityDirty = Object.values(securityFormValues).some(v => v !== "");

  const handleSave = async () => {
    if (activeTab === "notifications" && isNotificationDirty) {
      try {
        await updateNotifications(localNotificationSettings).unwrap();
      } catch (err) {
        console.error("Failed to update notifications", err);
      }
    } else if (activeTab === "security" && isSecurityDirty) {
      if (securityFormValues.newPassword !== securityFormValues.confirmPassword) {
        alert("New passwords do not match!");
        return;
      }
      try {
        const response = await changePassword(securityFormValues).unwrap();
        setSecurityFormValues({}); // Clear form on success
        alert(response?.message || "Password updated successfully!");
      } catch (err: any) {
        console.error("Failed to change password", err);
        alert(err?.data?.message || "Failed to update password. Please check your current password.");
      }
    }
  };

  const isLoading = (activeTab === "notifications" && isNotificationLoading) || (activeTab === "security" && isSecurityLoading);
  const isSaving = isUpdatingNotifications || isChangingPassword;
  const isDirty = activeTab === "notifications" ? isNotificationDirty : activeTab === "security" ? isSecurityDirty : false;

  const notificationScreen = notificationData?.data.screen;
  const securityScreen = securityData?.data.screen;

  if (isLoading) {
    return <div className="py-20 text-center text-[#7a88a3]">Loading settings...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1e293b]">
            {activeTab === "notifications" ? notificationScreen?.title : activeTab === "security" ? securityScreen?.title : "Setting"}
          </h1>
          <p className="mt-1 text-[#64748b]">
            Manage your account settings and preferences.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#3851bb] px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#2a3c8e] disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-[#e2eaf5] bg-white p-5 text-center">
            <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-[#3851bb]/10 bg-[#f8fbff] p-1">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#3851bb] text-2xl font-bold text-white">
                {(activeTab === "notifications" ? notificationScreen?.sidebarProfile.initials : securityScreen?.sidebarProfile.initials) || "M"}
              </div>
            </div>
            <h3 className="font-semibold text-[#1e293b]">
              {(activeTab === "notifications" ? notificationScreen?.sidebarProfile.name : securityScreen?.sidebarProfile.name) || "Michael Johnson"}
            </h3>
            <p className="text-sm text-[#64748b]">
              {(activeTab === "notifications" ? notificationScreen?.sidebarProfile.email : securityScreen?.sidebarProfile.email) || "michael.johnson@example.com"}
            </p>
          </div>

          <nav className="flex flex-col gap-1 rounded-2xl border border-[#e2eaf5] bg-white p-2">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? "bg-[#3851bb]/10 text-[#3851bb]"
                      : "text-[#64748b] hover:bg-[#f8fbff] hover:text-[#1e293b]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="space-y-6">
          {activeTab === "profile" && (
            <SettingsSectionCard
              title="Profile Information"
              subtitle="Update your personal details and how others see you."
            >
              <div className="py-10 text-center text-[#94a3b8]">
                Profile settings coming soon...
              </div>
            </SettingsSectionCard>
          )}

          {activeTab === "notifications" && notificationScreen && (
            <SettingsSectionCard
              title={notificationScreen.section.title}
              subtitle={notificationScreen.section.subtitle}
            >
              <NotificationSettingsList 
                toggles={notificationScreen.section.toggles}
                localSettings={localNotificationSettings}
                onChange={handleNotificationChange}
              />
            </SettingsSectionCard>
          )}

          {activeTab === "security" && securityScreen && (
            <SettingsSectionCard
              title={securityScreen.section.title}
              subtitle={securityScreen.section.subtitle}
            >
              <SecuritySettingsForm 
                fields={securityScreen.section.form.fields}
                values={securityFormValues}
                onChange={handleSecurityChange}
                title={securityScreen.section.title}
              />
            </SettingsSectionCard>
          )}
        </main>
      </div>
    </div>
  );
}
