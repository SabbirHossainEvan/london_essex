"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, CircleCheckBig, Clock3 } from "lucide-react";
import PanelCard from "@/components/dashboard/panel-card";
import {
  type BookingCheckoutConfirmationScreen,
  type GetBookingByIdResponse,
  useGetBookingCheckoutConfirmationQuery,
  useLazyGetBookingPaymentStatusQuery,
} from "@/lib/redux/features/bookings/booking-api";

type BookingCheckoutConfirmViewProps = {
  bookingId: string;
};

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

  return "We could not load the payment status right now.";
}

function CheckoutStepper({
  steps,
}: {
  steps: Array<{ id: string; label: string; status: string }>;
}) {
  const currentIndex = steps.findIndex((step) => step.status === "current");

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-center gap-3">
        {steps.map((step, index) => {
          const isDone = step.status === "completed" || index < currentIndex;
          const isActive = step.status === "current";

          return (
            <div key={step.id} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold ${
                    isDone || isActive
                      ? "bg-[#17a5de] text-white"
                      : "bg-[#e7eef7] text-[#7b8ca8]"
                  }`}
                >
                  {isDone ? "✓" : index + 1}
                </span>
                <span
                  className={`text-sm font-medium ${
                    isActive || isDone ? "text-[#2e3e98]" : "text-[#8d9bb2]"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 ? <div className="h-px w-16 bg-[#dce6f4]" /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#e4edf8] bg-white px-4 py-3">
      <span className="text-sm text-[#72819b]">{label}</span>
      <span className="text-sm font-medium text-[#2e3e98]">{value}</span>
    </div>
  );
}

export default function BookingCheckoutConfirmView({
  bookingId,
}: BookingCheckoutConfirmViewProps) {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetBookingCheckoutConfirmationQuery(bookingId);
  const [getPaymentStatus, { isFetching }] = useLazyGetBookingPaymentStatusQuery();
  const [confirmation, setConfirmation] = React.useState<BookingCheckoutConfirmationScreen | null>(
    null,
  );
  const [booking, setBooking] = React.useState<GetBookingByIdResponse["data"]["booking"] | null>(
    null,
  );
  const [statusError, setStatusError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!data?.data.screen) {
      return;
    }

    setConfirmation(data.data.screen);
    setBooking((current) => {
      if (current) {
        return current;
      }

      return {
        id: data.data.screen.booking.id,
        bookingNumber: data.data.screen.booking.bookingNumber,
        status: data.data.screen.booking.status,
        paymentStatus: data.data.screen.booking.paymentStatus,
        tab: "upcoming",
      };
    });
  }, [data]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-52 rounded bg-[#e6eef8]" />
          <div className="h-9 w-72 rounded bg-[#e6eef8]" />
        </div>
        <div className="rounded-[20px] bg-white p-6 shadow-[0_8px_24px_rgba(60,101,154,0.08)]">
          <div className="h-24 rounded bg-[#eef4fb]" />
        </div>
      </div>
    );
  }

  if (isError || !confirmation || !booking) {
    return (
      <div className="rounded-2xl border border-[#fecaca] bg-[#fff3f3] px-5 py-4 text-sm text-[#dc2626]">
        {statusError || resolveErrorMessage(error)}
      </div>
    );
  }

  const isPaid = booking.payment?.status === "paid" || booking.paymentStatus === "paid";

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs text-[#9ba6b9]">
          <span>Dashboard</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/dashboard/bookings" className="transition hover:text-[#4451ac]">
            Bookings
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-[#4451ac]">{confirmation.booking.bookingNumber}</span>
        </div>
      </div>

      <PanelCard className="space-y-6 rounded-[20px] p-5 sm:p-6">
        <CheckoutStepper steps={confirmation.steps} />

        <section className="flex min-h-[360px] flex-col items-center justify-center rounded-[24px] border border-[#dce8f7] bg-[linear-gradient(180deg,#fafdff_0%,#eef9ff_100%)] px-6 py-10 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-[#def5ff] text-[#1aa6de]">
            {isPaid ? <CircleCheckBig className="h-10 w-10" /> : <Clock3 className="h-10 w-10" />}
          </span>
          <h2 className="mt-6 text-2xl font-semibold text-[#2e3e98]">{confirmation.title}</h2>
          <p className="mt-3 max-w-[560px] text-sm leading-7 text-[#72819b]">
            {confirmation.description}
          </p>

          <div className="mt-8 grid w-full max-w-[620px] gap-3">
            <InfoRow label="Booking Number" value={confirmation.booking.bookingNumber} />
            <InfoRow
              label="Payment Status"
              value={booking.statusBadge?.label || confirmation.booking.paymentStatus}
            />
            <InfoRow
              label="Amount"
              value={confirmation.receipt?.displayAmount || booking.payment?.displayAmount || "-"}
            />
            <InfoRow
              label="Transaction ID"
              value={confirmation.receipt?.transactionId || "-"}
            />
            <InfoRow
              label="Card"
              value={
                confirmation.receipt?.cardLast4
                  ? `${confirmation.receipt.cardBrand || "Card"} •••• ${confirmation.receipt.cardLast4}`
                  : "-"
              }
            />
          </div>

          {statusError ? (
            <div className="mt-6 w-full max-w-[620px] rounded-2xl border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
              {statusError}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/dashboard/bookings/${bookingId}`}
              className="rounded-xl border border-[#d1e3f5] bg-white px-5 py-3 text-sm font-medium text-[#3646a5]"
            >
              View Booking
            </Link>
            <button
              type="button"
              onClick={async () => {
                try {
                  setStatusError(null);
                  const statusResponse = await getPaymentStatus(bookingId).unwrap();
                  setConfirmation(statusResponse.data.confirmation);
                  setBooking(statusResponse.data.booking);
                } catch (statusRequestError) {
                  setStatusError(
                    resolveErrorMessage(
                      statusRequestError,
                    ),
                  );
                }
              }}
              className="rounded-xl bg-[#1ea6df] px-5 py-3 text-sm font-medium text-white shadow-[0_10px_22px_rgba(30,166,223,0.18)]"
            >
              {isFetching
                ? "Checking..."
                : confirmation.actions?.primary?.label || "Check Payment Status"}
            </button>
          </div>
        </section>
      </PanelCard>
    </div>
  );
}
