export type BookingStatus = "upcoming" | "past" | "cancelled";

export type BookingItem = {
  id: string;
  title: string;
  datetime: string;
  location: string;
  label: string;
  status: BookingStatus;
  imageUrl?: string;
  detailsUrl?: string;
  detailsLabel?: string;
};

export const bookingTabs: Array<{ key: BookingStatus; label: string }> = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
  { key: "cancelled", label: "Cancelled" },
];
