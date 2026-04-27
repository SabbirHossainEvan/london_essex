"use client";

import React from "react";

export type NotificationToggleItem = {
  id: string;
  label: string;
  description: string;
  value: boolean;
};

type NotificationSettingsListProps = {
  toggles: NotificationToggleItem[];
  localSettings: Record<string, boolean>;
  onChange?: (id: string, value: boolean) => void;
};

export default function NotificationSettingsList({
  toggles,
  localSettings,
  onChange,
}: NotificationSettingsListProps) {
  return (
    <div className="space-y-1">
      {toggles.map((item) => {
        const isEnabled = localSettings[item.id] ?? item.value;
        return (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 border-b border-dashed border-[#e8eef8] py-5 last:border-b-0 last:pb-0 first:pt-0 group transition-all"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[16px] font-semibold text-[#3646a5] group-hover:text-[#1e293b] transition-colors">
                {item.label}
              </p>
              <p className="mt-1 text-[13px] text-[#7a88a3] leading-relaxed">
                {item.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onChange?.(item.id, !isEnabled)}
              className={`relative h-7 w-12 rounded-full transition-all duration-300 ease-in-out ${
                isEnabled ? "bg-[#1ea6df] shadow-[0_0_12px_rgba(30,166,223,0.3)]" : "bg-[#cbd5e1]"
              }`}
              aria-pressed={isEnabled}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ease-in-out ${
                  isEnabled ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}
