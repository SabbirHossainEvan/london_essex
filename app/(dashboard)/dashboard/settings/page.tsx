import PreferencesCard from "@/components/dashboard/preferences-card";
import ProfileInformationCard from "@/components/dashboard/profile-information-card";
import SectionHeader from "@/components/dashboard/section-header";
import { preferenceItems, profileFields } from "../dashboard-data";

export default function DashboardSettingsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Settings"
        description="Manage your profile, notifications, and student preferences."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <ProfileInformationCard fields={profileFields} />
        <PreferencesCard items={preferenceItems} />
      </div>
    </div>
  );
}
