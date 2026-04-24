"use client";

import React from "react";
import NotificationSettingsList from "@/components/dashboard/notification-settings-list";
import ProfileSettingsForm from "@/components/dashboard/profile-settings-form";
import SecuritySettingsForm from "@/components/dashboard/security-settings-form";
import SettingsNav from "@/components/dashboard/settings-nav";
import SettingsSectionCard from "@/components/dashboard/settings-section-card";
import { useGetMeQuery } from "@/lib/redux/features/auth/auth-api";
import { useDashboardProfile } from "@/lib/dashboard-profile";
import {
  notificationSettings,
  settingsTabs,
  type SettingsTabKey,
} from "@/app/(dashboard)/dashboard/settings/settings-data";

export default function DashboardSettingsPage() {
  const [activeTab, setActiveTab] = React.useState<SettingsTabKey>("profile");
  const [isProfileDirty, setIsProfileDirty] = React.useState(false);
  const profileSubmitRef = React.useRef<(() => void) | null>(null);
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
          title="Email Notifications"
          description="Choose which emails you want to receive."
        >
          <NotificationSettingsList items={notificationSettings} />
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
