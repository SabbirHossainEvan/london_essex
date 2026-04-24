"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, ChevronRight, CreditCard, Lock, ShieldCheck } from "lucide-react";
import PanelCard from "@/components/dashboard/panel-card";
import {
  useCompleteBookingPaymentMutation,
  useCreateBookingPaymentIntentMutation,
  useGetBookingCheckoutPaymentQuery,
} from "@/lib/redux/features/bookings/booking-api";

type BookingCheckoutPaymentViewProps = {
  bookingId: string;
};

type PaymentFormState = {
  acceptedTerms: boolean;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

function getPaymentMethodIdFromCardNumber(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, "");

  if (digits === "4242424242424242") {
    return "pm_card_visa";
  }

  if (digits === "4000000000000002") {
    return "pm_card_visa_chargeDeclined";
  }

  return null;
}

function resolveErrorMessage(error: unknown, fallback = "We could not load the payment screen right now.") {
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

function shouldBypassApprovalErrorInDev(error: unknown) {
  if (process.env.NODE_ENV !== "development") {
    return false;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message
      .toLowerCase()
      .includes("must be approved before payment can begin");
  }

  return false;
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

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length < 3 ? digits : `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function AlertCard({
  tone,
  message,
}: {
  tone: string;
  message: string;
}) {
  const classes =
    tone === "success"
      ? "border-[#cdeccf] bg-[#effcf3] text-[#26915a]"
      : "border-[#d7e8f8] bg-[#f6fbff] text-[#5f6f90]";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${classes}`}>
      <div className="flex items-center gap-2 font-medium">
        <ShieldCheck className="h-4 w-4" />
        {message}
      </div>
    </div>
  );
}

export default function BookingCheckoutPaymentView({
  bookingId,
}: BookingCheckoutPaymentViewProps) {
  const router = useRouter();
  const { data, isLoading, isError, error } = useGetBookingCheckoutPaymentQuery(bookingId);
  const [createPaymentIntent, { isLoading: isCreatingIntent }] = useCreateBookingPaymentIntentMutation();
  const [completePayment, { isLoading: isCompletingPayment }] = useCompleteBookingPaymentMutation();
  const screen = data?.data.screen;
  const [payment, setPayment] = React.useState<PaymentFormState>({
    acceptedTerms: false,
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const isSubmitting = isCreatingIntent || isCompletingPayment;
  const isStripeTestMode = screen?.stripe?.enabled === false;
  const selectedPaymentMethodId = getPaymentMethodIdFromCardNumber(payment.cardNumber);
  const allowPaymentProgressInDev = process.env.NODE_ENV === "development";

  React.useEffect(() => {
    if (!screen?.terms) {
      return;
    }

    setPayment((current) => ({
      ...current,
      acceptedTerms: screen.terms?.accepted ?? false,
    }));
  }, [screen]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-48 rounded bg-[#e6eef8]" />
          <div className="h-9 w-72 rounded bg-[#e6eef8]" />
        </div>
        <div className="rounded-[20px] bg-white p-6 shadow-[0_8px_24px_rgba(60,101,154,0.08)]">
          <div className="h-8 w-full rounded bg-[#eef4fb]" />
          <div className="mt-4 h-24 rounded bg-[#eef4fb]" />
        </div>
      </div>
    );
  }

  if (isError || !screen) {
    return (
      <div className="rounded-2xl border border-[#fecaca] bg-[#fff3f3] px-5 py-4 text-sm text-[#dc2626]">
        {resolveErrorMessage(error)}
      </div>
    );
  }

  const paymentEnabled =
    screen.actions?.pay?.enabled !== false || allowPaymentProgressInDev;

  const canPay =
    paymentEnabled &&
    (!screen.terms?.required || payment.acceptedTerms) &&
    payment.cardNumber.replace(/\s/g, "").length === 16 &&
    payment.expiry.replace(/\D/g, "").length === 4 &&
    payment.cvc.length >= 3 &&
    (!isStripeTestMode || selectedPaymentMethodId !== null);

  async function handlePay() {
    if (!canPay || isSubmitting) {
      return;
    }

    try {
      setSubmitError(null);
      const intentResponse = await createPaymentIntent({
        bookingId,
        agreedToTerms: payment.acceptedTerms,
      }).unwrap();

      const paymentIntentId = intentResponse.data.paymentIntent.id;

      if (isStripeTestMode && !selectedPaymentMethodId) {
        setSubmitError(
          "Only supported Stripe test cards can be used right now. Use 4242 4242 4242 4242 for success or 4000 0000 0000 0002 to simulate a failed payment.",
        );
        return;
      }

      const paymentResponse = await completePayment({
        bookingId,
        agreedToTerms: payment.acceptedTerms,
        paymentIntentId,
        paymentMethodId: selectedPaymentMethodId || undefined,
      }).unwrap();

      if (!paymentResponse.success) {
        setSubmitError(
          paymentResponse.data.booking.payment?.failureReason ||
            paymentResponse.message ||
            "Payment failed. Please check your card details and try again.",
        );
        return;
      }

      router.push(`/dashboard/bookings/${bookingId}/checkout/confirm`);
    } catch (submitPaymentError) {
      if (shouldBypassApprovalErrorInDev(submitPaymentError)) {
        router.push(`/dashboard/bookings/${bookingId}/checkout/confirm`);
        return;
      }

      setSubmitError(
        resolveErrorMessage(
          submitPaymentError,
          "We could not prepare your payment right now.",
        ),
      );
    }
  }

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
          <span className="font-medium text-[#4451ac]">{screen.summary.title}</span>
        </div>
      </div>

      <PanelCard className="space-y-6 rounded-[20px] p-5 sm:p-6">
        <CheckoutStepper steps={screen.steps} />

        <section className="space-y-5 rounded-[16px] border border-[#dce8f7] bg-white/70 p-4">
          <div>
            <h2 className="text-lg font-semibold text-[#314092]">{screen.title}</h2>
            <p className="mt-1 text-sm text-[#7a88a3]">{screen.description}</p>
          </div>

          <div className="space-y-3">
            {screen.alerts?.map((alert) => (
              <AlertCard key={alert.id} tone={alert.tone} message={alert.message} />
            ))}
          </div>

          <div className="rounded-2xl border border-[#cae6f8] bg-[#e9f6ff] p-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xl font-semibold text-[#3646a5]">{screen.summary.title}</p>
                <p className="mt-1 text-sm text-[#7990a8]">{screen.summary.subtitle}</p>
              </div>
              <p className="text-2xl font-semibold text-[#3646a5]">
                {screen.summary.displayAmount}
              </p>
            </div>
          </div>

          {screen.terms ? (
            <label className="flex items-start gap-3 rounded-xl border border-[#d7e8f8] bg-[#f6fbff] px-4 py-3">
              <input
                type="checkbox"
                checked={payment.acceptedTerms}
                onChange={(event) =>
                  setPayment((current) => ({
                    ...current,
                    acceptedTerms: event.target.checked,
                  }))
                }
                className="mt-1 h-4 w-4 rounded border-[#c6d5eb]"
              />
              <span className="text-sm leading-6 text-[#6c7b97]">
                {screen.terms.checkboxLabel}
              </span>
            </label>
          ) : null}

          <div className="rounded-2xl border border-[#d7efdf] bg-[#effcf3] px-4 py-3 text-sm text-[#26915a]">
            <div className="flex items-center gap-2 font-medium">
              <Lock className="h-4 w-4" />
              Secure encrypted payment
            </div>
          </div>

          {isStripeTestMode ? (
            <div className="rounded-2xl border border-[#fde68a] bg-[#fff8db] px-4 py-3 text-sm text-[#9a6700]">
              Test mode is active right now. The typed card number is used only to choose a Stripe
              test payment method.
              <span className="font-semibold"> 4242 4242 4242 4242</span> will succeed and
              <span className="font-semibold"> 4000 0000 0000 0002</span> will show a payment
              failure.
            </div>
          ) : null}

          <div className="grid gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#32418b]">Pay by card</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#91a1bc]">
                  <CreditCard className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={payment.cardNumber}
                  onChange={(event) =>
                    setPayment((current) => ({
                      ...current,
                      cardNumber: formatCardNumber(event.target.value),
                    }))
                  }
                  placeholder="Card number"
                  className="h-12 w-full rounded-xl border border-[#dce8f7] bg-[#f5fbff] pl-11 pr-4 text-sm text-[#24346b] outline-none transition focus:border-[#1ea6df] focus:bg-white"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#32418b]">Expiry</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#91a1bc]">
                    <CalendarDays className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={payment.expiry}
                    onChange={(event) =>
                      setPayment((current) => ({
                        ...current,
                        expiry: formatExpiry(event.target.value),
                      }))
                    }
                    placeholder="MM / YY"
                    className="h-12 w-full rounded-xl border border-[#dce8f7] bg-[#f5fbff] pl-11 pr-4 text-sm text-[#24346b] outline-none transition focus:border-[#1ea6df] focus:bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#32418b]">CVC</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#91a1bc]">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={payment.cvc}
                    onChange={(event) =>
                      setPayment((current) => ({
                        ...current,
                        cvc: event.target.value.replace(/\D/g, "").slice(0, 4),
                      }))
                    }
                    placeholder="CVC"
                    className="h-12 w-full rounded-xl border border-[#dce8f7] bg-[#f5fbff] pl-11 pr-4 text-sm text-[#24346b] outline-none transition focus:border-[#1ea6df] focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {submitError ? (
            <div className="rounded-2xl border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
              {submitError}
            </div>
          ) : null}

          <div className="flex flex-col-reverse justify-between gap-3 border-t border-[#e4edf8] pt-5 sm:flex-row">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => router.push(`/dashboard/bookings/${bookingId}/checkout/details`)}
              className={`rounded-xl border border-[#d8e5f6] px-5 py-3 text-sm font-medium text-[#4356ad] ${
                isSubmitting ? "cursor-not-allowed bg-[#f5f8fd] opacity-70" : "bg-white"
              }`}
            >
              {screen.actions?.back?.label || "Back"}
            </button>
            <button
              type="button"
              disabled={!canPay || isSubmitting}
              onClick={handlePay}
              className={`rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(30,166,223,0.18)] ${
                canPay && !isSubmitting
                  ? "bg-[#1ea6df]"
                  : "cursor-not-allowed bg-[#9fdcf3]"
              }`}
            >
              {isSubmitting ? "Preparing payment..." : screen.actions?.pay?.label || "Pay"}
            </button>
          </div>
        </section>
      </PanelCard>
    </div>
  );
}
