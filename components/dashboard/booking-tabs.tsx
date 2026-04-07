import type { BookingItem, BookingStatus } from "@/app/(dashboard)/dashboard/bookings/bookings-data";

type BookingTabsProps = {
  tabs: Array<{ key: BookingStatus; label: string }>;
  bookings: BookingItem[];
  activeTab: BookingStatus;
  onChange: (tab: BookingStatus) => void;
};

export default function BookingTabs({
  tabs,
  bookings,
  activeTab,
  onChange,
}: BookingTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const count = bookings.filter((booking) => booking.status === tab.key).length;
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`rounded-[10px] px-4 py-2 text-[15px] font-medium transition ${
              isActive
                ? "bg-white text-[#3445a6] shadow-[0_6px_16px_rgba(56,91,169,0.08)]"
                : "text-[#4c5b79]"
            }`}
          >
            {tab.label} ({count})
          </button>
        );
      })}
    </div>
  );
}
