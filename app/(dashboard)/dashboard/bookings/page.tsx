"use client";

import React from "react";
import type { BookingStatus } from "@/app/(dashboard)/dashboard/bookings/bookings-data";
import type { BookingItem } from "@/app/(dashboard)/dashboard/bookings/bookings-data";
import { bookingTabs } from "@/app/(dashboard)/dashboard/bookings/bookings-data";
import BookingsHeaderCard from "@/components/dashboard/bookings-header-card";
import BookingsListPanel from "@/components/dashboard/bookings-list-panel";
import { useGetBookingsQuery } from "@/lib/redux/features/bookings/booking-api";

function formatBookingDateTime(booking: {
  session?: {
    displayDate?: string;
    displayTime?: string;
    displayDateTime?: string;
  };
}) {
  if (booking.session?.displayDateTime) {
    return booking.session.displayDateTime;
  }

  const parts = [booking.session?.displayDate, booking.session?.displayTime].filter(Boolean);
  return parts.join(" | ");
}

function normalizeDetailsUrl(url?: string, slug?: string) {
  if (slug) {
    return `/dashboard/courses/${slug}`;
  }

  if (!url) {
    return "/dashboard/courses";
  }

  return url.startsWith("/courses/")
    ? url.replace("/courses/", "/dashboard/courses/")
    : url;
}

function mapBookingsToItems(
  bookings: Array<{
    id: string;
    tab: BookingStatus;
    statusBadge?: { label: string };
    session?: { location?: string; displayDate?: string; displayTime?: string; displayDateTime?: string };
    course?: { title?: string; slug?: string; thumbnailUrl?: string };
    actions?: { detailsLabel?: string; detailsUrl?: string };
  }>
): BookingItem[] {
  return bookings.map((booking) => ({
    id: booking.id,
    title: booking.course?.title || "Course booking",
    datetime: formatBookingDateTime(booking) || "Date to be confirmed",
    location: booking.session?.location || "Location to be confirmed",
    label: booking.statusBadge?.label || "Booking",
    status: booking.tab,
    imageUrl: booking.course?.thumbnailUrl,
    detailsUrl: normalizeDetailsUrl(booking.actions?.detailsUrl, booking.course?.slug),
    detailsLabel: booking.actions?.detailsLabel || "Course Details",
  }));
}

function resolveErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  return "We could not load your bookings right now.";
}

export default function DashboardBookingsPage() {
  const { data, isLoading, isError, error } = useGetBookingsQuery();
  const [activeTab, setActiveTab] = React.useState<BookingStatus>("upcoming");
  const bookings = React.useMemo(
    () => mapBookingsToItems(data?.data.bookings ?? []),
    [data]
  );

  React.useEffect(() => {
    const apiActiveTab = data?.data.tabs?.active;

    if (apiActiveTab) {
      setActiveTab(apiActiveTab);
    }
  }, [data]);

  return (
    <div className="space-y-6">
      <BookingsHeaderCard />
      {isLoading ? (
        <div className="rounded-[14px] bg-[#edf6ff] p-4 sm:p-5">
          <div className="animate-pulse rounded-[14px] border border-[#dce8f7] bg-white/55 p-4">
            <div className="h-10 w-72 rounded bg-[#e7eef8]" />
            <div className="mt-5 space-y-4 rounded-[14px] border border-[#dce8f7] bg-white p-4">
              <div className="h-28 rounded bg-[#eef4fb]" />
              <div className="h-28 rounded bg-[#eef4fb]" />
            </div>
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-[#fecaca] bg-[#fff3f3] px-5 py-4 text-sm text-[#dc2626]">
          {resolveErrorMessage(error)}
        </div>
      ) : (
        <BookingsListPanel
          tabs={bookingTabs}
          bookings={bookings}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      )}
    </div>
  );
}
