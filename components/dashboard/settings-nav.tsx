"use client";

import type { LucideIcon } from "lucide-react";
import type { SettingsTabKey } from "@/app/(dashboard)/dashboard/settings/settings-data";

type SettingsTab = {
  key: SettingsTabKey;
  label: string;
  icon: LucideIcon;
};

type SettingsNavProps = {
  tabs: SettingsTab[];
  activeTab: SettingsTabKey;
  onChange: (tab: SettingsTabKey) => void;
};

export default function SettingsNav({
  tabs,
  activeTab,
  onChange,
}: SettingsNavProps) {
  return (
    <aside className="space-y-3">
      <p className="text-sm font-medium text-[#7d8cab]">Setting</p>
      <div className="space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left text-[15px] font-medium transition ${
                isActive
                  ? "bg-[#1ea6df] text-white shadow-[0_10px_24px_rgba(30,166,223,0.22)]"
                  : "text-[#4d5c78] hover:bg-[#f2f7fd]"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
