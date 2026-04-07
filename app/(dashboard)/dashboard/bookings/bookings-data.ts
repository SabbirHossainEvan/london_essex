export type BookingStatus = "upcoming" | "past" | "cancelled";

export type BookingItem = {
  id: string;
  title: string;
  datetime: string;
  location: string;
  label: string;
  status: BookingStatus;
};

export const bookings: BookingItem[] = [
  {
    id: "am2-upcoming",
    title: "AM2 Assessment Preparation",
    datetime: "15 May 2026 8:00 pm",
    location: "Birmingham Tech Park",
    label: "Confirmed",
    status: "upcoming",
  },
  {
    id: "am2-past",
    title: "AM2 Assessment Preparation",
    datetime: "15 May 2026 8:00 pm",
    location: "Birmingham Tech Park",
    label: "Completed",
    status: "past",
  },
  {
    id: "am2-cancelled",
    title: "AM2 Assessment Preparation",
    datetime: "15 May 2026 8:00 pm",
    location: "Birmingham Tech Park",
    label: "Cancelled",
    status: "cancelled",
  },
];

export const bookingTabs: Array<{ key: BookingStatus; label: string }> = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
  { key: "cancelled", label: "Cancelled" },
];
