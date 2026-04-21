import BookingCheckoutConfirmView from "@/components/dashboard/booking-checkout-confirm-view";

export default async function DashboardBookingCheckoutConfirmPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <BookingCheckoutConfirmView bookingId={id} />;
}
