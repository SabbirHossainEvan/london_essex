"use client";

import React from "react";
import type { BookingStatus } from "@/app/(dashboard)/dashboard/bookings/bookings-data";
import { bookingTabs, bookings } from "@/app/(dashboard)/dashboard/bookings/bookings-data";
import BookingsHeaderCard from "@/components/dashboard/bookings-header-card";
import BookingsListPanel from "@/components/dashboard/bookings-list-panel";

export default function DashboardBookingsPage() {
  const [activeTab, setActiveTab] = React.useState<BookingStatus>("upcoming");

  return (
    <div className="space-y-6">
      <BookingsHeaderCard />
      <BookingsListPanel
        tabs={bookingTabs}
        bookings={bookings}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
    </div>
  );
}
