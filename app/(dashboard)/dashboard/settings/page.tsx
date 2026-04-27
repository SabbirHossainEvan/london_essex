"use client";

import React, { useState, useEffect, useRef } from "react";
import NotificationSettingsList, { NotificationToggleItem } from "@/components/dashboard/notification-settings-list";
import ProfileSettingsForm from "@/components/dashboard/profile-settings-form";
import SecuritySettingsForm from "@/components/dashboard/security-settings-form";
import SettingsNav from "@/components/dashboard/settings-nav";
import SettingsSectionCard from "@/components/dashboard/settings-section-card";
import { useGetMeQuery } from "@/lib/redux/features/auth/auth-api";
import { useDashboardProfile } from "@/lib/dashboard-profile";
import {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} from "@/lib/redux/features/settings/settings-api";
import {
  settingsTabs,
  type SettingsTabKey,
} from "@/app/(dashboard)/dashboard/settings/settings-data";

export default function DashboardSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTabKey>("profile");
  const [isProfileDirty, setIsProfileDirty] = useState(false);
  const profileSubmitRef = useRef<(() => void) | null>(null);

  // Notification State
  const { data: notificationData, isLoading: isNotificationsLoading } = useGetNotificationSettingsQuery(undefined, {
    skip: activeTab !== "notifications",
  });
  const [updateNotifications, { isLoading: isUpdatingNotifications }] = useUpdateNotificationSettingsMutation();
  const [localNotifications, setLocalNotifications] = useState<NotificationToggleItem[]>([]);
  const [isNotificationsDirty, setIsNotificationsDirty] = useState(false);

  useEffect(() => {
    if (notificationData?.data.screen.section.toggles) {
      setLocalNotifications(notificationData.data.screen.section.toggles);
      setIsNotificationsDirty(false);
    }
  }, [notificationData]);

  const handleNotificationChange = (id: string, value: boolean) => {
    setLocalNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value } : item))
    );
    setIsNotificationsDirty(true);
  };

  const handleSaveNotifications = async () => {
    const body = localNotifications.reduce((acc, curr) => {
      acc[curr.id] = curr.value;
      return acc;
    }, {} as Record<string, boolean>);

    try {
      await updateNotifications(body).unwrap();
      setIsNotificationsDirty(false);
    } catch (error) {
      console.error("Failed to update notifications", error);
    }
  };

  const { data: meData } = useGetMeQuery();
  const profileInitialValues = useDashboardProfile({
    name: meData?.data.user.name || "Jenny Wilson",
    email: meData?.data.user.email || "admin@londonessex.co.uk",
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
      <SettingsNav
        tabs={settingsTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "profile" ? (
        <SettingsSectionCard
          title="Profile Information"
          description="Update your personal details."
          onAction={() => profileSubmitRef.current?.()}
          actionDisabled={!isProfileDirty}
        >
          <ProfileSettingsForm
            initialValues={profileInitialValues}
            onDirtyChange={setIsProfileDirty}
            onSubmitReady={(submit) => {
              profileSubmitRef.current = submit;
            }}
          />
        </SettingsSectionCard>
      ) : null}

      {activeTab === "notifications" ? (
        <SettingsSectionCard
          title={notificationData?.data.screen.section.title || "Email Notifications"}
          description={notificationData?.data.screen.section.subtitle || "Choose which emails you want to receive."}
          onAction={handleSaveNotifications}
          actionDisabled={!isNotificationsDirty || isUpdatingNotifications}
          actionLabel={isUpdatingNotifications ? "Saving..." : "Save Changes"}
        >
          {isNotificationsLoading ? (
            <div className="py-10 text-center text-[#7a88a3]">Loading settings...</div>
          ) : (
            <NotificationSettingsList
              items={localNotifications}
              onChange={handleNotificationChange}
            />
          )}
        </SettingsSectionCard>
      ) : null}

      {activeTab === "security" ? (
        <SettingsSectionCard
          title="Change Password"
          description="Update your password to keep your account secure."
        >
          <SecuritySettingsForm />
        </SettingsSectionCard>
      ) : null}
    </div>
  );
}
