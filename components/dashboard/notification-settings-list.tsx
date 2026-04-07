"use client";

import React from "react";

type NotificationSetting = {
  title: string;
  description: string;
  enabled: boolean;
};

type NotificationSettingsListProps = {
  items: NotificationSetting[];
};

export default function NotificationSettingsList({
  items,
}: NotificationSettingsListProps) {
  const [settings, setSettings] = React.useState(items);

  return (
    <div className="space-y-1">
      {settings.map((item, index) => (
        <div
          key={item.title}
          className="flex items-center justify-between gap-4 border-b border-dashed border-[#e8eef8] py-5 last:border-b-0 last:pb-0 first:pt-0"
        >
          <div>
            <p className="text-[1.05rem] font-medium text-[#3646a5]">
              {item.title}
            </p>
            <p className="mt-2 text-[13px] text-[#7a88a3]">
              {item.description}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setSettings((current) =>
                current.map((entry, entryIndex) =>
                  entryIndex === index
                    ? { ...entry, enabled: !entry.enabled }
                    : entry
                )
              )
            }
            className={`relative h-8 w-14 rounded-full transition ${
              item.enabled ? "bg-[#1ea6df]" : "bg-[#c9c9c9]"
            }`}
            aria-pressed={item.enabled}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition ${
                item.enabled ? "left-7" : "left-1"
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );
}
