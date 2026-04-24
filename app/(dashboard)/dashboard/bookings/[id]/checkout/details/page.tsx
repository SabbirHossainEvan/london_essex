import BookingCheckoutDetailsView from "@/components/dashboard/booking-checkout-details-view";

export default async function DashboardBookingCheckoutDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <BookingCheckoutDetailsView bookingId={id} />;
}
