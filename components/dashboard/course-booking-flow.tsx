"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Check,
  ChevronRight,
  CircleCheckBig,
  CreditCard,
  FileCheck2,
  FileText,
  Lock,
  Mail,
  MapPin,
  NotebookPen,
  Phone,
  ShieldCheck,
  Signature,
  Upload,
  User,
  X,
} from "lucide-react";
import type { CourseSummary } from "@/app/(website)/courses/courses-data";
import PanelCard from "@/components/dashboard/panel-card";
import { useCreateNormalBookingMutation } from "@/lib/redux/features/bookings/booking-api";

type BookingFlowProps = {
  course: CourseSummary;
};

type StandardStepKey = "details" | "payment" | "confirm";
type Am2StepKey =
  | "documents"
  | "checklist"
  | "signatures"
  | "submit"
  | "review"
  | "payment"
  | "confirmed";
type StepKey = StandardStepKey | Am2StepKey;

type DetailFormState = {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  location: string;
  city: string;
  postcode: string;
};

type PaymentState = {
  acceptedTerms: boolean;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

type SubmittedBookingState = {
  bookingNumber: string;
  paymentDisplayAmount: string;
};

const standardSteps: Array<{ key: StandardStepKey; label: string }> = [
  { key: "details", label: "Details" },
  { key: "payment", label: "Payment" },
  { key: "confirm", label: "Confirm" },
];

const am2Steps: Array<{ key: Am2StepKey; label: string }> = [
  { key: "documents", label: "Documents" },
  { key: "checklist", label: "Checklist" },
  { key: "signatures", label: "Signatures" },
  { key: "submit", label: "Submit" },
  { key: "review", label: "Review" },
  { key: "payment", label: "Payment" },
  { key: "confirmed", label: "Confirmed" },
];

const eligibilityOptions = [
  "(EWA) City & Guilds 2346",
  "EAL 603/5982/1",
  "City & Guilds 2357",
  "EAL 501/1605/6 Electrotechnical",
  "EAL 501/1604/6 Electrotechnical Maintenance",
  "City & Guilds 2356 Certificate (NVQ)",
  "City & Guilds 2355-03 Certificate (NVQ)",
  "EAL 100/472/07 Certificate in Electrotechnical Services (NVQ)",
  "City & Guilds 2356-99 - JIB Mature Candidate Assessment route",
  "EAL ETS3 - JIB Mature Candidate Assessment route",
  "City & Guilds 2360 Parts 1 and 2",
  "Level 3 or Level 4 Diplomas in Electrotechnical Studies and Practice (Military Engineering)",
];

const checklistSections = [
  "Safe isolation procedure completed",
  "Inspection sequence reviewed",
  "Testing instruments checked",
  "Fault diagnosis practice completed",
];

const signatureChecklist = [
  "Learner declaration signed",
  "Training provider approval signed",
];

const submissionItems = [
  "Personal details",
  "Documents",
  "Checklist",
  "Signatures",
];

const reviewItems = [
  "Eligibility checked",
  "NVQ registration date confirmed",
  "Assessment pack ready for submission",
];

const completionNotes = {
  standard:
    "Your booking has been placed successfully. A payment receipt and joining instructions will be sent to your email shortly.",
  am2:
    "Your AM2 Assessment Preparation journey is locked in. We have saved your documents and will email your next preparation steps shortly.",
};

function getPriceNumber(price: string) {
  const numeric = Number(price.replace(/[^\d.]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function getInstallment(price: string) {
  const total = getPriceNumber(price);
  return total ? `\u00A3${Math.round(total / 6)}/mo` : price;
}

function getDeposit(price: string) {
  const total = getPriceNumber(price);
  return total ? `\u00A3${Math.round(total * 0.2)}` : price;
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

function splitFullName(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return { firstName: "", lastName: "" };
  }

  const [firstName, ...rest] = trimmed.split(/\s+/);

  return {
    firstName,
    lastName: rest.join(" "),
  };
}

function formatDateForApi(value: string) {
  const trimmed = value.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (!match) {
    return trimmed;
  }

  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

function resolveErrorMessage(error: unknown, fallback: string) {
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

function BookingStepper({
  steps,
  currentStep,
}: {
  steps: Array<{ key: StepKey; label: string }>;
  currentStep: StepKey;
}) {
  const activeIndex = steps.findIndex((step) => step.key === currentStep);

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-center gap-3 pb-1">
        {steps.map((step, index) => {
          const isDone = index < activeIndex;
          const isActive = index === activeIndex;

          return (
            <React.Fragment key={step.key}>
              <div className="flex items-center gap-2">
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold ${
                    isDone || isActive
                      ? "bg-[#17a5de] text-white"
                      : "bg-[#e7eef7] text-[#7b8ca8]"
                  }`}
                >
                  {isDone ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </span>
                <span
                  className={`text-sm font-medium ${
                    isActive ? "text-[#2e3e98]" : "text-[#8d9bb2]"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 ? (
                <div className="h-px w-10 bg-[#dce6f4]" />
              ) : null}
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

function TextField({
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#91a1bc]">
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-[#dce8f7] bg-[#f5fbff] pl-11 pr-4 text-sm text-[#24346b] outline-none transition focus:border-[#1ea6df] focus:bg-white"
      />
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

export default function CourseBookingFlow({ course }: BookingFlowProps) {
  const router = useRouter();
  const isAm2Flow = course.bookingFlow === "am2";
  const [createNormalBooking, createNormalBookingState] =
    useCreateNormalBookingMutation();
  const steps = isAm2Flow ? am2Steps : standardSteps;
  const [currentStep, setCurrentStep] = React.useState<StepKey>(steps[0].key);
  const [details, setDetails] = React.useState<DetailFormState>({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    location: "",
    city: "",
    postcode: "",
  });
  const [payment, setPayment] = React.useState<PaymentState>({
    acceptedTerms: false,
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [eligibilityOpen, setEligibilityOpen] = React.useState(false);
  const [nvqDateOpen, setNvqDateOpen] = React.useState(false);
  const [selectedQualification, setSelectedQualification] = React.useState("");
  const [nvqTiming, setNvqTiming] = React.useState("");
  const [detailsError, setDetailsError] = React.useState("");
  const [submittedBooking, setSubmittedBooking] =
    React.useState<SubmittedBookingState | null>(null);

  const stepOrder = steps.map((step) => step.key);
  const currentIndex = stepOrder.indexOf(currentStep);
  const canGoBack = currentIndex > 0;
  const normalizedPrice = course.price.startsWith("\u00A3")
    ? course.price
    : `\u00A3${course.price.replace(/[^\d.]/g, "")}`;
  const installmentPrice = getInstallment(normalizedPrice);
  const depositPrice = getDeposit(normalizedPrice);

  const moveToStep = (step: StepKey) => setCurrentStep(step);
  const updateDetails = (field: keyof DetailFormState, value: string) => {
    setDetailsError("");
    setDetails((current) => ({ ...current, [field]: value }));
  };
  const updatePayment = (field: keyof PaymentState, value: string | boolean) => {
    setPayment((current) => ({ ...current, [field]: value }));
  };

  const moveNext = async () => {
    if (
      currentStep === "details" &&
      !isAm2Flow &&
      Object.values(details).some((value) => value.trim().length === 0)
    ) {
      return;
    }

    if (currentStep === "details" && !isAm2Flow) {
      const { firstName, lastName } = splitFullName(details.fullName);

      if (!firstName || !lastName) {
        setDetailsError("Please enter both first name and last name.");
        return;
      }

      try {
        const response = await createNormalBooking({
          courseSlug: course.slug,
          personalDetails: {
            title: "",
            firstName,
            lastName,
            dateOfBirth: formatDateForApi(details.dob),
            niNumber: "",
            email: details.email.trim(),
            mobileNumber: details.phone.trim(),
            addressLine1: details.address.trim(),
            addressLine2: "",
            town: details.city.trim(),
            postcode: details.postcode.trim(),
            trainingCenter: details.location.trim(),
          },
        }).unwrap();

        setSubmittedBooking({
          bookingNumber: response.data.booking.bookingNumber,
          paymentDisplayAmount:
            response.data.booking.payment?.displayAmount ||
            response.data.booking.course?.displayPrice ||
            normalizedPrice,
        });

        router.push(`/dashboard/bookings/${response.data.booking.id}/checkout/details`);
      } catch (error) {
        setDetailsError(
          resolveErrorMessage(
            error,
            "We could not save your booking details right now."
          )
        );
      }

      return;
    }

    if (currentStep === "documents" && isAm2Flow) {
      setEligibilityOpen(true);
      return;
    }

    if (eligibilityOpen) {
      setEligibilityOpen(false);
      setNvqDateOpen(true);
      return;
    }

    if (nvqDateOpen) {
      setNvqDateOpen(false);
      moveToStep("checklist");
      return;
    }

    if (currentStep === "payment") {
      moveToStep(isAm2Flow ? "confirmed" : "confirm");
      return;
    }

    const nextStep = stepOrder[currentIndex + 1];
    if (nextStep) {
      moveToStep(nextStep);
    }
  };

  const moveBack = () => {
    if (nvqDateOpen) {
      setNvqDateOpen(false);
      setEligibilityOpen(true);
      return;
    }

    if (eligibilityOpen) {
      setEligibilityOpen(false);
      return;
    }

    const previousStep = stepOrder[currentIndex - 1];
    if (previousStep) {
      moveToStep(previousStep);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#9ba6b9]">
            <span>Dashboard</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/dashboard/courses" className="transition hover:text-[#4451ac]">
              Courses
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-[#4451ac]">{course.title}</span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-[#24346b]">{course.title}</h1>
          <p className="mt-2 text-sm text-[#6d7d98]">
            Complete the booking journey to secure your place.
          </p>
        </div>

        <PanelCard className="space-y-6 rounded-[20px] p-5 sm:p-6">
          <BookingStepper steps={steps} currentStep={currentStep} />

          {(currentStep === "details" || currentStep === "documents") && (
            <section className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-[#314092]">Personal Details</h2>
                <p className="mt-1 text-sm text-[#7a88a3]">
                  {isAm2Flow
                    ? "Please provide your details for the booking."
                    : "Please provide your details for the booking."}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel>Full Name</FieldLabel>
                  <TextField
                    icon={<User className="h-4 w-4" />}
                    value={details.fullName}
                    onChange={(value) => updateDetails("fullName", value)}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <FieldLabel>Email Address</FieldLabel>
                  <TextField
                    icon={<Mail className="h-4 w-4" />}
                    value={details.email}
                    onChange={(value) => updateDetails("email", value)}
                    placeholder="Enter email address"
                    type="email"
                  />
                </div>
                <div>
                  <FieldLabel>Phone Number</FieldLabel>
                  <TextField
                    icon={<Phone className="h-4 w-4" />}
                    value={details.phone}
                    onChange={(value) => updateDetails("phone", value)}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <FieldLabel>Date of Birth</FieldLabel>
                  <TextField
                    icon={<CalendarDays className="h-4 w-4" />}
                    value={details.dob}
                    onChange={(value) => updateDetails("dob", value)}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div className="md:col-span-2">
                  <FieldLabel>Address</FieldLabel>
                  <TextField
                    icon={<MapPin className="h-4 w-4" />}
                    value={details.address}
                    onChange={(value) => updateDetails("address", value)}
                    placeholder="Enter address"
                  />
                </div>
                <div className="md:col-span-2">
                  <FieldLabel>Location</FieldLabel>
                  <TextField
                    icon={<MapPin className="h-4 w-4" />}
                    value={details.location}
                    onChange={(value) => updateDetails("location", value)}
                    placeholder="e.g. London Training Centre"
                  />
                </div>
                <div>
                  <FieldLabel>City</FieldLabel>
                  <TextField
                    icon={<MapPin className="h-4 w-4" />}
                    value={details.city}
                    onChange={(value) => updateDetails("city", value)}
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <FieldLabel>Postcode</FieldLabel>
                  <TextField
                    icon={<MapPin className="h-4 w-4" />}
                    value={details.postcode}
                    onChange={(value) => updateDetails("postcode", value)}
                    placeholder="Enter postcode"
                  />
                </div>
              </div>

              {detailsError ? (
                <p className="rounded-xl border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
                  {detailsError}
                </p>
              ) : null}
            </section>
          )}

          {currentStep === "checklist" && (
            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-[#314092]">AM2 Readiness Checklist</h2>
                <p className="mt-1 text-sm text-[#7a88a3]">
                  Confirm the preparation items before you continue.
                </p>
              </div>
              <div className="space-y-3">
                {checklistSections.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-[#dce8f7] bg-[#f5fbff] px-4 py-3"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#dbf4ff] text-[#19a9de]">
                      <NotebookPen className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#2f408f]">{item}</p>
                      <p className="mt-1 text-xs text-[#7d8da7]">Marked as complete for submission.</p>
                    </div>
                    <CircleCheckBig className="h-5 w-5 text-[#17a85a]" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {currentStep === "signatures" && (
            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-[#314092]">Signatures</h2>
                <p className="mt-1 text-sm text-[#7a88a3]">
                  These declarations must be signed before review.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {signatureChecklist.map((item) => (
                  <div key={item} className="rounded-2xl border border-[#dce8f7] bg-white p-5">
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef6ff] text-[#5166c5]">
                        <Signature className="h-5 w-5" />
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-[#2e3e98]">{item}</p>
                        <p className="mt-2 text-sm leading-6 text-[#74829b]">
                          Signature captured digitally and ready for final submission.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {currentStep === "submit" && (
            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-[#314092]">Submission Pack</h2>
                <p className="mt-1 text-sm text-[#7a88a3]">
                  Your preparation pack is assembled and ready to be submitted.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {submissionItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-[#dce8f7] bg-[#f6fbff] px-4 py-4"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#ddf4ff] text-[#17a5de]">
                      <Upload className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-medium text-[#2f408f]">{item}</p>
                      <p className="text-sm text-[#7a88a3]">Included and validated</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {currentStep === "review" && (
            <section className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-[#314092]">Review Submission</h2>
                <p className="mt-1 text-sm text-[#7a88a3]">
                  Double-check the final items before payment.
                </p>
              </div>
              <div className="space-y-3">
                {reviewItems.map((item) => (
                  <InfoRow key={item} label={item} value="Complete" />
                ))}
                <InfoRow
                  label="Selected qualification"
                  value={selectedQualification || "Not selected"}
                />
                <InfoRow label="NVQ registration date" value={nvqTiming || "Not selected"} />
              </div>
            </section>
          )}

          {currentStep === "payment" && (
            <section className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-[#314092]">Complete Payment</h2>
                <p className="mt-1 text-sm text-[#7a88a3]">
                  Complete payment to secure your place.
                </p>
              </div>

              {!isAm2Flow ? (
                <div className="rounded-2xl border border-[#cdeccf] bg-[#effcf3] px-4 py-3 text-sm text-[#26915a]">
                  <div className="flex items-center gap-2 font-medium">
                    <CircleCheckBig className="h-4 w-4" />
                    Admin Approved Your documents, checklist, and signatures have been verified.
                  </div>
                </div>
              ) : null}

              <div className="rounded-2xl border border-[#cae6f8] bg-[#e9f6ff] p-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xl font-semibold text-[#3646a5]">
                      {isAm2Flow ? course.title : "Normal Courses"}
                    </p>
                    <p className="mt-1 text-sm text-[#7990a8]">
                      {isAm2Flow ? "Assessment preparation package" : "Billed monthly"}
                    </p>
                  </div>
                  <p className="text-2xl font-semibold text-[#3646a5]">
                    {isAm2Flow
                      ? normalizedPrice
                      : submittedBooking?.paymentDisplayAmount || installmentPrice}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#d7efdf] bg-[#effcf3] px-4 py-3 text-sm text-[#26915a]">
                <div className="flex items-center gap-2 font-medium">
                  <Lock className="h-4 w-4" />
                  Secure encrypted payment
                </div>
              </div>

              <label className="flex items-start gap-3 rounded-xl border border-[#d7e8f8] bg-[#f6fbff] px-4 py-3">
                <input
                  type="checkbox"
                  checked={payment.acceptedTerms}
                  onChange={(event) => updatePayment("acceptedTerms", event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#c6d5eb]"
                />
                <span className="text-sm leading-6 text-[#6c7b97]">
                  I agree to the Terms and Conditions and Privacy Policy, and consent to share my
                  information with the training provider.
                </span>
              </label>

              <div className="grid gap-4">
                <div>
                  <FieldLabel>Pay by card</FieldLabel>
                  <TextField
                    icon={<CreditCard className="h-4 w-4" />}
                    value={payment.cardNumber}
                    onChange={(value) => updatePayment("cardNumber", formatCardNumber(value))}
                    placeholder="Card number"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Expiry</FieldLabel>
                    <TextField
                      icon={<CalendarDays className="h-4 w-4" />}
                      value={payment.expiry}
                      onChange={(value) => updatePayment("expiry", formatExpiry(value))}
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <FieldLabel>CVC</FieldLabel>
                    <TextField
                      icon={<ShieldCheck className="h-4 w-4" />}
                      value={payment.cvc}
                      onChange={(value) => updatePayment("cvc", value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="CVC"
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {(currentStep === "confirm" || currentStep === "confirmed") && (
            <section className="flex min-h-[340px] flex-col items-center justify-center rounded-[24px] border border-[#dce8f7] bg-[linear-gradient(180deg,#fafdff_0%,#eef9ff_100%)] px-6 py-10 text-center">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-[#def5ff] text-[#1aa6de]">
                <CircleCheckBig className="h-10 w-10" />
              </span>
              <h2 className="mt-6 text-2xl font-semibold text-[#2e3e98]">
                {isAm2Flow ? "Booking Confirmed" : "Booking Confirmed!"}
              </h2>
              <p className="mt-3 max-w-[560px] text-sm leading-7 text-[#72819b]">
                {completionNotes[course.bookingFlow]}
              </p>
              {!isAm2Flow && submittedBooking?.bookingNumber ? (
                <p className="mt-2 text-sm font-medium text-[#2e3e98]">
                  Booking Reference: {submittedBooking.bookingNumber}
                </p>
              ) : null}
              <div className="mt-8 grid w-full max-w-[540px] gap-3 sm:grid-cols-2">
                <Link
                  href="/dashboard/bookings"
                  className="rounded-xl border border-[#d1e3f5] bg-white px-5 py-3 text-sm font-medium text-[#3646a5]"
                >
                  View bookings
                </Link>
                <Link
                  href="/dashboard/courses"
                  className="rounded-xl bg-[#1ea6df] px-5 py-3 text-sm font-medium text-white shadow-[0_10px_22px_rgba(30,166,223,0.18)]"
                >
                  Back to courses
                </Link>
              </div>
            </section>
          )}

          <div className="flex flex-col-reverse justify-between gap-3 border-t border-[#e4edf8] pt-5 sm:flex-row">
            <div className="flex gap-3">
              <Link
                href="/dashboard/courses"
                className="rounded-xl border border-[#d8e5f6] bg-white px-5 py-3 text-sm font-medium text-[#4356ad]"
              >
                Cancel
              </Link>
              {canGoBack &&
              currentStep !== "confirm" &&
              currentStep !== "confirmed" ? (
                <button
                  type="button"
                  onClick={moveBack}
                  className="rounded-xl border border-[#d8e5f6] bg-white px-5 py-3 text-sm font-medium text-[#4356ad]"
                >
                  Back
                </button>
              ) : null}
            </div>

            {currentStep !== "confirm" && currentStep !== "confirmed" ? (
              <button
                type="button"
                onClick={moveNext}
                disabled={
                  (currentStep === "details" &&
                    !isAm2Flow &&
                    (Object.values(details).some((value) => value.trim().length === 0) ||
                      createNormalBookingState.isLoading)) ||
                  (currentStep === "payment" &&
                    !payment.acceptedTerms)
                }
                className={`rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(30,166,223,0.18)] ${
                  (currentStep === "details" &&
                    !isAm2Flow &&
                    (Object.values(details).some((value) => value.trim().length === 0) ||
                      createNormalBookingState.isLoading)) ||
                  (currentStep === "payment" &&
                    !payment.acceptedTerms)
                    ? "cursor-not-allowed bg-[#9fdcf3]"
                    : "bg-[#1ea6df]"
                }`}
              >
                {currentStep === "details" && !isAm2Flow && createNormalBookingState.isLoading
                  ? "Saving..."
                  : currentStep === "payment"
                  ? `Pay ${isAm2Flow ? normalizedPrice : depositPrice}`
                  : "Continue"}
              </button>
            ) : null}
          </div>
        </PanelCard>
      </div>

      {eligibilityOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#12214d]/35 px-4">
          <PanelCard className="w-full max-w-[440px] rounded-[18px] border-[#1ea6df] p-0 shadow-[0_24px_50px_rgba(18,33,77,0.24)]">
            <div className="flex items-center justify-between border-b border-[#d7e8f8] px-5 py-4">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-[#4451ac]" />
                <h3 className="text-sm font-semibold text-[#3646a5]">
                  AM2 Assessment Eligibility Check
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEligibilityOpen(false)}
                className="rounded-full border border-[#d8e5f6] p-2 text-[#6072ba]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              <p className="text-sm leading-6 text-[#5e6f90]">
                Have you completed or are you registered for any of the following qualifications?
              </p>
              <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
                {eligibilityOptions.map((option) => (
                  <label
                    key={option}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#deebf6] px-3 py-3 text-sm text-[#44516b]"
                  >
                    <input
                      type="radio"
                      name="eligibility"
                      checked={selectedQualification === option}
                      onChange={() => setSelectedQualification(option)}
                      className="mt-1"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#d7e8f8] px-5 py-4">
              <button
                type="button"
                onClick={() => setEligibilityOpen(false)}
                className="rounded-lg border border-[#d7e5f7] bg-white px-4 py-2 text-sm font-medium text-[#4556ad]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={moveNext}
                className="rounded-lg bg-[#1ea6df] px-4 py-2 text-sm font-medium text-white"
              >
                Continue
              </button>
            </div>
          </PanelCard>
        </div>
      ) : null}

      {nvqDateOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#12214d]/35 px-4">
          <PanelCard className="w-full max-w-[380px] rounded-[18px] border-[#1ea6df] p-0 shadow-[0_24px_50px_rgba(18,33,77,0.24)]">
            <div className="flex items-center gap-2 border-b border-[#d7e8f8] px-5 py-4">
              <FileText className="h-4 w-4 text-[#4451ac]" />
              <h3 className="text-sm font-semibold text-[#3646a5]">NVQ Registration Date</h3>
            </div>

            <div className="space-y-4 px-5 py-5">
              <p className="text-sm leading-6 text-[#5e6f90]">
                When did you register for your NVQ?
              </p>
              <div className="space-y-2">
                {["Before 3rd September 2023", "After September 2023"].map((option) => (
                  <label
                    key={option}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#deebf6] px-3 py-3 text-sm text-[#44516b]"
                  >
                    <input
                      type="radio"
                      name="nvq-timing"
                      checked={nvqTiming === option}
                      onChange={() => setNvqTiming(option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#d7e8f8] px-5 py-4">
              <button
                type="button"
                onClick={moveBack}
                className="rounded-lg border border-[#d7e5f7] bg-white px-4 py-2 text-sm font-medium text-[#4556ad]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={moveNext}
                className="rounded-lg bg-[#1ea6df] px-4 py-2 text-sm font-medium text-white"
              >
                Continue
              </button>
            </div>
          </PanelCard>
        </div>
      ) : null}
    </>
  );
}
