import BookingDetailView from "@/components/dashboard/booking-detail-view";

export default async function DashboardBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <BookingDetailView bookingId={id} />;
}
