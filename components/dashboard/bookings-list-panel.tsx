import PanelCard from "@/components/dashboard/panel-card";
import BookingCard from "@/components/dashboard/booking-card";
import BookingTabs from "@/components/dashboard/booking-tabs";
import type { BookingItem, BookingStatus } from "@/app/(dashboard)/dashboard/bookings/bookings-data";

type BookingsListPanelProps = {
  tabs: Array<{ key: BookingStatus; label: string }>;
  bookings: BookingItem[];
  activeTab: BookingStatus;
  onChange: (tab: BookingStatus) => void;
};

export default function BookingsListPanel({
  tabs,
  bookings,
  activeTab,
  onChange,
}: BookingsListPanelProps) {
  const filteredBookings = bookings.filter((booking) => booking.status === activeTab);

  return (
    <PanelCard className="rounded-[14px] bg-[#edf6ff] p-4 sm:p-5">
      <div className="rounded-[14px] border border-[#dce8f7] bg-white/55 p-3 sm:p-4">
        <BookingTabs
          tabs={tabs}
          bookings={bookings}
          activeTab={activeTab}
          onChange={onChange}
        />

        <div className="mt-5 min-h-[430px] rounded-[14px] border border-[#dce8f7] bg-white p-3 sm:p-4">
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}

            {filteredBookings.length === 0 ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-[12px] border border-dashed border-[#d5e5f8] bg-white text-sm text-[#8090aa]">
                No bookings found in this section.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </PanelCard>
  );
}
