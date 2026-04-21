"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, ChevronRight, Mail, MapPin, Phone, User } from "lucide-react";
import PanelCard from "@/components/dashboard/panel-card";
import {
  useGetBookingCheckoutDetailsQuery,
  useUpdateBookingCheckoutDetailsMutation,
} from "@/lib/redux/features/bookings/booking-api";

type BookingCheckoutDetailsViewProps = {
  bookingId: string;
};

type CheckoutFieldState = Record<string, string>;

function resolveErrorMessage(error: unknown, fallback = "We could not load the checkout details right now.") {
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

  return fallback;
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
            <React.Fragment key={step.id}>
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
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-2 block text-sm font-medium text-[#32418b]">{children}</label>;
}

function CheckoutField({
  id,
  type,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const icon =
    id === "fullName" ? (
      <User className="h-4 w-4" />
    ) : id === "email" ? (
      <Mail className="h-4 w-4" />
    ) : id === "phoneNumber" ? (
      <Phone className="h-4 w-4" />
    ) : id === "dateOfBirth" ? (
      <CalendarDays className="h-4 w-4" />
    ) : (
      <MapPin className="h-4 w-4" />
    );

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#91a1bc]">
        {icon}
      </span>
      <input
        type={type === "date" ? "date" : type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-[#dce8f7] bg-[#f5fbff] pl-11 pr-4 text-sm text-[#24346b] outline-none transition focus:border-[#1ea6df] focus:bg-white"
      />
    </div>
  );
}

export default function BookingCheckoutDetailsView({
  bookingId,
}: BookingCheckoutDetailsViewProps) {
  const router = useRouter();
  const [updateCheckoutDetails, updateCheckoutDetailsState] =
    useUpdateBookingCheckoutDetailsMutation();
  const { data, isLoading, isError, error } = useGetBookingCheckoutDetailsQuery(bookingId);
  const screen = data?.data.screen;
  const section = screen?.sections[0];
  const [fields, setFields] = React.useState<CheckoutFieldState>({});
  const [submitError, setSubmitError] = React.useState("");

  React.useEffect(() => {
    if (!section?.fields) {
      return;
    }

    setFields(
      Object.fromEntries(section.fields.map((field) => [field.id, field.value || ""]))
    );
  }, [section]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-48 rounded bg-[#e6eef8]" />
          <div className="h-9 w-72 rounded bg-[#e6eef8]" />
        </div>
        <div className="rounded-[20px] bg-white p-6 shadow-[0_8px_24px_rgba(60,101,154,0.08)]">
          <div className="h-8 w-full rounded bg-[#eef4fb]" />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="h-12 rounded bg-[#eef4fb]" />
            <div className="h-12 rounded bg-[#eef4fb]" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !screen || !section) {
    return (
      <div className="rounded-2xl border border-[#fecaca] bg-[#fff3f3] px-5 py-4 text-sm text-[#dc2626]">
        {resolveErrorMessage(error)}
      </div>
    );
  }

  const isFormIncomplete = section.fields.some(
    (field) => field.required && !(fields[field.id] || "").trim()
  );
  const cancelHref = screen.actions?.cancel?.url
    ? `/dashboard${screen.actions.cancel.url}`
    : `/dashboard/bookings/${bookingId}`;

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
          <span className="font-medium text-[#4451ac]">{screen.course.title}</span>
        </div>
      </div>

      <PanelCard className="space-y-6 rounded-[20px] p-5 sm:p-6">
        <CheckoutStepper steps={screen.steps} />

        <section className="space-y-5 rounded-[16px] border border-[#dce8f7] bg-white/70 p-4">
          <div>
            <h2 className="text-lg font-semibold text-[#314092]">{screen.title}</h2>
            <p className="mt-1 text-sm text-[#7a88a3]">{screen.description}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {section.fields.map((field) => (
              <div
                key={field.id}
                className={field.id === "address" || field.id === "trainingCenter" ? "md:col-span-2" : ""}
              >
                <FieldLabel>
                  {field.label}
                  {field.required ? " *" : ""}
                </FieldLabel>
                <CheckoutField
                  id={field.id}
                  type={field.type}
                  value={fields[field.id] || ""}
                  onChange={(value) =>
                    setFields((current) => ({ ...current, [field.id]: value }))
                  }
                  placeholder={field.label}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col-reverse justify-between gap-3 border-t border-[#e4edf8] pt-5 sm:flex-row">
            <Link
              href={cancelHref}
              className="rounded-xl border border-[#d8e5f6] bg-white px-5 py-3 text-center text-sm font-medium text-[#4356ad]"
            >
              {screen.actions?.cancel?.label || "Cancel"}
            </Link>
            <button
              type="button"
              disabled={isFormIncomplete || updateCheckoutDetailsState.isLoading}
              onClick={async () => {
                setSubmitError("");

                try {
                  await updateCheckoutDetails({
                    bookingId,
                    personalDetails: {
                      fullName: fields.fullName || "",
                      email: fields.email || "",
                      phoneNumber: fields.phoneNumber || "",
                      dateOfBirth: fields.dateOfBirth || "",
                      address: fields.address || "",
                      trainingCenter: fields.trainingCenter || "",
                      city: fields.city || "",
                      postcode: fields.postcode || "",
                    },
                  }).unwrap();

                  router.push(`/dashboard/bookings/${bookingId}/checkout/payment`);
                } catch (submitError) {
                  setSubmitError(
                    resolveErrorMessage(
                      submitError,
                      "We could not update the booking details right now."
                    )
                  );
                }
              }}
              className={`rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(30,166,223,0.18)] ${
                isFormIncomplete || updateCheckoutDetailsState.isLoading
                  ? "cursor-not-allowed bg-[#9fdcf3]"
                  : "bg-[#1ea6df]"
              }`}
            >
              {updateCheckoutDetailsState.isLoading
                ? "Saving..."
                : screen.actions?.continue?.label || "Continue"}
            </button>
          </div>

          {submitError ? (
            <p className="rounded-xl border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
              {submitError}
            </p>
          ) : null}
        </section>
      </PanelCard>
    </div>
  );
}
