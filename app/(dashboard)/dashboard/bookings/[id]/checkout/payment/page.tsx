import BookingCheckoutPaymentView from "@/components/dashboard/booking-checkout-payment-view";

export default async function DashboardBookingCheckoutPaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <BookingCheckoutPaymentView bookingId={id} />;
}
