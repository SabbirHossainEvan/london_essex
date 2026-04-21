"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock3, MapPin, ReceiptText, ShieldCheck, User } from "lucide-react";
import PanelCard from "@/components/dashboard/panel-card";
import { useGetBookingByIdQuery } from "@/lib/redux/features/bookings/booking-api";

type BookingDetailViewProps = {
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

  return "We could not load the booking right now.";
}

function normalizeImageUrl(value?: string) {
  if (!value) {
    return "/hero-collage.png";
  }

  if (!value.startsWith("https://placehold.co/")) {
    return value;
  }

  const url = new URL(value);

  if (!url.pathname.endsWith(".png")) {
    url.pathname = `${url.pathname}.png`;
  }

  return url.toString();
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#e4edf8] bg-white px-4 py-3">
      <span className="text-sm text-[#72819b]">{label}</span>
      <span className="text-sm font-medium text-[#2e3e98]">{value}</span>
    </div>
  );
}

export default function BookingDetailView({ bookingId }: BookingDetailViewProps) {
  const { data, isLoading, isError, error } = useGetBookingByIdQuery(bookingId);
  const booking = data?.data.booking;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-52 rounded bg-[#e6eef8]" />
          <div className="h-9 w-80 rounded bg-[#e6eef8]" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <div className="h-[360px] rounded-[20px] bg-[#eef4fb]" />
          <div className="h-[360px] rounded-[20px] bg-[#eef4fb]" />
        </div>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="rounded-2xl border border-[#fecaca] bg-[#fff3f3] px-5 py-4 text-sm text-[#dc2626]">
        {resolveErrorMessage(error)}
      </div>
    );
  }

  const progress = booking.progress ?? {};
  const course = booking.course ?? {};
  const personalDetails = booking.personalDetails ?? {};
  const payment = booking.payment ?? {};
  const detailHref = course.slug ? `/dashboard/courses/${course.slug}` : "/dashboard/courses";

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
          <span className="font-medium text-[#4451ac]">{booking.bookingNumber}</span>
        </div>
        <h1 className="mt-3 text-3xl font-semibold text-[#24346b]">
          {course.title || "Booking Details"}
        </h1>
        <p className="mt-2 text-sm text-[#6d7d98]">
          Booking reference: {booking.bookingNumber}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <PanelCard className="space-y-5 rounded-[20px] p-5">
          <div className="overflow-hidden rounded-[18px] border border-[#dce8f7] bg-[#f7fbff]">
            <div className="relative aspect-[4/3]">
              <Image
                src={normalizeImageUrl(course.thumbnailUrl)}
                alt={course.title || "Course"}
                fill
                className="object-cover"
                sizes="340px"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-[#72819b]">Status</span>
              <span className="rounded-full bg-[#fff4dd] px-3 py-1 text-xs font-medium text-[#b7791f]">
                {booking.statusBadge?.label || booking.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#70809d]">
              <Clock3 className="h-4 w-4 text-[#5166c5]" />
              <span>{course.schedule || booking.session?.displayDateTime || "Schedule pending"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#70809d]">
              <MapPin className="h-4 w-4 text-[#5166c5]" />
              <span>{booking.session?.location || course.location || "Location pending"}</span>
            </div>
          </div>

          <div className="space-y-3 rounded-[16px] border border-[#dce8f7] bg-[#f5fbff] p-4">
            <p className="text-sm font-semibold text-[#314092]">Progress</p>
            <InfoRow label="Details" value={progress.details || "pending"} />
            <InfoRow label="Payment" value={progress.payment || "pending"} />
            <InfoRow label="Confirmation" value={progress.confirmation || "pending"} />
          </div>

          <Link
            href={detailHref}
            className="block rounded-xl bg-[#1ea6df] px-5 py-3 text-center text-sm font-medium text-white shadow-[0_10px_22px_rgba(30,166,223,0.18)]"
          >
            {booking.actions?.detailsLabel || "Course Details"}
          </Link>
          {booking.status === "pending_payment" ? (
            <Link
              href={`/dashboard/bookings/${booking.id}/checkout/payment`}
              className="block rounded-xl border border-[#d8e5f6] bg-white px-5 py-3 text-center text-sm font-medium text-[#4356ad]"
            >
              Continue Checkout
            </Link>
          ) : null}
        </PanelCard>

        <div className="space-y-6">
          <PanelCard className="space-y-4 rounded-[20px] p-5">
            <div className="flex items-center gap-2 text-[#314092]">
              <User className="h-4 w-4" />
              <h2 className="text-lg font-semibold">Personal Details</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <InfoRow label="Full Name" value={personalDetails.fullName || "-"} />
              <InfoRow label="Email" value={personalDetails.email || "-"} />
              <InfoRow label="Phone" value={personalDetails.phoneNumber || "-"} />
              <InfoRow label="Date of Birth" value={personalDetails.dateOfBirth || "-"} />
              <InfoRow label="City" value={personalDetails.city || "-"} />
              <InfoRow label="Postcode" value={personalDetails.postcode || "-"} />
            </div>
            <InfoRow label="Address" value={personalDetails.address || "-"} />
            <InfoRow
              label="Training Centre"
              value={personalDetails.trainingCenter || course.location || "-"}
            />
          </PanelCard>

          <PanelCard className="space-y-4 rounded-[20px] p-5">
            <div className="flex items-center gap-2 text-[#314092]">
              <ReceiptText className="h-4 w-4" />
              <h2 className="text-lg font-semibold">Payment Details</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <InfoRow label="Payment Status" value={payment.status || booking.paymentStatus || "-"} />
              <InfoRow label="Amount" value={payment.displayAmount || course.displayPrice || "-"} />
              <InfoRow label="Method" value={payment.method || "-"} />
              <InfoRow label="Card" value={payment.cardLast4 ? `**** ${payment.cardLast4}` : "-"} />
            </div>
            {booking.notes ? (
              <div className="rounded-xl border border-[#d7efdf] bg-[#effcf3] px-4 py-3 text-sm text-[#2d7f54]">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4" />
                  <span>{booking.notes}</span>
                </div>
              </div>
            ) : null}
          </PanelCard>
        </div>
      </div>
    </div>
  );
}
