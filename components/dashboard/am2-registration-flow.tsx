"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  BadgeCheck,
  CalendarDays,
  Check,
  CircleCheckBig,
  Clock3,
  ChevronRight,
  CreditCard,
  FileText,
  Lock,
  Mail,
  PenTool,
  Phone,
  PartyPopper,
  Signature,
  Upload,
  X,
} from "lucide-react";
import type { CourseSummary } from "@/app/(website)/courses/courses-data";
import PanelCard from "@/components/dashboard/panel-card";
import {
  type GetBookingFlowSubmitResponse,
  type GetBookingFlowReviewResponse,
  type GetBookingCheckoutPaymentResponse,
  type SubmitBookingForReviewResponse,
  type RequestTrainingProviderSignatureRequest,
  type SubmitCandidateSignatureRequest,
  useCompleteBookingPaymentMutation,
  useCreateBookingPaymentIntentMutation,
  useCreateNormalBookingMutation,
  useLazyGetAm2eChecklistFlowByCourseQuery,
  useGetBookingCheckoutPaymentQuery,
  useGetBookingFlowChecklistSummaryQuery,
  useGetBookingFlowDocumentsQuery,
  useGetBookingFlowReviewQuery,
  useGetBookingFlowSignaturesQuery,
  useGetBookingFlowSubmitQuery,
  useRequestTrainingProviderSignatureMutation,
  useSaveRegistrationAssessmentMutation,
  useSaveRegistrationEmployerMutation,
  useSaveRegistrationEligibilityMutation,
  useSaveRegistrationPrivacyMutation,
  useSaveRegistrationTrainingMutation,
  useSubmitBookingForReviewMutation,
  useSubmitCandidateSignatureMutation,
  useUploadBookingDocumentMutation,
} from "@/lib/redux/features/bookings/booking-api";
import {
  useGetCourseAssessmentRegistrationFormQuery,
  useGetCourseEmployerRegistrationFormQuery,
  useGetCoursePrivacyRegistrationFormQuery,
  useGetCourseRegistrationFormQuery,
  useGetCourseTrainingRegistrationFormQuery,
  type CourseRegistrationField,
} from "@/lib/redux/features/courses/course-api";

type Am2RegistrationFlowProps = {
  course: CourseSummary;
  bookingId?: string;
};

type RegistrationStepKey =
  | "candidate"
  | "assessment"
  | "employer"
  | "training"
  | "privacy";

type NetStepKey =
  | "documents"
  | "checklist"
  | "signatures"
  | "submit"
  | "review"
  | "payment"
  | "confirmed";

type ReviewStatus = "pending" | "approved";
type PaymentFormState = {
  acceptedTerms: boolean;
  cardNumber: string;
  expiry: string;
  cvc: string;
};
type SignatureTab = "draw" | "upload";
type SignatureSubmissionPayload = Pick<
  SubmitCandidateSignatureRequest,
  "signatureType" | "signature" | "fileName"
>;
type ProviderSignatureRequestState = Omit<
  RequestTrainingProviderSignatureRequest,
  "bookingId" | "trainingProviderEmail" | "trainingProviderName"
> & {
  email: string;
  name: string;
};

type CandidateFormState = {
  title: string;
  firstName: string;
  lastName: string;
  dob: string;
  niNumber: string;
  email: string;
  mobileNumber: string;
  address1: string;
  address2: string;
  town: string;
  postcode: string;
};

type AssessmentFormState = {
  apprentice: string;
  uln: string;
  funding: string;
  awardingBody: string;
  adjustments: string;
  recognition: string;
  assessmentType: string;
};

type EmployerFormState = {
  companyName: string;
  email: string;
  contactName: string;
  contactNumber: string;
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  town: string;
  postcode: string;
};

type TrainingFormState = EmployerFormState;
type NetFlowType = "am2" | "am2e" | "am2e-v1";
type NvqTiming = "before-3rd-september-2023" | "after-september-2023";
type EmployerStatus = "yes" | "no";
type CandidateFieldKey = keyof CandidateFormState;
type AssessmentFieldKey = keyof AssessmentFormState;
type EmployerFieldKey = keyof EmployerFormState;
type TrainingFieldKey = keyof TrainingFormState;

const registrationSteps: Array<{ key: RegistrationStepKey; label: string }> = [
  { key: "candidate", label: "Candidate" },
  { key: "assessment", label: "Assessment" },
  { key: "employer", label: "Employer" },
  { key: "training", label: "Training" },
  { key: "privacy", label: "Privacy" },
];

const candidateFieldIdMap: Record<string, CandidateFieldKey> = {
  title: "title",
  firstName: "firstName",
  lastName: "lastName",
  dateOfBirth: "dob",
  niNumber: "niNumber",
  email: "email",
  mobileNumber: "mobileNumber",
  addressLine1: "address1",
  addressLine2: "address2",
  town: "town",
  postcode: "postcode",
};

const assessmentFieldIdMap: Record<string, AssessmentFieldKey> = {
  apprentice: "apprentice",
  uln: "uln",
  funding: "funding",
  awardingBody: "awardingBody",
  reasonableAdjustments: "adjustments",
  recognitionOfPriorLearning: "recognition",
  assessmentType: "assessmentType",
};

const employerFieldIdMap: Record<string, EmployerFieldKey> = {
  "employer.companyName": "companyName",
  "employer.email": "email",
  "employer.contactName": "contactName",
  "employer.contactNumber": "contactNumber",
  "employer.address1": "address1",
  "employer.address2": "address2",
  "employer.address3": "address3",
  "employer.address4": "address4",
  "employer.town": "town",
  "employer.postcode": "postcode",
};

const trainingFieldIdMap: Record<string, TrainingFieldKey> = {
  "trainingProvider.companyName": "companyName",
  "trainingProvider.email": "email",
  "trainingProvider.contactName": "contactName",
  "trainingProvider.contactNumber": "contactNumber",
  "trainingProvider.address1": "address1",
  "trainingProvider.address2": "address2",
  "trainingProvider.address3": "address3",
  "trainingProvider.address4": "address4",
  "trainingProvider.town": "town",
  "trainingProvider.postcode": "postcode",
};

const netSteps: Array<{ key: NetStepKey; label: string }> = [
  { key: "documents", label: "Documents" },
  { key: "checklist", label: "Checklist" },
  { key: "signatures", label: "Signatures" },
  { key: "submit", label: "Submit" },
  { key: "review", label: "Review" },
  { key: "payment", label: "Payment" },
  { key: "confirmed", label: "Confirmed" },
];

const am2eEligibleQualificationTokens = [
  "ewa-city-and-guilds-2346",
  "city-and-guilds-2346",
  "2346",
  "eal-603-5982-1",
  "603-5982-1",
];

function normalizeQualificationValue(value?: string) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isAm2eEligibleQualification({
  label,
  id,
}: {
  label?: string;
  id?: string;
}) {
  const normalizedValues = [
    normalizeQualificationValue(label),
    normalizeQualificationValue(id),
  ].filter(Boolean);

  return normalizedValues.some((value) =>
    am2eEligibleQualificationTokens.some(
      (token) =>
        value === token ||
        value.includes(token) ||
        token.includes(value)
    )
  );
}

function Stepper<T extends string>({
  steps,
  currentStep,
  activeClassName,
}: {
  steps: Array<{ key: T; label: string }>;
  currentStep: T;
  activeClassName: string;
}) {
  const currentIndex = steps.findIndex((step) => step.key === currentStep);

  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-center gap-3">
        {steps.map((step, index) => {
          const isDone = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <React.Fragment key={step.key}>
              <div className="flex items-center gap-2">
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold ${
                    isDone || isActive
                      ? activeClassName
                      : "bg-[#e6edf8] text-[#8a97b2]"
                  }`}
                >
                  {isDone ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </span>
                <span
                  className={`text-xs font-medium ${
                    isActive || isDone ? "text-[#32439b]" : "text-[#9aa7be]"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 ? (
                <div className="h-px w-16 bg-[#d7e2f2]" />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-xs font-medium text-[#35479f]">
      {children}
    </label>
  );
}

function resolveApiErrorMessage(error: unknown, fallback: string) {
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

function extractBookingIdFromApiUrl(value?: string | null) {
  if (!value) {
    return "";
  }

  const match = value.match(/\/bookings\/([^/]+)/);
  return match?.[1] ?? "";
}

function resolveBookingIdFromBookingPayload(booking: {
  id?: string;
  registration?: {
    endpoints?: {
      eligibility?: { apiUrl?: string };
      privacy?: { apiUrl?: string };
      assessment?: { apiUrl?: string };
      employer?: { apiUrl?: string };
      training?: { apiUrl?: string };
    };
  };
}) {
  return (
    extractBookingIdFromApiUrl(booking.registration?.endpoints?.eligibility?.apiUrl) ||
    extractBookingIdFromApiUrl(booking.registration?.endpoints?.privacy?.apiUrl) ||
    extractBookingIdFromApiUrl(booking.registration?.endpoints?.assessment?.apiUrl) ||
    extractBookingIdFromApiUrl(booking.registration?.endpoints?.employer?.apiUrl) ||
    extractBookingIdFromApiUrl(booking.registration?.endpoints?.training?.apiUrl) ||
    booking.id ||
    ""
  );
}

function resolveBookingIdFromDocumentsScreen(screen: {
  actions?: {
    continue?: { apiUrl?: string } | null;
  };
  requirements: Array<{
    action?: { apiUrl?: string } | null;
  }>;
}) {
  return (
    extractBookingIdFromApiUrl(screen.actions?.continue?.apiUrl) ||
    screen.requirements
      .map((item) => extractBookingIdFromApiUrl(item.action?.apiUrl))
      .find(Boolean) ||
    ""
  );
}

function resolveBookingIdFromChecklistScreen(screen: {
  actions?: {
    openFullChecklist?: { apiUrl?: string } | null;
    continue?: { apiUrl?: string } | null;
  };
}) {
  return (
    extractBookingIdFromApiUrl(screen.actions?.continue?.apiUrl) ||
    extractBookingIdFromApiUrl(screen.actions?.openFullChecklist?.apiUrl) ||
    ""
  );
}

function resolveBookingIdFromSignaturesScreen(screen: {
  actions?: {
    continue?: { apiUrl?: string } | null;
  };
  items: Array<{
    action?: { apiUrl?: string } | null;
  }>;
}) {
  return (
    extractBookingIdFromApiUrl(screen.actions?.continue?.apiUrl) ||
    screen.items
      .map((item) => extractBookingIdFromApiUrl(item.action?.apiUrl))
      .find(Boolean) ||
    ""
  );
}

function resolveBookingIdFromRegistrationScreen(screen?: {
  navigation?: {
    previous?: { apiUrl?: string } | null;
    next?: { apiUrl?: string } | null;
  };
  submission?: {
    apiUrl?: string;
  };
}) {
  if (!screen) {
    return "";
  }

  return (
    extractBookingIdFromApiUrl(screen.submission?.apiUrl) ||
    extractBookingIdFromApiUrl(screen.navigation?.next?.apiUrl) ||
    extractBookingIdFromApiUrl(screen.navigation?.previous?.apiUrl) ||
    ""
  );
}

function normalizeAssessmentValue(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function convertCanvasToFile(canvas: HTMLCanvasElement, fileName: string) {
  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("We could not prepare the drawn signature."));
          return;
        }

        resolve(new File([blob], fileName, { type: "image/png" }));
      },
      "image/png",
      1
    );
  });
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

function formatShortDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function TextField({
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}: {
  icon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      {icon ? (
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8da0bf]">
          {icon}
        </span>
      ) : null}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`h-11 w-full rounded-lg border border-[#dde9f7] pr-4 text-sm text-[#27396b] outline-none transition ${
          disabled
            ? "cursor-not-allowed bg-[#f4f7fb] text-[#94a3b8]"
            : "bg-[#eef7ff] focus:border-[#28aee5] focus:bg-white"
        } ${
          icon ? "pl-11" : "pl-4"
        }`}
      />
    </div>
  );
}

function RadioRow({
  name,
  options,
  value,
  onChange,
  columns = "md:grid-cols-2",
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  columns?: string;
}) {
  return (
    <div className={`grid gap-3 ${columns}`}>
      {options.map((option) => {
        const checked = value === option;

        return (
          <label
            key={option}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${
              checked
                ? "border-[#8ed7f8] bg-[#dff5ff] text-[#24346b]"
                : "border-[#dde9f7] bg-[#f4f9ff] text-[#5f6f90]"
            }`}
          >
            <input
              type="radio"
              name={name}
              checked={checked}
              onChange={() => onChange(option)}
              className="h-4 w-4 accent-[#1ea6df]"
            />
            <span>{option}</span>
          </label>
        );
      })}
    </div>
  );
}

function NetDocumentsPanel({
  screen,
  onUpload,
  onContinue,
  uploadingDocumentId,
  uploadError,
}: {
  screen: {
    title: string;
    subtitle?: string;
    importantInformation?: string;
    requirements: Array<{
      id: string;
      title: string;
      description: string;
      uploaded: boolean;
      document: {
        fileName?: string;
      } | null;
      action?: {
        label?: string;
      } | null;
    }>;
    completion: {
      percentage: number;
    };
    actions?: {
      continue?: {
        label?: string;
        enabled?: boolean;
      } | null;
    };
  };
  onUpload: (id: string, title: string, file: File) => void;
  onContinue: () => void;
  uploadingDocumentId: string | null;
  uploadError: string;
}) {
  const allRequiredUploaded = screen.requirements.every((item) => item.uploaded);

  const acceptedDocumentTypes =
    ".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.rtf,.odt,.ods,.zip,.jpg,.jpeg,.png,.webp";

  const handleFileChange = (
    id: string,
    title: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    onUpload(id, title, file);
    event.target.value = "";
  };

  return (
    <>
      <div>
        <h2 className="inline-flex items-center gap-2 text-[1rem] font-semibold text-[#3849a0]">
          Upload Full Certificate
        </h2>
      </div>

      <div className="mt-5 rounded-[14px] border border-[#d7e5f7] bg-[#eaf5ff] p-4">
        <h3 className="text-sm font-semibold text-[#3850a2]">
          {screen.title}
        </h3>
        {screen.subtitle ? (
          <p className="mt-1 text-xs text-[#6c7f9d]">{screen.subtitle}</p>
        ) : null}

        <div className="mt-4 flex items-center justify-between text-xs text-[#6c7f9d]">
          <span>Overall Completion</span>
          <span>{screen.completion.percentage}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white">
          <div
            className="h-2 rounded-full bg-[#1ea6df] transition-all"
            style={{ width: `${screen.completion.percentage}%` }}
          />
        </div>

        <div className="mt-5 rounded-lg border border-[#f2c463] bg-[#fffaf1] px-4 py-3 text-sm text-[#8f6413]">
          {screen.importantInformation ||
            "You must upload all required documents before proceeding."}
        </div>

        <div className="mt-4 space-y-3">
          {screen.requirements.map((item) => {
            const isUploaded = item.uploaded;
            const isUploading = uploadingDocumentId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-xl border border-[#82cdf4] bg-white px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#334496]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-[#7d8da7]">
                      {item.description}
                    </p>
                    {item.document?.fileName ? (
                      <p className="mt-2 text-xs font-medium text-[#1f8f54]">
                        Selected file: {item.document.fileName}
                      </p>
                    ) : null}
                  </div>

                  <label
                    className={`inline-flex cursor-pointer items-center rounded-lg border px-4 py-2 text-sm font-medium ${
                      isUploaded
                        ? "border-[#ccead8] bg-[#effcf3] text-[#1f8f54]"
                        : "border-[#d9e6f3] bg-[#f5fbff] text-[#4154a6]"
                    }`}
                  >
                    <input
                      type="file"
                      accept={acceptedDocumentTypes}
                      className="hidden"
                      disabled={isUploading}
                      onChange={(event) => handleFileChange(item.id, item.title, event)}
                    />
                    {isUploading
                      ? "Uploading..."
                      : isUploaded
                        ? item.action?.label || "Replace"
                        : item.action?.label || "Upload"}
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        {uploadError ? (
          <div className="mt-4 rounded-lg border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
            {uploadError}
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#dbe7f4] pt-5">
        <button
          type="button"
          disabled={!allRequiredUploaded || screen.actions?.continue?.enabled === false}
          onClick={onContinue}
          className={`rounded-lg px-5 py-2.5 text-sm font-medium text-white ${
            allRequiredUploaded && screen.actions?.continue?.enabled !== false
              ? "bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)] shadow-[0_12px_24px_rgba(30,166,223,0.2)]"
              : "cursor-not-allowed bg-[#dce6ef]"
          }`}
        >
          {screen.actions?.continue?.label || "Continue"}
        </button>
      </div>
    </>
  );
}

function NetChecklistPanel({
  screen,
  fullChecklistHref,
  onContinue,
}: {
  screen: {
    card: {
      title: string;
      subtitle?: string;
    };
    importantInformation?: string;
    overallCompletion: number;
    notice?: string;
    actions?: {
      openFullChecklist?: {
        label?: string;
      } | null;
      continue?: {
        label?: string;
        enabled?: boolean;
      } | null;
    };
  };
  fullChecklistHref: string;
  onContinue: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[1rem] font-semibold text-[#3849a0]">
            {screen.card.title}
          </h2>
          {screen.card.subtitle ? (
            <p className="mt-1 text-xs text-[#7a88a3]">{screen.card.subtitle}</p>
          ) : null}
        </div>
        <button
          type="button"
          className="text-sm font-semibold text-[#4451ac]"
        >
          {screen.importantInformation || "Important Information"}
        </button>
      </div>

      <div className="mt-5 rounded-[14px] border border-[#d7e5f7] bg-[#eaf5ff] p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-[#7a88a3]">Overall Completion</span>
          <span className="text-xs text-[#7a88a3]">{screen.overallCompletion}%</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-white">
          <div
            className="h-2 rounded-full bg-[#1ea6df] transition-all"
            style={{ width: `${screen.overallCompletion}%` }}
          />
        </div>

        <div className="mt-5 rounded-lg border border-[#d5e6f5] bg-[#dff1fd] px-4 py-3 text-sm text-[#46627d]">
          {screen.notice ||
            "Complete all sections of the checklist. You can use the full checklist page for a detailed view."}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px]">
          <Link
            href={fullChecklistHref}
            className="rounded-lg border border-[#d3dfef] bg-white px-4 py-3 text-sm font-medium text-[#2f407f]"
          >
            {screen.actions?.openFullChecklist?.label || "Open Full Checklist"}
          </Link>
          <button
            type="button"
            disabled={screen.actions?.continue?.enabled === false}
            onClick={onContinue}
            className={`rounded-lg px-4 py-3 text-sm font-medium ${
              screen.actions?.continue?.enabled === false
                ? "cursor-not-allowed bg-[#dce4ec] text-[#9eacba]"
                : "bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)] text-white"
            }`}
          >
            {screen.actions?.continue?.label || "Continue"}
          </button>
        </div>
      </div>
    </>
  );
}

function NetSignaturesPanel({
  screen,
  onCandidateSign,
  onProviderRequest,
  onContinue,
}: {
  screen: {
    card: {
      title: string;
      subtitle?: string;
    };
    importantInformation?: string;
    progressLabel?: string;
    items: Array<{
      id: string;
      label: string;
      status: string;
      action?: {
        label?: string;
      } | null;
    }>;
    actions?: {
      continue?: {
        label?: string;
        enabled?: boolean;
      } | null;
    };
  };
  onCandidateSign: () => void;
  onProviderRequest: () => void;
  onContinue: () => void;
}) {
  const candidateItem = screen.items.find((item) => item.id === "candidate");
  const providerItem = screen.items.find(
    (item) => item.id === "training_provider"
  );
  const candidateSigned = candidateItem?.status === "signed";
  const providerSigned = providerItem?.status === "signed";
  const providerRequested = providerItem?.status === "requested";
  // Temporary override so we can continue integration work before the
  // backend enables the step after provider signature completion.
  const allSigned =
    screen.actions?.continue?.enabled !== false ||
    (candidateSigned && (providerSigned || providerRequested));

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[1rem] font-semibold text-[#3849a0]">
            {screen.card.title}
          </h2>
          {screen.card.subtitle ? (
            <p className="mt-1 text-xs text-[#7a88a3]">{screen.card.subtitle}</p>
          ) : null}
        </div>
        <button
          type="button"
          className="text-sm font-semibold text-[#4451ac]"
        >
          {screen.importantInformation || "Important Information"}
        </button>
      </div>

      <div className="mt-5 rounded-[14px] border border-[#d7e5f7] bg-[#eaf5ff] p-4">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-[#d5e6f5] bg-[#f4fbff] px-4 py-3">
          <span className="text-sm text-[#50637f]">
            {screen.progressLabel || "Step 1 of 2"}
          </span>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-[#1ea6df]" />
            <span className="h-4 w-4 rounded-full bg-[#bfeaff]" />
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-[#dbe7f4] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-[#4451ac]">
                  <Signature className="h-4 w-4" />
                  {candidateItem?.label || "Candidate"}
                </p>
                <p
                  className={`mt-3 flex items-center gap-2 text-xs ${
                    candidateSigned ? "text-[#1e9d57]" : "text-[#8b97ac]"
                  }`}
                >
                  {candidateSigned ? (
                    <CircleCheckBig className="h-4 w-4" />
                  ) : (
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-[#ffe8ea] text-[10px] text-[#d55465]">
                      x
                    </span>
                  )}
                  {candidateSigned ? "Signed" : "not Signed"}
                </p>
              </div>

              <button
                type="button"
                onClick={onCandidateSign}
                className="rounded-lg border border-[#d5e2f2] bg-white px-4 py-2 text-xs font-medium text-[#4451ac]"
              >
                {candidateItem?.action?.label ||
                  (candidateSigned ? "View" : "Submit Signature")}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-[#dbe7f4] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-[#4451ac]">
                  <PenTool className="h-4 w-4" />
                  {providerItem?.label || "Training Provider"}
                </p>
                <p
                  className={`mt-3 flex items-center gap-2 text-xs ${
                    providerSigned ? "text-[#1e9d57]" : "text-[#8b97ac]"
                  }`}
                >
                  {providerSigned ? (
                    <CircleCheckBig className="h-4 w-4" />
                  ) : providerRequested ? (
                    <Clock3 className="h-4 w-4" />
                  ) : (
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-[#ffe8ea] text-[10px] text-[#d55465]">
                      x
                    </span>
                  )}
                  {providerSigned
                    ? "Signed"
                    : providerRequested
                      ? "Request sent"
                      : "not Signed"}
                </p>
              </div>

              <button
                type="button"
                onClick={onProviderRequest}
                className="rounded-lg border border-[#d5e2f2] bg-white px-4 py-2 text-xs font-medium text-[#4451ac]"
              >
                {providerItem?.action?.label ||
                  (providerSigned ? "View" : "Ask for signed")}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={onContinue}
            disabled={!allSigned}
            className={`w-full rounded-lg px-4 py-3 text-sm font-medium ${
              allSigned
                ? "bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)] text-white"
                : "cursor-not-allowed bg-[#dce4ec] text-[#9eacba]"
            }`}
          >
            {screen.actions?.continue?.label || "Continue"}
          </button>
        </div>
      </div>
    </>
  );
}

function SignatureUploadModal({
  open,
  title,
  onClose,
  onSubmit,
  isSubmitting = false,
}: {
  open: boolean;
  title?: string;
  onClose: () => void;
  onSubmit: (payload: SignatureSubmissionPayload) => Promise<void> | void;
  isSubmitting?: boolean;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = React.useRef(false);
  const [activeTab, setActiveTab] = React.useState<SignatureTab>("draw");
  const [hasDrawn, setHasDrawn] = React.useState(false);
  const [uploadedFileName, setUploadedFileName] = React.useState("");
  const [uploadedPreview, setUploadedPreview] = React.useState("");
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [uploadValidationError, setUploadValidationError] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#2f3fa0";
    context.lineWidth = 2;
    context.lineCap = "round";
    context.lineJoin = "round";
    setActiveTab("draw");
    setHasDrawn(false);
    setUploadedFileName("");
    setUploadedPreview("");
    setUploadedFile(null);
    setUploadValidationError("");
  }, [open]);

  React.useEffect(() => {
    return () => {
      if (uploadedPreview) {
        URL.revokeObjectURL(uploadedPreview);
      }
    };
  }, [uploadedPreview]);

  if (!open) {
    return null;
  }

  const getCoordinates = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    return {
      x: ((event.clientX - rect.left) / rect.width) * event.currentTarget.width,
      y:
        ((event.clientY - rect.top) / rect.height) * event.currentTarget.height,
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    const { x, y } = getCoordinates(event);

    isDrawingRef.current = true;
    context.beginPath();
    context.moveTo(x, y);
    setHasDrawn(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    const { x, y } = getCoordinates(event);
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearDrawing = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleUploadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const acceptedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
    ]);

    if (!acceptedTypes.has(file.type)) {
      setUploadedFile(null);
      setUploadedFileName("");
      setUploadValidationError(
        "Only JPG, JPEG, PNG, and WEBP files are accepted."
      );
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadedFile(null);
      setUploadedFileName("");
      setUploadValidationError("Signature image must be 5MB or smaller.");
      event.target.value = "";
      return;
    }

    if (uploadedPreview) {
      URL.revokeObjectURL(uploadedPreview);
    }

    setUploadValidationError("");
    setUploadedFile(file);
    setUploadedFileName(file.name);
    setUploadedPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (activeTab === "draw") {
      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      await onSubmit({
        signatureType: "draw",
        signature: await convertCanvasToFile(canvas, "candidate-signature.png"),
        fileName: "candidate-signature.png",
      });
      return;
    }

    if (!uploadedFile) {
      return;
    }

    await onSubmit({
      signatureType: "upload",
      signature: uploadedFile,
      fileName: uploadedFile.name,
    });
  };

  const canSubmit =
    activeTab === "draw"
      ? hasDrawn
      : uploadedFileName.trim().length > 0 && !uploadValidationError;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-[#1f2937]/70" onClick={onClose} />
      <div className="fixed inset-0 z-[60] grid place-items-center p-4">
        <div className="w-full max-w-[820px] rounded-[18px] border border-[#dbe7f4] bg-white p-4 shadow-[0_26px_80px_rgba(18,33,77,0.35)]">
          <div className="flex items-center justify-between gap-4 px-2 pb-3">
            <div className="flex items-center gap-2 text-lg font-medium text-[#3849a0]">
              <Signature className="h-4.5 w-4.5" />
              <span>{title || "Upload your signature"}</span>
            </div>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-full p-2 text-[#4451ac] transition hover:bg-[#eef5ff]"
              >
                <X className="h-5 w-5" />
            </button>
          </div>

          <div className="rounded-[18px] border border-[#e1ebf7] bg-[#f8fbff] p-3">
            <div className="grid grid-cols-2 rounded-[14px] bg-[#e8f1fa] p-1">
              <button
                type="button"
                onClick={() => setActiveTab("draw")}
                className={`rounded-[10px] px-4 py-3 text-base font-medium transition ${
                  activeTab === "draw"
                    ? "bg-white text-[#32439b] shadow-sm"
                    : "text-[#50637f]"
                }`}
              >
                Draw
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`rounded-[10px] px-4 py-3 text-base font-medium transition ${
                  activeTab === "upload"
                    ? "bg-white text-[#1f2f67] shadow-sm"
                    : "text-[#50637f]"
                }`}
              >
                Upload
              </button>
            </div>

            {activeTab === "draw" ? (
              <div className="mt-3">
                <div className="grid min-h-[300px] rounded-[16px] border border-[#dde9f7] bg-white">
                  <canvas
                    ref={canvasRef}
                    width={760}
                    height={300}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={stopDrawing}
                    onPointerLeave={stopDrawing}
                    className="h-[300px] w-full cursor-crosshair rounded-[16px]"
                  />
                  {!hasDrawn ? (
                    <div className="pointer-events-none -mt-[180px] text-center text-[2rem] font-medium text-[#32439b]">
                      Sign here
                    </div>
                  ) : null}
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={clearDrawing}
                    className="rounded-lg border border-[#d8e5f4] bg-white px-4 py-2 text-sm font-medium text-[#384a77]"
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3 rounded-[16px] border border-[#dde9f7] bg-white p-4">
                <div className="rounded-[14px] border border-[#e7eef7] bg-[#fbfdff] p-4">
                  <div className="flex items-center gap-4">
                    <div className="grid h-20 w-20 place-items-center rounded-xl bg-[#eef2f7] text-[#a0aec0]">
                      {uploadedPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={uploadedPreview}
                          alt="Uploaded signature preview"
                          className="h-16 w-16 rounded object-cover"
                        />
                      ) : (
                        <Upload className="h-8 w-8" />
                      )}
                    </div>
                    <div className="flex-1">
                       <p className="text-[1.1rem] font-medium text-[#32439b]">
                         Only JPG, JPEG, PNG, and WEBP are accepted, up to 5MB
                       </p>
                      <div className="mt-4 flex flex-wrap items-center gap-5">
                        <label className="inline-flex cursor-pointer items-center rounded-xl border border-[#d8e5f4] bg-white px-6 py-3 text-base font-medium text-[#4451ac]">
                          Re upload
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            disabled={isSubmitting}
                            onChange={handleUploadChange}
                          />
                        </label>
                        <span className="text-base text-[#5d6f92]">
                          {uploadedFileName || "file...name.jpg"}
                        </span>
                      </div>
                      {uploadValidationError ? (
                        <p className="mt-3 text-sm text-[#dc2626]">
                          {uploadValidationError}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )}

              <button
                type="button"
                disabled={!canSubmit || isSubmitting}
                onClick={() => void handleSubmit()}
                className={`mt-4 w-full rounded-lg px-4 py-3 text-base font-semibold ${
                  canSubmit && !isSubmitting
                    ? "bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)] text-white"
                    : "cursor-not-allowed bg-[#dce4ec] text-[#9eacba]"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Signature"}
              </button>
            </div>
          </div>
        </div>
    </>
  );
}

function AskForSignedModal({
  open,
  value,
  onChange,
  onClose,
  onSubmit,
  isSubmitting = false,
}: {
  open: boolean;
  value: ProviderSignatureRequestState;
  onChange: (field: keyof ProviderSignatureRequestState, value: string) => void;
  onClose: () => void;
  onSubmit: () => Promise<void> | void;
  isSubmitting?: boolean;
}) {
  if (!open) {
    return null;
  }

  const isValid =
    value.email.trim() !== "" &&
    value.subject.trim() !== "" &&
    value.message.trim() !== "";

  return (
    <>
      <div className="fixed inset-0 z-50 bg-[#1f2937]/70" onClick={onClose} />
      <div className="fixed inset-0 z-[60] grid place-items-center p-4">
        <div className="w-full max-w-[460px] rounded-[18px] border border-[#dbe7f4] bg-white p-4 shadow-[0_26px_80px_rgba(18,33,77,0.35)]">
          <div className="pb-3 text-lg font-medium text-[#5f6f90]">
            Ask for signed
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#3849a0]">
                Training Provider Email <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="email"
                value={value.email}
                onChange={(event) => onChange("email", event.target.value)}
                placeholder="Enter last name"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl border border-[#d7e5f7] bg-[#eef7ff] px-4 text-base text-[#32439b] outline-none focus:border-[#1ea6df] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3849a0]">
                Training Provider Name (Optional)
              </label>
              <input
                type="text"
                value={value.name}
                onChange={(event) => onChange("name", event.target.value)}
                placeholder="Enter last name"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl border border-[#d7e5f7] bg-[#eef7ff] px-4 text-base text-[#32439b] outline-none focus:border-[#1ea6df] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3849a0]">
                Subject <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                value={value.subject}
                onChange={(event) => onChange("subject", event.target.value)}
                placeholder="Enter last name"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl border border-[#d7e5f7] bg-[#eef7ff] px-4 text-base text-[#32439b] outline-none focus:border-[#1ea6df] focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#3849a0]">
                Message <span className="text-[#ef4444]">*</span>
              </label>
              <textarea
                value={value.message}
                onChange={(event) => onChange("message", event.target.value)}
                rows={9}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-[#d7e5f7] bg-[#eef7ff] px-4 py-4 text-base leading-8 text-[#32439b] outline-none focus:border-[#1ea6df] focus:bg-white"
              />
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-xl border border-[#d8e5f4] bg-white px-6 py-3 text-base font-semibold text-[#384a77]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!isValid || isSubmitting}
                onClick={() => void onSubmit()}
                className={`rounded-xl px-6 py-3 text-base font-semibold ${
                  isValid && !isSubmitting
                    ? "bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)] text-white"
                    : "cursor-not-allowed bg-[#dce4ec] text-[#9eacba]"
                }`}
              >
                {isSubmitting ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function NetSubmitPanelContent({
  screen,
}: {
  screen: GetBookingFlowSubmitResponse["data"]["screen"];
}) {
  const resolveSectionTone = (status: string) => {
    if (status === "completed" || status === "signed") {
      return {
        iconClassName: "bg-[#e8f8ee] text-[#16a34a]",
        badgeClassName: "bg-[#dcfce7] text-[#16a34a]",
        label: status === "signed" ? "Signed" : "Completed",
      };
    }

    return {
      iconClassName: "bg-[#fff7df] text-[#9f6a00]",
      badgeClassName: "bg-[#fff7df] text-[#9f6a00]",
      label: "Pending",
    };
  };

  return (
    <>
      <div>
        <h2 className="text-[1rem] font-semibold text-[#3849a0]">
          {screen.title}
        </h2>
        {screen.subtitle ? (
          <p className="mt-1 text-xs text-[#7a88a3]">{screen.subtitle}</p>
        ) : null}
      </div>

      <div className="mt-5 rounded-[14px] border border-[#d7e5f7] bg-[#eaf5ff] p-4">
        <div className="rounded-lg border border-[#f2c463] bg-[#fffaf1] px-4 py-3 text-sm text-[#8f6413]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#f59e0b]" />
            <p>{screen.notice}</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {screen.sections.map((item) => {
            const tone = resolveSectionTone(item.status);

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#dbe7f4] bg-white px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-xl ${tone.iconClassName}`}
                  >
                    <FileText className="h-4.5 w-4.5" />
                  </span>
                  <p className="text-sm font-medium text-[#32439b]">{item.label}</p>
                </div>

                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${tone.badgeClassName}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {tone.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function NetReviewPanel({
  reviewStatus,
  reviewScreen,
}: {
  reviewStatus: ReviewStatus;
  reviewScreen?: SubmitBookingForReviewResponse["data"]["screen"] | null;
}) {
  const backendApproved = reviewScreen?.status?.key === "approved";
  const isApproved = backendApproved || reviewStatus === "approved";
  const badgeLabel =
    reviewScreen?.stateCard?.badge ||
    reviewScreen?.status?.label ||
    (isApproved ? "Approved" : "Under Review");
  const title =
    reviewScreen?.stateCard?.title || (isApproved ? "Application Approved!" : "Under Review");
  const description =
    reviewScreen?.stateCard?.description ||
    (isApproved
      ? "The admin has reviewed and approved your documents, checklist, and signatures. You can now proceed to payment."
      : "Admin is currently reviewing your application. You'll be notified once it has been approved.");

  return (
    <>
      <div>
        <h2 className="text-[1rem] font-semibold text-[#3849a0]">
          {reviewScreen?.title || "Admin Review"}
        </h2>
        <p className="mt-1 text-xs text-[#7a88a3]">
          {reviewScreen?.subtitle || "Your application is being reviewed by the admin team."}
        </p>
      </div>

      <div className="mt-5 rounded-[14px] border border-[#d7e5f7] bg-[#eaf5ff] p-4">
        <div className="rounded-lg border border-[#f2c463] bg-[#fffaf1] px-4 py-3 text-sm text-[#8f6413]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#f59e0b]" />
            <p>
              {reviewScreen?.notice ||
                "Once submitted, the admin will review your documents, checklist, and signatures. You'll be notified when your application is approved and you can proceed to payment."}
            </p>
          </div>
        </div>

        <div className="grid min-h-[220px] place-items-center rounded-xl border border-[#dbe7f4] bg-white px-6 py-10">
          <div className="text-center">
            <span
              className={`mx-auto grid h-11 w-11 place-items-center rounded-full ${
                isApproved
                  ? "bg-[#e8f8ee] text-[#16a34a]"
                  : "bg-[#eef2ff] text-[#4451ac]"
              }`}
            >
              {isApproved ? (
                <BadgeCheck className="h-5 w-5" />
              ) : (
                <Clock3 className="h-5 w-5" />
              )}
            </span>

            <p
              className={`mt-5 text-2xl font-semibold ${
                isApproved ? "text-[#16a34a]" : "text-[#32439b]"
              }`}
            >
              {title}
            </p>
            <p className="mt-3 max-w-[540px] text-sm leading-6 text-[#7a88a3]">
              {description}
            </p>
            <span
              className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                isApproved
                  ? "bg-[#dcfce7] text-[#16a34a]"
                  : "bg-[#e0f2fe] text-[#0284c7]"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {badgeLabel}
            </span>
            {reviewScreen?.notes ? (
              <p className="mt-4 max-w-[540px] text-xs leading-5 text-[#8a97b2]">
                {reviewScreen.notes}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function NetPaymentPanelLegacy() {
  return (
    <>
      <div>
        <h2 className="text-[1rem] font-semibold text-[#3849a0]">
          Payment
        </h2>
        <p className="mt-1 text-xs text-[#7a88a3]">
          Complete payment to confirm your AM2 application.
        </p>
      </div>

      <div className="mt-5 rounded-[14px] border border-[#d7e5f7] bg-[#eaf5ff] p-4">
        <div className="rounded-lg border border-[#b7efc9] bg-[#e9fbe9] px-4 py-3 text-sm text-[#16803c]">
          <div className="flex items-center gap-3">
            <BadgeCheck className="h-4 w-4 shrink-0" />
            <p>
              Admin approved your documents, checklist, and signatures have
              been verified.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-[linear-gradient(180deg,#bfe8fb_0%,#b5e0f6_100%)] px-5 py-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[1.8rem] font-semibold text-[#32439b]">
                Normal Courses
              </p>
              <p className="mt-1 text-sm text-[#5d6f92]">Billed monthly</p>
            </div>
            <p className="text-[1.9rem] font-semibold text-[#32439b]">£44/mo</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-[linear-gradient(180deg,#bfe8fb_0%,#b5e0f6_100%)] px-5 py-4">
          <label className="flex items-start gap-3 text-sm leading-6 text-[#32439b]">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 rounded border-[#9bb8d1] accent-[#1ea6df]"
              checked={false}
              readOnly
            />
            <span>
              I agree to the <span className="font-medium text-[#0f76c5]">Terms and Conditions</span> and{" "}
              <span className="font-medium text-[#0f76c5]">Privacy Policy</span>, and
              consent to share my information with the training provider.
            </span>
          </label>
        </div>

        <div className="mt-6 rounded-[18px] border border-[#dbe7f4] bg-white px-5 py-5">
          <div className="rounded-lg border border-[#b7efc9] bg-[#e9fbe9] px-4 py-3 text-sm text-[#16803c]">
            <div className="flex items-center gap-3">
              <Lock className="h-4 w-4 shrink-0" />
              <p>Secure encrypted payment</p>
            </div>
          </div>

          <p className="mt-4 text-lg font-semibold text-[#1f2f67]">Pay by card</p>

          <div className="mt-4 space-y-4">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#96a3b8]">
                <CreditCard className="h-4 w-4" />
              </span>
              <input
                type="text"
                readOnly
                value=""
                placeholder="Card number"
                className="h-11 w-full rounded-lg border border-[#dde9f7] bg-[#f7fbff] pl-11 pr-4 text-sm text-[#27396b] outline-none"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                readOnly
                value=""
                placeholder="MM / YY"
                className="h-11 w-full rounded-lg border border-[#dde9f7] bg-[#f7fbff] px-4 text-sm text-[#27396b] outline-none"
              />
              <input
                type="text"
                readOnly
                value=""
                placeholder="CVC"
                className="h-11 w-full rounded-lg border border-[#dde9f7] bg-[#f7fbff] px-4 text-sm text-[#27396b] outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </>
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

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

function buildBookingReference() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const tail = String(now.getHours() * 100 + now.getMinutes()).padStart(4, "0");

  return `#AM2-${yyyy}${mm}${dd}-${tail}`;
}

function formatAssignedDate() {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function normalizeCurrency(value: string) {
  return value.replace(/Â£/g, "£");
}

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

function NetPaymentPanel({
  screen,
  payment,
  onUpdatePayment,
  submitError,
  isSubmitting,
}: {
  screen: GetBookingCheckoutPaymentResponse["data"]["screen"];
  payment: PaymentFormState;
  onUpdatePayment: (
    field: keyof PaymentFormState,
    value: string | boolean
  ) => void;
  submitError?: string;
  isSubmitting?: boolean;
}) {
  const isStripeTestMode = screen.stripe?.enabled === false;

  return (
    <>
      <div>
        <h2 className="text-[1rem] font-semibold text-[#3849a0]">
          Complete Payment
        </h2>
        <p className="mt-1 text-xs text-[#7a88a3]">
          {screen.description || "Your application is approved. Complete payment to secure your place."}
        </p>
      </div>

      <div className="mt-5 rounded-[14px] border border-[#d7e5f7] bg-[#eaf5ff] p-4">
        <div className="rounded-lg border border-[#b7efc9] bg-[#e9fbe9] px-4 py-3 text-sm text-[#16803c]">
          <div className="flex items-center gap-3">
            <BadgeCheck className="h-4 w-4 shrink-0" />
            <p>
              Admin approved your documents, checklist, and signatures have
              been verified.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-[linear-gradient(180deg,#bfe8fb_0%,#b5e0f6_100%)] px-5 py-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[1.8rem] font-semibold text-[#32439b]">
                {screen.summary.title}
              </p>
              <p className="mt-1 text-sm text-[#5d6f92]">{screen.summary.subtitle}</p>
            </div>
            <p className="text-[1.9rem] font-semibold text-[#32439b]">
              {screen.summary.displayAmount}
            </p>
          </div>
        </div>

        {screen.terms ? (
          <div className="mt-4 rounded-xl bg-[linear-gradient(180deg,#bfe8fb_0%,#b5e0f6_100%)] px-5 py-4">
            <label className="flex items-start gap-3 text-sm leading-6 text-[#32439b]">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 rounded border-[#9bb8d1] accent-[#1ea6df]"
                checked={payment.acceptedTerms}
                onChange={(event) =>
                  onUpdatePayment("acceptedTerms", event.target.checked)
                }
              />
              <span>{screen.terms.checkboxLabel}</span>
            </label>
          </div>
        ) : null}

        <div className="mt-6 rounded-[18px] border border-[#dbe7f4] bg-white px-5 py-5">
          <div className="rounded-lg border border-[#b7efc9] bg-[#e9fbe9] px-4 py-3 text-sm text-[#16803c]">
            <div className="flex items-center gap-3">
              <Lock className="h-4 w-4 shrink-0" />
              <p>Secure encrypted payment</p>
            </div>
          </div>

          <p className="mt-4 text-lg font-semibold text-[#1f2f67]">Pay by card</p>

          {isStripeTestMode ? (
            <div className="mt-4 rounded-lg border border-[#fde68a] bg-[#fff8db] px-4 py-3 text-sm text-[#9a6700]">
              Test mode is active right now. Use
              <span className="font-semibold"> 4242 4242 4242 4242</span> for success or
              <span className="font-semibold"> 4000 0000 0000 0002</span> to simulate a failed
              payment.
            </div>
          ) : null}

          <div className="mt-4 space-y-4">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#96a3b8]">
                <CreditCard className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={payment.cardNumber}
                onChange={(event) =>
                  onUpdatePayment("cardNumber", formatCardNumber(event.target.value))
                }
                placeholder="Card number"
                className="h-11 w-full rounded-lg border border-[#dde9f7] bg-[#f7fbff] pl-11 pr-4 text-sm text-[#27396b] outline-none transition focus:border-[#28aee5] focus:bg-white"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                value={payment.expiry}
                onChange={(event) =>
                  onUpdatePayment("expiry", formatExpiry(event.target.value))
                }
                placeholder="MM / YY"
                className="h-11 w-full rounded-lg border border-[#dde9f7] bg-[#f7fbff] px-4 text-sm text-[#27396b] outline-none transition focus:border-[#28aee5] focus:bg-white"
              />
              <input
                type="text"
                value={payment.cvc}
                onChange={(event) =>
                  onUpdatePayment(
                    "cvc",
                    event.target.value.replace(/\D/g, "").slice(0, 4)
                  )
                }
                placeholder="CVC"
                className="h-11 w-full rounded-lg border border-[#dde9f7] bg-[#f7fbff] px-4 text-sm text-[#27396b] outline-none transition focus:border-[#28aee5] focus:bg-white"
              />
            </div>
          </div>

          {submitError ? (
            <div className="mt-4 rounded-lg border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
              {submitError}
            </div>
          ) : null}

          {isSubmitting ? (
            <p className="mt-4 text-sm text-[#5f6f90]">Preparing payment...</p>
          ) : null}
        </div>
      </div>
    </>
  );
}

function NetConfirmedPanel({ course }: { course: CourseSummary }) {
  const bookingReference = buildBookingReference();
  const assignedDate = formatAssignedDate();

  return (
    <>
      <div>
        <h2 className="text-[1rem] font-semibold text-[#3849a0]">
          Confirmation
        </h2>
        <p className="mt-1 text-xs text-[#7a88a3]">
          Your AM2 application is fully completed.
        </p>
      </div>

      <div className="mt-5 rounded-[14px] border border-[#d7e5f7] bg-[#eaf5ff] p-4">
        <div className="grid min-h-[220px] place-items-center rounded-xl border border-[#dbe7f4] bg-white px-6 py-10">
          <div className="text-center">
            <span className="mx-auto grid h-18 w-18 place-items-center rounded-full bg-[#e8f8ee] text-[#16a34a]">
              <PartyPopper className="h-8 w-8" />
            </span>
            <p className="mt-5 text-[2.2rem] font-semibold text-[#1f2f67]">
              Booking Confirmed!
            </p>
            <p className="mt-3 max-w-[520px] text-sm leading-6 text-[#7a88a3]">
              Your payment was successful and your place is secured.
            </p>

            <div className="mt-6 w-full max-w-[540px] overflow-hidden rounded-2xl border border-[#dbe7f4] bg-[#fbfdff] text-left">
              {[
                ["Course", course.title],
                ["Assigned Date", assignedDate],
                ["Time", course.schedule],
                ["Location", course.location],
                ["Amount Paid", normalizeCurrency(course.price)],
                ["Reference", bookingReference],
              ].map(([label, value], index) => (
                <div
                  key={label}
                  className={`grid grid-cols-[150px_minmax(0,1fr)] gap-4 px-4 py-3 text-sm ${
                    index === 4 ? "border-t border-[#e7eef7]" : ""
                  }`}
                >
                  <span className="text-[#6d7d97]">{label}</span>
                  <span
                    className={`text-right font-medium ${
                      label === "Amount Paid"
                        ? "text-[#2563eb]"
                        : label === "Reference"
                          ? "text-[#ef4444]"
                          : "text-[#1f2f67]"
                    }`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function NvqRegistrationDateModal({
  open,
  value,
  onChange,
  onClose,
  onContinue,
  isSubmitting = false,
}: {
  open: boolean;
  value: NvqTiming;
  onChange: (value: NvqTiming) => void;
  onClose: () => void;
  onContinue: () => void;
  isSubmitting?: boolean;
}) {
  if (!open) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-[#12214d]/36"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-60 grid place-items-center px-4">
        <div className="w-full max-w-[760px] rounded-[24px] border border-[#d8e7f8] bg-white p-6 shadow-[0_30px_80px_rgba(18,33,77,0.24)]">
          <h2 className="text-[2rem] font-semibold text-[#3546a5]">
            NVQ Registration Date
          </h2>

          <div className="mt-6 rounded-[20px] border border-[#dbe7f5] bg-[#f8fbff] p-5">
            <div className="rounded-[18px] border border-[#20b2ee] p-5">
              <p className="text-[1.15rem] font-medium text-[#3646a5]">
                When did you register for your NVQ?
              </p>
              <p className="mt-4 text-sm font-medium text-[#7a88a7]">Ans:</p>

              <div className="mt-4 space-y-4">
                {[
                  {
                    key: "before-3rd-september-2023" as const,
                    label: "Before 3rd September 2023",
                  },
                  {
                    key: "after-september-2023" as const,
                    label: "After September 2023",
                  },
                ].map((option) => (
                  <label
                    key={option.key}
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border px-4 py-4 text-lg ${
                      value === option.key
                        ? "border-[#b9e7ff] bg-[#fcfeff] text-[#3346a5]"
                        : "border-[#d9e7f5] bg-white text-[#44577e]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="nvq-registration-date"
                      checked={value === option.key}
                      onChange={() => onChange(option.key)}
                      className="h-5 w-5 accent-[#1ea6df]"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className={`rounded-xl border border-[#d8e5f4] px-8 py-3 text-base font-medium text-[#384a77] ${
                isSubmitting ? "cursor-not-allowed bg-[#f5f8fd] opacity-70" : "bg-white"
              }`}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onContinue}
              className={`rounded-xl px-8 py-3 text-base font-medium text-white shadow-[0_12px_24px_rgba(30,166,223,0.2)] ${
                isSubmitting
                  ? "cursor-not-allowed bg-[#a6dff6]"
                  : "bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)]"
              }`}
            >
              {isSubmitting ? "Saving..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Am2RegistrationFlow({
  course,
  bookingId,
}: Am2RegistrationFlowProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [createNormalBooking, { isLoading: isCreatingBooking }] =
    useCreateNormalBookingMutation();
  const [submitBookingForReview, { isLoading: isSubmittingBookingForReview }] =
    useSubmitBookingForReviewMutation();
  const [createPaymentIntent, { isLoading: isCreatingPaymentIntent }] =
    useCreateBookingPaymentIntentMutation();
  const [completePayment, { isLoading: isCompletingPayment }] =
    useCompleteBookingPaymentMutation();
  const [saveRegistrationEligibility, { isLoading: isSavingEligibility }] =
    useSaveRegistrationEligibilityMutation();
  const [saveRegistrationAssessment, { isLoading: isSavingAssessment }] =
    useSaveRegistrationAssessmentMutation();
  const [saveRegistrationEmployer, { isLoading: isSavingEmployer }] =
    useSaveRegistrationEmployerMutation();
  const [saveRegistrationTraining, { isLoading: isSavingTraining }] =
    useSaveRegistrationTrainingMutation();
  const [saveRegistrationPrivacy, { isLoading: isSavingPrivacy }] =
    useSaveRegistrationPrivacyMutation();
  const [uploadBookingDocument] = useUploadBookingDocumentMutation();
  const [submitCandidateSignature, { isLoading: isSubmittingCandidateSignature }] =
    useSubmitCandidateSignatureMutation();
  const [
    getAm2eChecklistFlowByCourse,
    { isFetching: isFetchingAm2eChecklistFlow },
  ] = useLazyGetAm2eChecklistFlowByCourseQuery();
  const [
    requestTrainingProviderSignature,
    { isLoading: isRequestingTrainingProviderSignature },
  ] = useRequestTrainingProviderSignatureMutation();
  const {
    data: registrationFormData,
    isLoading: isRegistrationFormLoading,
    isError: isRegistrationFormError,
    error: registrationFormError,
  } = useGetCourseRegistrationFormQuery(course.slug);
  const {
    data: assessmentFormData,
    isLoading: isAssessmentFormLoading,
    isError: isAssessmentFormError,
    error: assessmentFormError,
  } = useGetCourseAssessmentRegistrationFormQuery(course.slug);
  const {
    data: employerFormData,
    isLoading: isEmployerFormLoading,
    isError: isEmployerFormError,
    error: employerFormError,
  } = useGetCourseEmployerRegistrationFormQuery(course.slug);
  const {
    data: trainingFormData,
    isLoading: isTrainingFormLoading,
    isError: isTrainingFormError,
    error: trainingFormError,
  } = useGetCourseTrainingRegistrationFormQuery(course.slug);
  const {
    data: privacyFormData,
    isLoading: isPrivacyFormLoading,
    isError: isPrivacyFormError,
    error: privacyFormError,
  } = useGetCoursePrivacyRegistrationFormQuery(course.slug);
  const [phase, setPhase] = React.useState<"registration" | "net">(
    "registration"
  );
  const [currentStep, setCurrentStep] =
    React.useState<RegistrationStepKey>("candidate");
  const [currentNetStep, setCurrentNetStep] =
    React.useState<NetStepKey>("documents");
  const [netFlowType, setNetFlowType] = React.useState<NetFlowType>("am2");
  const [candidate, setCandidate] = React.useState<CandidateFormState>({
    title: "",
    firstName: "",
    lastName: "",
    dob: "",
    niNumber: "",
    email: "",
    mobileNumber: "",
    address1: "",
    address2: "",
    town: "",
    postcode: "",
  });
  const [assessment, setAssessment] = React.useState<AssessmentFormState>({
    apprentice: "",
    uln: "",
    funding: "",
    awardingBody: "",
    adjustments: "",
    recognition: "",
    assessmentType: "",
  });
  const [employer, setEmployer] = React.useState<EmployerFormState>({
    companyName: "",
    email: "",
    contactName: "",
    contactNumber: "",
    address1: "",
    address2: "",
    address3: "",
    address4: "",
    town: "",
    postcode: "",
  });
  const [hasEmployer, setHasEmployer] = React.useState<EmployerStatus>("yes");
  const [candidateStepError, setCandidateStepError] = React.useState("");
  const [assessmentStepError, setAssessmentStepError] = React.useState("");
  const [employerStepError, setEmployerStepError] = React.useState("");
  const [trainingStepError, setTrainingStepError] = React.useState("");
  const [eligibilityStepError, setEligibilityStepError] = React.useState("");
  const [training, setTraining] = React.useState<TrainingFormState>({
    companyName: "",
    email: "",
    contactName: "",
    contactNumber: "",
    address1: "",
    address2: "",
    address3: "",
    address4: "",
    town: "",
    postcode: "",
  });
  const [privacyConfirmed, setPrivacyConfirmed] = React.useState(false);
  const [nvqModalOpen, setNvqModalOpen] = React.useState(false);
  const [nvqTiming, setNvqTiming] =
    React.useState<NvqTiming>("before-3rd-september-2023");
  const [signatureModalOpen, setSignatureModalOpen] = React.useState(false);
  const [providerRequestModalOpen, setProviderRequestModalOpen] =
    React.useState(false);
  const [activeBookingId, setActiveBookingId] = React.useState(
    () => searchParams.get("bookingId") ?? bookingId ?? ""
  );
  const [uploadingDocumentId, setUploadingDocumentId] = React.useState<string | null>(null);
  const [documentUploadError, setDocumentUploadError] = React.useState("");
  const [candidateSignatureError, setCandidateSignatureError] = React.useState("");
  const [candidateSignatureMessage, setCandidateSignatureMessage] = React.useState("");
  const [providerSignatureRequestError, setProviderSignatureRequestError] =
    React.useState("");
  const [providerSignatureRequestMessage, setProviderSignatureRequestMessage] =
    React.useState("");
  const [providerSignatureRequest, setProviderSignatureRequest] =
    React.useState<ProviderSignatureRequestState>({
      email: "",
      name: "",
      subject: "Signature request for AM2 registration",
      message: `Hello,

I have completed my registration form and require your signature as my training provider to finalize the process.

Please review my details and provide your signature.

Thank you,`,
    });
  const [reviewStatus, setReviewStatus] =
    React.useState<ReviewStatus>("pending");
  const [paymentStepError, setPaymentStepError] = React.useState("");
  const [reviewScreen, setReviewScreen] = React.useState<
    SubmitBookingForReviewResponse["data"]["screen"] | null
  >(null);
  const [payment, setPayment] = React.useState<PaymentFormState>({
    acceptedTerms: false,
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const selectedQualification = searchParams.get("qualification") ?? "";
  const selectedQualificationIdParam = searchParams.get("qualificationId") ?? "";
  const requestedFlow = searchParams.get("flow");
  const requestedNetStep = searchParams.get("netStep");
  const requestedReviewStatus = searchParams.get("reviewStatus");
  const isAm2eQualification = isAm2eEligibleQualification({
    label: selectedQualification,
    id: selectedQualificationIdParam,
  });
  const lockedAssessmentType = isAm2eQualification ? "AM2E" : "";
  const registrationScreen = registrationFormData?.data.screen;
  const assessmentRegistrationScreen = assessmentFormData?.data.screen;
  const employerRegistrationScreen = employerFormData?.data.screen;
  const trainingRegistrationScreen = trainingFormData?.data.screen;
  const privacyRegistrationScreen = privacyFormData?.data.screen;
  const activeRegistrationScreen =
    currentStep === "assessment" && assessmentRegistrationScreen
      ? assessmentRegistrationScreen
      : currentStep === "employer" && employerRegistrationScreen
        ? employerRegistrationScreen
        : currentStep === "training" && trainingRegistrationScreen
          ? trainingRegistrationScreen
          : currentStep === "privacy" && privacyRegistrationScreen
            ? privacyRegistrationScreen
            : registrationScreen;
  const registrationStepItems =
    activeRegistrationScreen?.steps
      ?.map((step) => {
        if (
          step.id === "candidate" ||
          step.id === "assessment" ||
          step.id === "employer" ||
          step.id === "training" ||
          step.id === "privacy"
        ) {
          return { key: step.id, label: step.label };
        }

        return null;
      })
      .filter((step): step is { key: RegistrationStepKey; label: string } => step !== null) ??
    registrationSteps;
  const currentRegistrationSteps =
    registrationStepItems.length > 0 ? registrationStepItems : registrationSteps;
  const candidateSection =
    registrationScreen?.sections.find((section) => section.id === "candidate-details") ??
    registrationScreen?.sections[0];
  const candidateFields = candidateSection?.fields ?? [];
  const assessmentSection =
    assessmentRegistrationScreen?.sections.find(
      (section) => section.id === "assessment-details"
    ) ?? assessmentRegistrationScreen?.sections[0];
  const assessmentFields = assessmentSection?.fields ?? [];
  const employerSection =
    employerRegistrationScreen?.sections.find(
      (section) => section.id === "employer-details"
    ) ?? employerRegistrationScreen?.sections[0];
  const employerFields = employerSection?.fields ?? [];
  const trainingSection =
    trainingRegistrationScreen?.sections.find(
      (section) => section.id === "training-provider-details"
    ) ?? trainingRegistrationScreen?.sections[0];
  const trainingFields = trainingSection?.fields ?? [];
  const privacySection =
    privacyRegistrationScreen?.sections.find(
      (section) => section.id === "privacy-confirmation"
    ) ?? privacyRegistrationScreen?.sections[0];
  const privacyConfirmationField = privacySection?.fields.find(
    (field) => field.id === "privacyConfirmation"
  );
  const registrationContinueLabel =
    activeRegistrationScreen?.submission?.continueLabel ??
    activeRegistrationScreen?.navigation?.next?.label ??
    "Continue";

  const resolvedBookingId = activeBookingId;
  const {
    data: documentsScreenData,
    isLoading: isDocumentsScreenLoading,
    isError: isDocumentsScreenError,
    error: documentsScreenError,
  } = useGetBookingFlowDocumentsQuery(resolvedBookingId, {
    skip: !resolvedBookingId || phase !== "net" || currentNetStep !== "documents",
  });
  const {
    data: checklistScreenData,
    isLoading: isChecklistScreenLoading,
    isError: isChecklistScreenError,
    error: checklistScreenError,
  } = useGetBookingFlowChecklistSummaryQuery(resolvedBookingId, {
    skip: !resolvedBookingId || phase !== "net" || currentNetStep !== "checklist",
  });
  const {
    data: signaturesScreenData,
    isLoading: isSignaturesScreenLoading,
    isError: isSignaturesScreenError,
    error: signaturesScreenError,
  } = useGetBookingFlowSignaturesQuery(resolvedBookingId, {
    skip: !resolvedBookingId || phase !== "net" || currentNetStep !== "signatures",
  });
  const {
    data: submitScreenData,
    isLoading: isSubmitScreenLoading,
    isError: isSubmitScreenError,
    error: submitScreenError,
  } = useGetBookingFlowSubmitQuery(resolvedBookingId, {
    skip: !resolvedBookingId || phase !== "net" || currentNetStep !== "submit",
  });
  const {
    data: reviewScreenData,
    isLoading: isReviewScreenLoading,
    isError: isReviewScreenError,
    error: reviewScreenError,
  } = useGetBookingFlowReviewQuery(resolvedBookingId, {
    skip: !resolvedBookingId || phase !== "net" || currentNetStep !== "review",
  });
  const {
    data: paymentScreenData,
    isLoading: isPaymentScreenLoading,
    isError: isPaymentScreenError,
    error: paymentScreenError,
  } = useGetBookingCheckoutPaymentQuery(resolvedBookingId, {
    skip: !resolvedBookingId || phase !== "net" || currentNetStep !== "payment",
  });

  const resolveQualificationId = React.useCallback(() => {
    if (selectedQualificationIdParam) {
      return selectedQualificationIdParam;
    }

    return selectedQualification
      .trim()
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, [selectedQualification, selectedQualificationIdParam]);

  React.useEffect(() => {
    const requestedBookingId = searchParams.get("bookingId");

    if (requestedBookingId && requestedBookingId !== activeBookingId) {
      setActiveBookingId(requestedBookingId);
    }
  }, [activeBookingId, searchParams]);

  React.useEffect(() => {
    const resolvedFlow =
      requestedFlow === "am2e" || requestedFlow === "am2e-v1"
        ? requestedFlow
        : requestedFlow === "am2"
          ? "am2"
          : null;
    const resolvedStep = netSteps.find(
      (step) => step.key === requestedNetStep
    )?.key;

    if (!resolvedFlow || !resolvedStep) {
      return;
    }

    setNetFlowType(resolvedFlow);
    setPhase("net");
    setCurrentNetStep(resolvedStep);
    setReviewStatus(
      requestedReviewStatus === "approved" ? "approved" : "pending"
    );
  }, [requestedFlow, requestedNetStep, requestedReviewStatus]);

  React.useEffect(() => {
    const screen = documentsScreenData?.data.screen;

    if (!screen) {
      return;
    }

    const serverBookingId = resolveBookingIdFromDocumentsScreen(screen);

    if (serverBookingId && serverBookingId !== activeBookingId) {
      setActiveBookingId(serverBookingId);
    }
  }, [activeBookingId, documentsScreenData]);

  React.useEffect(() => {
    const screen = checklistScreenData?.data.screen;

    if (!screen) {
      return;
    }

    const serverBookingId = resolveBookingIdFromChecklistScreen(screen);

    if (serverBookingId && serverBookingId !== activeBookingId) {
      setActiveBookingId(serverBookingId);
    }
  }, [activeBookingId, checklistScreenData]);

  React.useEffect(() => {
    const screen = signaturesScreenData?.data.screen;

    if (!screen) {
      return;
    }

    const serverBookingId = resolveBookingIdFromSignaturesScreen(screen);

    if (serverBookingId && serverBookingId !== activeBookingId) {
      setActiveBookingId(serverBookingId);
    }
  }, [activeBookingId, signaturesScreenData]);

  React.useEffect(() => {
    const screen = submitScreenData?.data.screen;

    if (!screen) {
      return;
    }

    const serverBookingId =
      extractBookingIdFromApiUrl(screen.actions?.submit?.apiUrl) ||
      extractBookingIdFromApiUrl(screen.actions?.back?.apiUrl);

    if (serverBookingId && serverBookingId !== activeBookingId) {
      setActiveBookingId(serverBookingId);
    }
  }, [activeBookingId, submitScreenData]);

  React.useEffect(() => {
    const providerRequest = signaturesScreenData?.data.screen.items.find(
      (item) => item.id === "training_provider"
    )?.request;

    if (!providerRequest) {
      return;
    }

    setProviderSignatureRequest((current) => ({
      email: current.email || providerRequest.email || "",
      name: current.name || providerRequest.name || "",
      subject: current.subject || providerRequest.subject || "",
      message: current.message || providerRequest.message || "",
    }));
  }, [signaturesScreenData]);

  React.useEffect(() => {
    const serverBookingId =
      resolveBookingIdFromRegistrationScreen(registrationScreen) ||
      resolveBookingIdFromRegistrationScreen(assessmentRegistrationScreen) ||
      resolveBookingIdFromRegistrationScreen(employerRegistrationScreen) ||
      resolveBookingIdFromRegistrationScreen(trainingRegistrationScreen) ||
      resolveBookingIdFromRegistrationScreen(privacyRegistrationScreen);

    if (serverBookingId && serverBookingId !== activeBookingId) {
      setActiveBookingId(serverBookingId);
    }
  }, [
    activeBookingId,
    assessmentRegistrationScreen,
    employerRegistrationScreen,
    privacyRegistrationScreen,
    registrationScreen,
    trainingRegistrationScreen,
  ]);

  const currentIndex = currentRegistrationSteps.findIndex(
    (step) => step.key === currentStep
  );
  const paymentScreen = paymentScreenData?.data.screen;

  React.useEffect(() => {
    if (!registrationScreen?.submission?.payloadTemplate?.personalDetails) {
      return;
    }

    const personalDetails = registrationScreen.submission.payloadTemplate.personalDetails;

    setCandidate((current) => ({
      ...current,
      title: current.title || personalDetails.title || "",
      firstName: current.firstName || personalDetails.firstName || "",
      lastName: current.lastName || personalDetails.lastName || "",
      dob: current.dob || personalDetails.dateOfBirth || "",
      niNumber: current.niNumber || personalDetails.niNumber || "",
      email: current.email || personalDetails.email || "",
      mobileNumber: current.mobileNumber || personalDetails.mobileNumber || "",
      address1: current.address1 || personalDetails.addressLine1 || "",
      address2: current.address2 || personalDetails.addressLine2 || "",
      town: current.town || personalDetails.town || "",
      postcode: current.postcode || personalDetails.postcode || "",
    }));
  }, [registrationScreen]);

  React.useEffect(() => {
    if (!assessmentRegistrationScreen?.submission?.payloadTemplate?.assessmentDetails) {
      return;
    }

    const assessmentDetails =
      assessmentRegistrationScreen.submission.payloadTemplate.assessmentDetails;

    setAssessment((current) => ({
      ...current,
      apprentice: current.apprentice || assessmentDetails.apprentice || "",
      uln: current.uln || assessmentDetails.uln || "",
      funding: current.funding || assessmentDetails.funding || "",
      awardingBody: current.awardingBody || assessmentDetails.awardingBody || "",
      adjustments:
        current.adjustments || assessmentDetails.reasonableAdjustments || "",
      recognition:
        current.recognition ||
        assessmentDetails.recognitionOfPriorLearning ||
        "",
      assessmentType:
        current.assessmentType || assessmentDetails.assessmentType || "",
    }));
  }, [assessmentRegistrationScreen]);

  React.useEffect(() => {
    if (!employerRegistrationScreen?.submission?.payloadTemplate?.employerDetails) {
      return;
    }

    const employerDetails =
      employerRegistrationScreen.submission.payloadTemplate.employerDetails;

    setEmployer((current) => ({
      ...current,
      companyName: current.companyName || employerDetails.companyName || "",
      email: current.email || employerDetails.email || "",
      contactName: current.contactName || employerDetails.contactName || "",
      contactNumber: current.contactNumber || employerDetails.contactNumber || "",
      address1: current.address1 || employerDetails.address1 || "",
      address2: current.address2 || employerDetails.address2 || "",
      address3: current.address3 || employerDetails.address3 || "",
      address4: current.address4 || employerDetails.address4 || "",
      town: current.town || employerDetails.town || "",
      postcode: current.postcode || employerDetails.postcode || "",
    }));
  }, [employerRegistrationScreen]);

  React.useEffect(() => {
    if (!trainingRegistrationScreen?.submission?.payloadTemplate?.trainingProviderDetails) {
      return;
    }

    const trainingProviderDetails =
      trainingRegistrationScreen.submission.payloadTemplate.trainingProviderDetails;

    setTraining((current) => ({
      ...current,
      companyName: current.companyName || trainingProviderDetails.companyName || "",
      email: current.email || trainingProviderDetails.email || "",
      contactName: current.contactName || trainingProviderDetails.contactName || "",
      contactNumber: current.contactNumber || trainingProviderDetails.contactNumber || "",
      address1: current.address1 || trainingProviderDetails.address1 || "",
      address2: current.address2 || trainingProviderDetails.address2 || "",
      address3: current.address3 || trainingProviderDetails.address3 || "",
      address4: current.address4 || trainingProviderDetails.address4 || "",
      town: current.town || trainingProviderDetails.town || "",
      postcode: current.postcode || trainingProviderDetails.postcode || "",
    }));
  }, [trainingRegistrationScreen]);

  React.useEffect(() => {
    if (!paymentScreen?.terms) {
      return;
    }

    setPayment((current) => ({
      ...current,
      acceptedTerms: paymentScreen.terms?.accepted ?? false,
    }));
  }, [paymentScreen]);

  const updateCandidate = (field: keyof CandidateFormState, value: string) => {
    setCandidateStepError("");
    setCandidate((current) => ({ ...current, [field]: value }));
  };

  const updateAssessment = (
    field: keyof AssessmentFormState,
    value: string
  ) => {
    setAssessmentStepError("");
    setAssessment((current) => ({ ...current, [field]: value }));
  };

  const updateEmployer = (field: keyof EmployerFormState, value: string) => {
    setEmployerStepError("");
    setEmployer((current) => ({ ...current, [field]: value }));
  };

  const updateTraining = (field: keyof TrainingFormState, value: string) => {
    setTrainingStepError("");
    setTraining((current) => ({ ...current, [field]: value }));
  };

  const updatePayment = (
    field: keyof PaymentFormState,
    value: string | boolean
  ) => {
    setPayment((current) => ({ ...current, [field]: value }));
  };

  const updateProviderSignatureRequest = (
    field: keyof ProviderSignatureRequestState,
    value: string
  ) => {
    setProviderSignatureRequest((current) => ({ ...current, [field]: value }));
  };

  const selectedPaymentMethodId = getPaymentMethodIdFromCardNumber(payment.cardNumber);
  const isStripeTestMode = paymentScreen?.stripe?.enabled === false;
  const allowPaymentProgressInDev = process.env.NODE_ENV === "development";
  const paymentEnabled =
    (paymentScreen?.actions?.pay?.enabled !== false && Boolean(paymentScreen)) ||
    allowPaymentProgressInDev;
  const canSubmitNetPayment =
    Boolean(paymentScreen) &&
    paymentEnabled &&
    (!paymentScreen?.terms?.required || payment.acceptedTerms) &&
    payment.cardNumber.replace(/\s/g, "").length === 16 &&
    payment.expiry.replace(/\D/g, "").length === 4 &&
    payment.cvc.length >= 3 &&
    (!isStripeTestMode || selectedPaymentMethodId !== null);
  const isSubmittingPayment = isCreatingPaymentIntent || isCompletingPayment;

  const selectAssessmentType = (value: string) => {
    if (
      lockedAssessmentType &&
      normalizeAssessmentValue(value) !==
        normalizeAssessmentValue(lockedAssessmentType)
    ) {
      return;
    }

    updateAssessment("assessmentType", value);
  };

  const moveNext = async () => {
    if (currentStep === "candidate") {
      const requiredCandidateFields = candidateFields.filter(
        (field) => field.required && candidateFieldIdMap[field.id]
      );
      const hasMissingCandidateField = requiredCandidateFields.some((field) => {
        const stateKey = candidateFieldIdMap[field.id];
        return candidate[stateKey].trim().length === 0;
      });

      if (hasMissingCandidateField) {
        setCandidateStepError("Please complete all required candidate fields before continuing.");
        return;
      }

      if (!resolvedBookingId) {
        try {
          setCandidateStepError("");
          const response = await createNormalBooking({
            courseSlug: course.slug,
            personalDetails: {
              title: candidate.title.trim(),
              firstName: candidate.firstName.trim(),
              lastName: candidate.lastName.trim(),
              dateOfBirth: formatDateForApi(candidate.dob),
              niNumber: candidate.niNumber.trim(),
              email: candidate.email.trim(),
              mobileNumber: candidate.mobileNumber.trim(),
              addressLine1: candidate.address1.trim(),
              addressLine2: candidate.address2.trim(),
              town: candidate.town.trim(),
              postcode: candidate.postcode.trim(),
              trainingCenter:
                registrationScreen?.courseContext.location?.trim() ||
                course.location.trim(),
            },
          }).unwrap();
          const nextBookingId = response.data.booking.id;

          if (!nextBookingId) {
            setCandidateStepError(
              "We could not determine the booking reference returned from the candidate details response."
            );
            return;
          }

          setActiveBookingId(nextBookingId);
          router.replace(
            `/dashboard/courses/${course.slug}/book?${(() => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("bookingId", nextBookingId);
              return params.toString();
            })()}`
          );
        } catch (createBookingError) {
          setCandidateStepError(
            resolveApiErrorMessage(
              createBookingError,
              "We could not save your candidate details right now."
            )
          );
          return;
        }
      }
    }

    if (currentStep === "assessment") {
      const requiredAssessmentFields = assessmentFields.filter(
        (field) => field.required && assessmentFieldIdMap[field.id]
      );
      const hasMissingAssessmentField = requiredAssessmentFields.some((field) => {
        const stateKey = assessmentFieldIdMap[field.id];
        return assessment[stateKey].trim().length === 0;
      });

        if (hasMissingAssessmentField) {
          setAssessmentStepError(
            "Please complete all required assessment fields before continuing."
          );
          return;
        }

      if (!resolvedBookingId) {
        setAssessmentStepError(
          "We could not determine the booking reference for this registration yet."
        );
        return;
      }

      try {
        setAssessmentStepError("");
        await saveRegistrationAssessment({
          bookingId: resolvedBookingId,
          assessmentDetails: {
            apprentice: assessment.apprentice.toLowerCase(),
            uln: assessment.uln,
            funding: assessment.funding
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/\+/g, "-plus"),
            awardingBody: assessment.awardingBody
              .toLowerCase()
              .replace(/\s*&\s*/g, "-and-")
              .replace(/\s+/g, "-"),
            reasonableAdjustments: assessment.adjustments.toLowerCase(),
            recognitionOfPriorLearning: assessment.recognition.toLowerCase(),
            assessmentType: assessment.assessmentType.toLowerCase(),
          },
        }).unwrap();
      } catch (saveAssessmentError) {
        setAssessmentStepError(
          resolveApiErrorMessage(
            saveAssessmentError,
            "We could not save your assessment details right now."
          )
        );
        return;
      }
    }

    if (currentStep === "employer") {
      if (hasEmployer === "no") {
        setEmployerStepError("");
      } else {
        const requiredEmployerFields = employerFields.filter(
          (field) => field.required && employerFieldIdMap[field.id]
        );
        const hasMissingEmployerField = requiredEmployerFields.some((field) => {
          const stateKey = employerFieldIdMap[field.id];
          return employer[stateKey].trim().length === 0;
        });

        if (hasMissingEmployerField) {
          setEmployerStepError(
            "Please complete all required employer fields before continuing."
          );
          return;
        }

        if (!resolvedBookingId) {
          setEmployerStepError(
            "We could not determine the booking reference for this registration yet."
          );
          return;
        }

        try {
          setEmployerStepError("");
          await saveRegistrationEmployer({
            bookingId: resolvedBookingId,
            employerDetails: {
              companyName: employer.companyName,
              email: employer.email,
              contactName: employer.contactName,
              contactNumber: employer.contactNumber,
              address1: employer.address1,
              address2: employer.address2,
              address3: employer.address3,
              address4: employer.address4,
              town: employer.town,
              postcode: employer.postcode,
            },
          }).unwrap();
        } catch (saveEmployerError) {
          setEmployerStepError(
            resolveApiErrorMessage(
              saveEmployerError,
              "We could not save your employer details right now."
            )
          );
          return;
        }
      }
    }

    if (currentStep === "training") {
      const requiredTrainingFields = trainingFields.filter(
        (field) => field.required && trainingFieldIdMap[field.id]
      );
      const hasMissingTrainingField = requiredTrainingFields.some((field) => {
        const stateKey = trainingFieldIdMap[field.id];
        return training[stateKey].trim().length === 0;
      });

      if (hasMissingTrainingField) {
        setTrainingStepError(
          "Please complete all required training provider fields before continuing."
        );
        return;
      }

      if (!resolvedBookingId) {
        setTrainingStepError(
          "We could not determine the booking reference for this registration yet."
        );
        return;
      }

      try {
        setTrainingStepError("");
        await saveRegistrationTraining({
          bookingId: resolvedBookingId,
          trainingProviderDetails: {
            companyName: training.companyName,
            email: training.email,
            contactName: training.contactName,
            contactNumber: training.contactNumber,
            address1: training.address1,
            address2: training.address2,
            address3: training.address3,
            address4: training.address4,
            town: training.town,
            postcode: training.postcode,
          },
        }).unwrap();
      } catch (saveTrainingError) {
        setTrainingStepError(
          resolveApiErrorMessage(
            saveTrainingError,
            "We could not save your training provider details right now."
          )
        );
        return;
      }
    }

    const nextStep = currentRegistrationSteps[currentIndex + 1];
    if (nextStep) {
      setCurrentStep(nextStep.key);
    }
  };

  const moveBack = () => {
    const previousStep = currentRegistrationSteps[currentIndex - 1];
    if (previousStep) {
      setCurrentStep(previousStep.key);
    }
  };

  const startNetFlow = (flowType: NetFlowType, nextBookingId?: string) => {
    setNetFlowType(flowType);
    setPhase("net");
    setCurrentNetStep("documents");
    syncNetRoute("documents", undefined, flowType, nextBookingId);
  };

  const submitEligibility = React.useCallback(
    async (registrationDate?: string, bookingIdOverride?: string) => {
      const bookingReference = bookingIdOverride ?? resolvedBookingId;

      if (!bookingReference) {
        setEligibilityStepError(
          "We could not determine the booking reference for this registration yet."
        );
        return null;
      }

      const qualificationId = resolveQualificationId();

      if (!qualificationId || !selectedQualification) {
        setEligibilityStepError(
          "Please start from Book Now and select a qualification before continuing."
        );
        return null;
      }

      try {
        setEligibilityStepError("");
        const response = await saveRegistrationEligibility({
          bookingId: bookingReference,
          qualificationId,
          qualificationLabel: selectedQualification,
          nvqRegistrationDate: registrationDate ?? "",
        }).unwrap();
        const nextBookingId = resolveBookingIdFromBookingPayload(
          response.data.booking
        );

        if (!nextBookingId) {
          setEligibilityStepError(
            "We could not determine the booking reference returned from the eligibility response."
          );
          return null;
        }

        setActiveBookingId(nextBookingId);
        return nextBookingId;
      } catch (saveEligibilityError) {
        setEligibilityStepError(
          resolveApiErrorMessage(
            saveEligibilityError,
            "We could not save your eligibility details right now."
          )
        );
        return null;
      }
    },
    [
      resolveQualificationId,
      resolvedBookingId,
      saveRegistrationEligibility,
      setActiveBookingId,
      selectedQualification,
    ]
  );

  const handlePrivacyContinue = async () => {
    if (!resolvedBookingId) {
      setEligibilityStepError(
        "We could not determine the booking reference for this registration yet."
      );
      return;
    }

    try {
      setEligibilityStepError("");
      const response = await saveRegistrationPrivacy({
        bookingId: resolvedBookingId,
        privacyConfirmation: true,
      }).unwrap();
      const nextBookingId = resolveBookingIdFromBookingPayload(
        response.data.booking
      );

      if (!nextBookingId) {
        setEligibilityStepError(
          "We could not determine the booking reference returned from the privacy response."
        );
        return;
      }

      setActiveBookingId(nextBookingId);

      if (isAm2eQualification) {
        setEligibilityStepError("");
        router.replace(
          `/dashboard/courses/${course.slug}/book?${(() => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("bookingId", nextBookingId);
            return params.toString();
          })()}`
        );
        setNvqModalOpen(true);
        return;
      }

      const eligibilityBookingId = await submitEligibility(undefined, nextBookingId);

      if (!eligibilityBookingId) {
        return;
      }

      startNetFlow("am2", eligibilityBookingId);
      return;
    } catch (savePrivacyError) {
      setEligibilityStepError(
        resolveApiErrorMessage(
          savePrivacyError,
          "We could not save your privacy confirmation right now."
        )
      );
      return;
    }
  };

  const handleNqvContinue = async () => {
    const nextFlowType =
      nvqTiming === "before-3rd-september-2023" ? "am2e" : "am2e-v1";
    const courseId = course.id;

    if (!courseId) {
      setEligibilityStepError(
        "We could not determine the course id needed to load this checklist flow."
      );
      return;
    }

    let resolvedFlowType: NetFlowType = nextFlowType;

    try {
      setEligibilityStepError("");
      const checklistFlowResponse = await getAm2eChecklistFlowByCourse({
        variant: nextFlowType,
        courseId,
        questionId: "nvq-registration-date",
        answerId: nvqTiming,
      }).unwrap();

      resolvedFlowType = checklistFlowResponse.data.checklistVariant;
    } catch (checklistFlowError) {
      setEligibilityStepError(
        resolveApiErrorMessage(
          checklistFlowError,
          "We could not load the selected AM2E checklist flow right now."
        )
      );
      return;
    }

    const eligibilityBookingId = await submitEligibility(nvqTiming, resolvedBookingId);

    if (!eligibilityBookingId) {
      return;
    }

    setNvqModalOpen(false);
    startNetFlow(resolvedFlowType, eligibilityBookingId);
  };

  const handleUploadDocument = async (
    id: string,
    title: string,
    file: File
  ) => {
    if (!resolvedBookingId) {
      setDocumentUploadError(
        "We could not determine the booking reference for this document upload yet."
      );
      return;
    }

    try {
      setDocumentUploadError("");
      setUploadingDocumentId(id);
      const response = await uploadBookingDocument({
        bookingId: resolvedBookingId,
        documentType: id,
        documentLabel: title,
        file,
      }).unwrap();
      const nextBookingId = resolveBookingIdFromDocumentsScreen(
        response.data.screen
      );

      if (nextBookingId && nextBookingId !== resolvedBookingId) {
        setActiveBookingId(nextBookingId);
      }
    } catch (uploadError) {
      setDocumentUploadError(
        resolveApiErrorMessage(
          uploadError,
          "We could not upload your booking document right now."
        )
      );
    } finally {
      setUploadingDocumentId(null);
    }
  };

  const handleSignaturesContinue = () => {
    setCurrentNetStep("submit");
    router.replace(
      `/dashboard/courses/${course.slug}/book?${(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("flow", netFlowType);
        params.set("netStep", "submit");
        if (resolvedBookingId) {
          params.set("bookingId", resolvedBookingId);
        }
        return params.toString();
      })()}`
    );
  };

  const handleSubmitForReview = async () => {
    if (!resolvedBookingId) {
      return;
    }

    try {
      const response = await submitBookingForReview({
        bookingId: resolvedBookingId,
      }).unwrap();

      setReviewScreen(response.data.screen);
      setReviewStatus("pending");
      moveToNetStep("review", "pending");
    } catch (submitError) {
      setCandidateSignatureError(
        resolveApiErrorMessage(
          submitError,
          "We could not submit your booking for review right now."
        )
      );
    }
  };

  const effectiveReviewScreen: GetBookingFlowReviewResponse["data"]["screen"] | SubmitBookingForReviewResponse["data"]["screen"] | null =
    reviewScreenData?.data.screen ?? reviewScreen;

  const handleCandidateSignatureSubmit = async (
    payload: SignatureSubmissionPayload
  ) => {
    if (!resolvedBookingId) {
      setCandidateSignatureError(
        "We could not determine the booking reference for this signature yet."
      );
      return;
    }

    try {
      setCandidateSignatureError("");
      setCandidateSignatureMessage("");
      const response = await submitCandidateSignature({
        bookingId: resolvedBookingId,
        ...payload,
      }).unwrap();
      const nextBookingId = resolveBookingIdFromSignaturesScreen(
        response.data.screen
      );

      if (nextBookingId && nextBookingId !== resolvedBookingId) {
        setActiveBookingId(nextBookingId);
      }

      setCandidateSignatureMessage(
        response.message || "Candidate signature submitted successfully."
      );
      setSignatureModalOpen(false);
    } catch (submitError) {
      setCandidateSignatureError(
        resolveApiErrorMessage(
          submitError,
          "We could not submit the candidate signature right now."
        )
      );
    }
  };

  const handleTrainingProviderSignatureRequest = async () => {
    if (!resolvedBookingId) {
      setProviderSignatureRequestError(
        "We could not determine the booking reference for this signature request yet."
      );
      return;
    }

    try {
      setProviderSignatureRequestError("");
      setProviderSignatureRequestMessage("");
      const response = await requestTrainingProviderSignature({
        bookingId: resolvedBookingId,
        trainingProviderEmail: providerSignatureRequest.email,
        trainingProviderName: providerSignatureRequest.name,
        subject: providerSignatureRequest.subject,
        message: providerSignatureRequest.message,
      }).unwrap();
      const nextBookingId = resolveBookingIdFromSignaturesScreen(
        response.data.screen
      );

      if (nextBookingId && nextBookingId !== resolvedBookingId) {
        setActiveBookingId(nextBookingId);
      }

      setProviderSignatureRequestMessage(
        response.message ||
          "Training provider signature request sent successfully."
      );
      setProviderRequestModalOpen(false);
    } catch (requestError) {
      setProviderSignatureRequestError(
        resolveApiErrorMessage(
          requestError,
          "We could not send the training provider signature request right now."
        )
      );
    }
  };

  const syncNetRoute = React.useCallback(
    (
      step: NetStepKey,
      nextReviewStatus?: ReviewStatus,
      nextFlowType?: NetFlowType,
      nextBookingId?: string
    ) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("flow", nextFlowType ?? netFlowType);
      params.set("netStep", step);

      const bookingReference = nextBookingId ?? resolvedBookingId;

      if (bookingReference) {
        params.set("bookingId", bookingReference);
      }

      if (nextReviewStatus) {
        params.set("reviewStatus", nextReviewStatus);
      } else {
        params.delete("reviewStatus");
      }

      router.replace(`/dashboard/courses/${course.slug}/book?${params.toString()}`);
    },
    [course.slug, netFlowType, resolvedBookingId, router, searchParams]
  );

  const moveToNetStep = React.useCallback(
    (step: NetStepKey, nextReviewStatus?: ReviewStatus) => {
      setCurrentNetStep(step);

      if (nextReviewStatus) {
        setReviewStatus(nextReviewStatus);
      }

      syncNetRoute(step, nextReviewStatus);
    },
    [syncNetRoute]
  );

  const handleNetPayment = async () => {
    if (!resolvedBookingId || !paymentScreen || !canSubmitNetPayment || isSubmittingPayment) {
      return;
    }

    try {
      setPaymentStepError("");
      const intentResponse = await createPaymentIntent({
        bookingId: resolvedBookingId,
        agreedToTerms: payment.acceptedTerms,
      }).unwrap();

      const paymentIntentId = intentResponse.data.paymentIntent.id;

      if (isStripeTestMode && !selectedPaymentMethodId) {
        setPaymentStepError(
          "Only supported Stripe test cards can be used right now. Use 4242 4242 4242 4242 for success or 4000 0000 0000 0002 to simulate a failed payment."
        );
        return;
      }

      const paymentResponse = await completePayment({
        bookingId: resolvedBookingId,
        agreedToTerms: payment.acceptedTerms,
        paymentIntentId,
        paymentMethodId: selectedPaymentMethodId || undefined,
      }).unwrap();

      if (!paymentResponse.success) {
        setPaymentStepError(
          paymentResponse.data.booking.payment?.failureReason ||
            paymentResponse.message ||
            "Payment failed. Please check your card details and try again."
        );
        return;
      }

      moveToNetStep("confirmed");
    } catch (submitPaymentError) {
      if (shouldBypassApprovalErrorInDev(submitPaymentError)) {
        moveToNetStep("confirmed");
        return;
      }

      setPaymentStepError(
        resolveApiErrorMessage(
          submitPaymentError,
          "We could not prepare your payment right now."
        )
      );
    }
  };

  return (
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

        {phase === "registration" ? (
          <>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#2d3f8f]">
              {registrationScreen?.title ?? "NET Candidate Registration Form"}
            </h1>
            <p className="mt-3 max-w-[920px] text-sm leading-6 text-[#667795]">
              {registrationScreen?.description ??
                "Once this form is completed please return it to your assessment centre. All fields are mandatory."}
              {registrationScreen?.assistanceText ? (
                <>
                  {" "}
                  {registrationScreen.assistanceText}
                </>
              ) : null}
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#2d3f8f]">
              {course.title}
            </h1>
            <p className="mt-3 max-w-[920px] text-sm leading-6 text-[#667795]">
              Complete the next AM2 preparation steps before continuing your
              submission.
            </p>
          </>
        )}
      </div>

      <PanelCard className="rounded-[24px] border-[#d7e5f7] bg-[#eef6ff] p-4 sm:p-5">
        {phase === "registration" ? (
          <Stepper
            steps={currentRegistrationSteps}
            currentStep={currentStep}
            activeClassName="bg-[#17a85a] text-white"
          />
        ) : (
          <Stepper
            steps={netSteps}
            currentStep={currentNetStep}
            activeClassName="bg-[#1ea6df] text-white"
          />
        )}

        <div className="mt-5 rounded-[18px] border border-[#d7e5f7] bg-white/75 p-4 sm:p-5">
          {phase === "registration" && isRegistrationFormLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-8 w-72 rounded bg-[#e4edf8]" />
              <div className="h-5 w-full rounded bg-[#edf3fb]" />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-11 rounded bg-[#edf3fb]" />
                <div className="h-11 rounded bg-[#edf3fb]" />
              </div>
              <div className="h-11 rounded bg-[#edf3fb]" />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-11 rounded bg-[#edf3fb]" />
                <div className="h-11 rounded bg-[#edf3fb]" />
              </div>
            </div>
          ) : null}

          {phase === "registration" && isRegistrationFormError ? (
            <div className="rounded-lg border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
              {resolveApiErrorMessage(
                registrationFormError,
                "We could not load the candidate registration form right now."
              )}
            </div>
          ) : null}

          {phase === "registration" &&
          !isRegistrationFormLoading &&
          !isRegistrationFormError &&
          currentStep === "candidate" ? (
            <>
              <div>
                <h2 className="text-[1.6rem] font-semibold text-[#3849a0]">
                  {candidateSection?.title ?? "Candidate Details"}
                </h2>
                <p className="mt-2 text-sm text-[#7a88a3]">
                  {candidateSection?.description ??
                    "Please complete all fields. All fields in this section are mandatory."}
                </p>
              </div>

              <div className="mt-5 grid gap-4">
                {(() => {
                  const renderedFieldRows: React.ReactNode[] = [];

                  for (let index = 0; index < candidateFields.length; index += 1) {
                    const field = candidateFields[index];
                    const nextField = candidateFields[index + 1];
                    const stateKey = candidateFieldIdMap[field.id];

                    if (!stateKey) {
                      continue;
                    }

                    const renderField = (currentField: CourseRegistrationField) => {
                      const currentStateKey = candidateFieldIdMap[currentField.id];

                      if (!currentStateKey) {
                        return null;
                      }

                      const icon =
                        currentField.id === "dateOfBirth" ? (
                          <CalendarDays className="h-4 w-4" />
                        ) : currentField.id === "email" ? (
                          <Mail className="h-4 w-4" />
                        ) : currentField.id === "mobileNumber" ? (
                          <Phone className="h-4 w-4" />
                        ) : undefined;

                      return (
                        <div key={currentField.id}>
                          <FieldLabel>
                            {currentField.label}
                            {currentField.required ? " *" : ""}
                          </FieldLabel>
                          <TextField
                            icon={icon}
                            value={candidate[currentStateKey]}
                            onChange={(value) =>
                              updateCandidate(
                                currentStateKey,
                                currentField.id === "dateOfBirth"
                                  ? formatShortDateInput(value)
                                  : value
                              )
                            }
                            placeholder={
                              currentField.id === "dateOfBirth"
                                ? "dd/mm/yyyy"
                                : currentField.placeholder ?? ""
                            }
                            type={
                              currentField.id === "dateOfBirth"
                                ? "text"
                                : currentField.type
                            }
                          />
                          {currentField.helperText ? (
                            <p className="mt-2 text-xs text-[#7a88a3]">
                              {currentField.helperText}
                            </p>
                          ) : null}
                        </div>
                      );
                    };

                    const shouldGroupWithNext =
                      nextField &&
                      ["firstName", "dateOfBirth", "email", "town"].includes(field.id) &&
                      ["lastName", "niNumber", "mobileNumber", "postcode"].includes(
                        nextField.id
                      );

                    if (shouldGroupWithNext) {
                      renderedFieldRows.push(
                        <div
                          key={`${field.id}-${nextField.id}`}
                          className="grid gap-4 md:grid-cols-2"
                        >
                          {renderField(field)}
                          {renderField(nextField)}
                        </div>
                      );
                      index += 1;
                      continue;
                    }

                    renderedFieldRows.push(renderField(field));
                  }

                  return renderedFieldRows;
                })()}

                {candidateStepError ? (
                  <p className="rounded-lg border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
                    {candidateStepError}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}

          {phase === "registration" && currentStep === "assessment" && isAssessmentFormLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-8 w-80 rounded bg-[#e4edf8]" />
              <div className="h-5 w-60 rounded bg-[#edf3fb]" />
              <div className="h-16 rounded bg-[#edf3fb]" />
              <div className="h-24 rounded bg-[#edf3fb]" />
              <div className="h-24 rounded bg-[#edf3fb]" />
            </div>
          ) : null}

          {phase === "registration" && currentStep === "assessment" && isAssessmentFormError ? (
            <div className="rounded-lg border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
              {resolveApiErrorMessage(
                assessmentFormError,
                "We could not load the assessment registration form right now."
              )}
            </div>
          ) : null}

          {phase === "registration" &&
          currentStep === "assessment" &&
          !isAssessmentFormLoading &&
          !isAssessmentFormError ? (
            <>
              <div>
                <h2 className="text-[1.6rem] font-semibold text-[#3849a0]">
                  {assessmentSection?.title ?? "Assessment & Registration Details"}
                </h2>
                <p className="mt-2 text-sm text-[#7a88a3]">
                  {assessmentRegistrationScreen?.description ?? "Please complete all fields."}
                </p>
              </div>

              <div className="mt-5 grid gap-5">
                {assessmentFields.map((field) => {
                  const stateKey = assessmentFieldIdMap[field.id];

                  if (!stateKey) {
                    return null;
                  }

                  if (field.id === "apprentice") {
                    return (
                      <div
                        key={field.id}
                        className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]"
                      >
                        <div>
                          <FieldLabel>
                            {field.label}
                            {field.required ? " *" : ""}
                          </FieldLabel>
                          <RadioRow
                            name={field.id}
                            options={field.options?.map((option) => option.label) ?? []}
                            value={assessment[stateKey]}
                            onChange={(value) => updateAssessment(stateKey, value)}
                          />
                        </div>
                        {assessmentFields
                          .filter((candidateField) => candidateField.id === "uln")
                          .map((ulnField) => (
                            <div key={ulnField.id}>
                              <FieldLabel>
                                {ulnField.label}
                                {ulnField.required ? " *" : ""}
                              </FieldLabel>
                              <TextField
                                value={assessment.uln}
                                onChange={(value) => updateAssessment("uln", value)}
                                placeholder={ulnField.placeholder ?? ""}
                                type={ulnField.type}
                              />
                            </div>
                          ))}
                      </div>
                    );
                  }

                  if (field.id === "uln") {
                    return null;
                  }

                  if (field.type === "radio") {
                    const columns =
                      field.options?.length === 4
                        ? "md:grid-cols-4"
                        : field.options?.length === 3
                          ? "md:grid-cols-3"
                          : "md:grid-cols-2";

                    return (
                      <div key={field.id}>
                        <FieldLabel>
                          {field.label}
                          {field.required ? " *" : ""}
                        </FieldLabel>
                        <RadioRow
                          name={field.id}
                          options={field.options?.map((option) => option.label) ?? []}
                          value={assessment[stateKey]}
                          onChange={(value) => updateAssessment(stateKey, value)}
                          columns={columns}
                        />
                        {field.helperText ? (
                          <p className="mt-2 text-xs leading-5 text-[#8795af]">
                            {field.helperText}
                          </p>
                        ) : null}
                      </div>
                    );
                  }

                  if (field.type === "choice-grid") {
                    return (
                      <div key={field.id}>
                        <FieldLabel>
                          {field.label}
                          {field.required ? " *" : ""}
                        </FieldLabel>
                        <div className="grid gap-3 md:grid-cols-3">
                          {field.options?.map((option) => {
                            const checked = assessment[stateKey] === option.label;
                            const disabled =
                              Boolean(lockedAssessmentType) &&
                              normalizeAssessmentValue(option.label) !==
                                normalizeAssessmentValue(lockedAssessmentType);

                            return (
                              <label
                                key={option.id}
                                className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${
                                  disabled
                                    ? "cursor-not-allowed border-[#e6edf7] bg-[#f6f9fc] text-[#aab6c9]"
                                    : checked
                                      ? "cursor-pointer border-[#8ed7f8] bg-[#dff5ff] text-[#24346b]"
                                      : "cursor-pointer border-[#dde9f7] bg-[#f4f9ff] text-[#5f6f90]"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={field.id}
                                  checked={checked}
                                  disabled={disabled}
                                  onChange={() => selectAssessmentType(option.label)}
                                  className="h-4 w-4 accent-[#1ea6df]"
                                />
                                <span>{option.label}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={field.id}>
                      <FieldLabel>
                        {field.label}
                        {field.required ? " *" : ""}
                      </FieldLabel>
                      <TextField
                        value={assessment[stateKey]}
                        onChange={(value) => updateAssessment(stateKey, value)}
                        placeholder={field.placeholder ?? ""}
                        type={field.type}
                      />
                    </div>
                  );
                })}

                {assessmentStepError ? (
                  <p className="rounded-lg border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
                    {assessmentStepError}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}

          {phase === "registration" && currentStep === "employer" && isEmployerFormLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-8 w-52 rounded bg-[#e4edf8]" />
              <div className="h-5 w-48 rounded bg-[#edf3fb]" />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-11 rounded bg-[#edf3fb]" />
                <div className="h-11 rounded bg-[#edf3fb]" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-11 rounded bg-[#edf3fb]" />
                <div className="h-11 rounded bg-[#edf3fb]" />
              </div>
            </div>
          ) : null}

          {phase === "registration" && currentStep === "employer" && isEmployerFormError ? (
            <div className="rounded-lg border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
              {resolveApiErrorMessage(
                employerFormError,
                "We could not load the employer registration form right now."
              )}
            </div>
          ) : null}

          {phase === "registration" &&
          currentStep === "employer" &&
          !isEmployerFormLoading &&
          !isEmployerFormError ? (
            <>
              <div>
                <h2 className="text-[1.6rem] font-semibold text-[#3849a0]">
                  {employerSection?.title ?? employerRegistrationScreen?.title ?? "Current Employer"}
                </h2>
                <p className="mt-2 text-sm text-[#7a88a3]">
                  {employerRegistrationScreen?.description ?? "Please complete all fields."}
                </p>
              </div>

              <div className="mt-5 grid gap-4">
                <div>
                  <FieldLabel>
                    If you have no employer or are self-employed please put SELF
                    EMPLOYED
                  </FieldLabel>
                  <RadioRow
                    name="has-employer"
                    options={["Yes", "No"]}
                    value={hasEmployer === "yes" ? "Yes" : "No"}
                    onChange={(value) => {
                      setEmployerStepError("");
                      setHasEmployer(value === "Yes" ? "yes" : "no");
                    }}
                  />
                </div>

                {(() => {
                  const renderedFieldRows: React.ReactNode[] = [];

                  for (let index = 0; index < employerFields.length; index += 1) {
                    const field = employerFields[index];
                    const nextField = employerFields[index + 1];
                    const stateKey = employerFieldIdMap[field.id];

                    if (!stateKey) {
                      continue;
                    }

                    const renderField = (currentField: CourseRegistrationField) => {
                      const currentStateKey = employerFieldIdMap[currentField.id];

                      if (!currentStateKey) {
                        return null;
                      }

                      return (
                        <div key={currentField.id}>
                          <FieldLabel>
                            {currentField.label}
                            {currentField.required ? " *" : ""}
                          </FieldLabel>
                          <TextField
                            value={employer[currentStateKey]}
                            onChange={(value) => updateEmployer(currentStateKey, value)}
                            placeholder={currentField.placeholder ?? ""}
                            type={currentField.type}
                            disabled={hasEmployer === "no"}
                          />
                        </div>
                      );
                    };

                    const shouldGroupWithNext =
                      nextField &&
                      ["employer.companyName", "employer.contactName", "employer.town"].includes(
                        field.id
                      ) &&
                      ["employer.email", "employer.contactNumber", "employer.postcode"].includes(
                        nextField.id
                      );

                    if (shouldGroupWithNext) {
                      renderedFieldRows.push(
                        <div
                          key={`${field.id}-${nextField.id}`}
                          className="grid gap-4 md:grid-cols-2"
                        >
                          {renderField(field)}
                          {renderField(nextField)}
                        </div>
                      );
                      index += 1;
                      continue;
                    }

                    renderedFieldRows.push(renderField(field));
                  }

                  return renderedFieldRows;
                })()}

                {employerStepError ? (
                  <p className="rounded-lg border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
                    {employerStepError}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}

          {phase === "registration" && currentStep === "training" && isTrainingFormLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-8 w-72 rounded bg-[#e4edf8]" />
              <div className="h-5 w-full rounded bg-[#edf3fb]" />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-11 rounded bg-[#edf3fb]" />
                <div className="h-11 rounded bg-[#edf3fb]" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-11 rounded bg-[#edf3fb]" />
                <div className="h-11 rounded bg-[#edf3fb]" />
              </div>
            </div>
          ) : null}

          {phase === "registration" && currentStep === "training" && isTrainingFormError ? (
            <div className="rounded-lg border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
              {resolveApiErrorMessage(
                trainingFormError,
                "We could not load the training registration form right now."
              )}
            </div>
          ) : null}

          {phase === "registration" &&
          currentStep === "training" &&
          !isTrainingFormLoading &&
          !isTrainingFormError ? (
            <>
              <div>
                <h2 className="text-[1.6rem] font-semibold text-[#3849a0]">
                  {trainingSection?.title ??
                    trainingRegistrationScreen?.title ??
                    "Training Provider / Certificate Issuer"}
                </h2>
                <p className="mt-2 text-sm text-[#7a88a3]">
                  {trainingRegistrationScreen?.description ??
                    "Please enter the details of the training provider or college where you gained the qualifications to enable you to apply for this assessment. This section is mandatory."}
                </p>
              </div>

              <div className="mt-5 grid gap-4">
                {(() => {
                  const renderedFieldRows: React.ReactNode[] = [];

                  for (let index = 0; index < trainingFields.length; index += 1) {
                    const field = trainingFields[index];
                    const nextField = trainingFields[index + 1];
                    const stateKey = trainingFieldIdMap[field.id];

                    if (!stateKey) {
                      continue;
                    }

                    const renderField = (currentField: CourseRegistrationField) => {
                      const currentStateKey = trainingFieldIdMap[currentField.id];

                      if (!currentStateKey) {
                        return null;
                      }

                      return (
                        <div key={currentField.id}>
                          <FieldLabel>
                            {currentField.label}
                            {currentField.required ? " *" : ""}
                          </FieldLabel>
                          <TextField
                            value={training[currentStateKey]}
                            onChange={(value) => updateTraining(currentStateKey, value)}
                            placeholder={currentField.placeholder ?? ""}
                            type={currentField.type}
                          />
                        </div>
                      );
                    };

                    const shouldGroupWithNext =
                      nextField &&
                      [
                        "trainingProvider.companyName",
                        "trainingProvider.contactName",
                        "trainingProvider.town",
                      ].includes(field.id) &&
                      [
                        "trainingProvider.email",
                        "trainingProvider.contactNumber",
                        "trainingProvider.postcode",
                      ].includes(nextField.id);

                    if (shouldGroupWithNext) {
                      renderedFieldRows.push(
                        <div
                          key={`${field.id}-${nextField.id}`}
                          className="grid gap-4 md:grid-cols-2"
                        >
                          {renderField(field)}
                          {renderField(nextField)}
                        </div>
                      );
                      index += 1;
                      continue;
                    }

                    renderedFieldRows.push(renderField(field));
                  }

                  return renderedFieldRows;
                })()}

                {trainingStepError ? (
                  <p className="rounded-lg border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
                    {trainingStepError}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}

          {phase === "registration" && currentStep === "privacy" && isPrivacyFormLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-8 w-64 rounded bg-[#e4edf8]" />
              <div className="h-5 w-full rounded bg-[#edf3fb]" />
              <div className="h-5 w-full rounded bg-[#edf3fb]" />
              <div className="h-5 w-11/12 rounded bg-[#edf3fb]" />
              <div className="h-16 rounded bg-[#edf3fb]" />
            </div>
          ) : null}

          {phase === "registration" && currentStep === "privacy" && isPrivacyFormError ? (
            <div className="rounded-lg border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
              {resolveApiErrorMessage(
                privacyFormError,
                "We could not load the privacy registration form right now."
              )}
            </div>
          ) : null}

          {phase === "registration" &&
          currentStep === "privacy" &&
          !isPrivacyFormLoading &&
          !isPrivacyFormError ? (
            <>
              <div>
                <h2 className="text-[1.6rem] font-semibold text-[#3849a0]">
                  {privacySection?.title ??
                    privacyRegistrationScreen?.title ??
                    "Privacy Notice & Confirmation"}
                </h2>
              </div>

              <div className="mt-5 space-y-4 text-sm leading-6 text-[#6e7f9b]">
                <p>{privacyRegistrationScreen?.description}</p>

                {privacySection?.content?.map((paragraph, index) => (
                  <p key={`${privacySection.id}-${index}`}>{paragraph}</p>
                ))}

                <label className="flex items-start gap-3 rounded-lg border border-[#dde9f7] bg-[#f4f9ff] px-4 py-3 text-[#33446d]">
                  <input
                    type="checkbox"
                    checked={privacyConfirmed}
                    onChange={(event) => setPrivacyConfirmed(event.target.checked)}
                    className="mt-1 h-4 w-4 accent-[#1ea6df]"
                  />
                  <span>
                    {privacyConfirmationField?.label ??
                      "I confirm that the information provided in this registration form is complete and accurate."}
                    </span>
                </label>

                {eligibilityStepError ? (
                  <p className="rounded-lg border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
                    {eligibilityStepError}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}

          {phase === "net" && currentNetStep === "documents" ? (
            <>
              {isDocumentsScreenLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-8 w-60 rounded bg-[#e4edf8]" />
                  <div className="h-5 w-72 rounded bg-[#edf3fb]" />
                  <div className="h-16 rounded bg-[#edf3fb]" />
                  <div className="h-20 rounded bg-[#edf3fb]" />
                </div>
              ) : null}

              {!isDocumentsScreenLoading && isDocumentsScreenError ? (
                <div className="rounded-lg border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
                  {resolveApiErrorMessage(
                    documentsScreenError,
                    "We could not load the booking documents screen right now."
                  )}
                </div>
              ) : null}

              {!isDocumentsScreenLoading &&
              !isDocumentsScreenError &&
              documentsScreenData?.data.screen ? (
                <NetDocumentsPanel
                  screen={documentsScreenData.data.screen}
                  onUpload={handleUploadDocument}
                  onContinue={() => moveToNetStep("checklist")}
                  uploadingDocumentId={uploadingDocumentId}
                  uploadError={documentUploadError}
                />
              ) : null}
            </>
          ) : null}

          {phase === "net" && currentNetStep === "checklist" ? (
            <>
              {isChecklistScreenLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-8 w-60 rounded bg-[#e4edf8]" />
                  <div className="h-5 w-80 rounded bg-[#edf3fb]" />
                  <div className="h-16 rounded bg-[#edf3fb]" />
                  <div className="h-12 rounded bg-[#edf3fb]" />
                </div>
              ) : null}

              {!isChecklistScreenLoading && isChecklistScreenError ? (
                <div className="rounded-lg border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
                  {resolveApiErrorMessage(
                    checklistScreenError,
                    "We could not load the booking checklist summary right now."
                  )}
                </div>
              ) : null}

              {!isChecklistScreenLoading &&
              !isChecklistScreenError &&
              checklistScreenData?.data.screen ? (
                <NetChecklistPanel
                  screen={checklistScreenData.data.screen}
                  fullChecklistHref={`/dashboard/courses/${course.slug}/book/full-checklist?${(() => {
                    const params = new URLSearchParams();
                    params.set("flow", netFlowType);
                    if (resolvedBookingId) {
                      params.set("bookingId", resolvedBookingId);
                    }
                    return params.toString();
                  })()}`}
                  onContinue={() => moveToNetStep("signatures")}
                />
              ) : null}
            </>
          ) : null}

          {phase === "net" && currentNetStep === "signatures" ? (
            <>
              {isSignaturesScreenLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-8 w-60 rounded bg-[#e4edf8]" />
                  <div className="h-16 rounded bg-[#edf3fb]" />
                  <div className="h-36 rounded bg-[#edf3fb]" />
                </div>
              ) : null}

              {!isSignaturesScreenLoading && isSignaturesScreenError ? (
                <div className="rounded-lg border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
                  {resolveApiErrorMessage(
                    signaturesScreenError,
                    "We could not load the booking signatures screen right now."
                  )}
                </div>
              ) : null}

              {!isSignaturesScreenLoading &&
              !isSignaturesScreenError &&
              signaturesScreenData?.data.screen ? (
                <>
                  {candidateSignatureMessage ? (
                    <div className="mb-4 rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-sm text-[#15803d]">
                      {candidateSignatureMessage}
                    </div>
                  ) : null}

                  {candidateSignatureError ? (
                    <div className="mb-4 rounded-lg border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
                      {candidateSignatureError}
                    </div>
                  ) : null}

                  {providerSignatureRequestMessage ? (
                    <div className="mb-4 rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-sm text-[#15803d]">
                      {providerSignatureRequestMessage}
                    </div>
                  ) : null}

                  {providerSignatureRequestError ? (
                    <div className="mb-4 rounded-lg border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
                      {providerSignatureRequestError}
                    </div>
                  ) : null}

                  <NetSignaturesPanel
                    screen={signaturesScreenData.data.screen}
                    onCandidateSign={() => {
                      setCandidateSignatureError("");
                      setCandidateSignatureMessage("");
                      setSignatureModalOpen(true);
                    }}
                    onProviderRequest={() => {
                      setProviderSignatureRequestError("");
                      setProviderSignatureRequestMessage("");
                      setProviderRequestModalOpen(true);
                    }}
                    onContinue={handleSignaturesContinue}
                  />
                </>
              ) : null}
            </>
          ) : null}

          {phase === "net" && currentNetStep === "submit" ? (
            <>
              {isSubmitScreenLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-8 w-60 rounded bg-[#e4edf8]" />
                  <div className="h-16 rounded bg-[#edf3fb]" />
                  <div className="h-12 rounded bg-[#edf3fb]" />
                  <div className="h-12 rounded bg-[#edf3fb]" />
                </div>
              ) : null}

              {!isSubmitScreenLoading && isSubmitScreenError ? (
                <div className="rounded-lg border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
                  {resolveApiErrorMessage(
                    submitScreenError,
                    "We could not load the booking submit screen right now."
                  )}
                </div>
              ) : null}

              {!isSubmitScreenLoading &&
              !isSubmitScreenError &&
              submitScreenData?.data.screen ? (
                <NetSubmitPanelContent screen={submitScreenData.data.screen} />
              ) : null}
            </>
          ) : null}

          {phase === "net" && currentNetStep === "review" ? (
            <>
              {isReviewScreenLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-8 w-60 rounded bg-[#e4edf8]" />
                  <div className="h-16 rounded bg-[#edf3fb]" />
                  <div className="h-48 rounded bg-[#edf3fb]" />
                </div>
              ) : null}

              {!isReviewScreenLoading && isReviewScreenError ? (
                <div className="rounded-lg border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
                  {resolveApiErrorMessage(
                    reviewScreenError,
                    "We could not load the booking review screen right now."
                  )}
                </div>
              ) : null}

              {!isReviewScreenLoading && !isReviewScreenError ? (
                <NetReviewPanel
                  reviewStatus={reviewStatus}
                  reviewScreen={effectiveReviewScreen}
                />
              ) : null}
            </>
          ) : null}

          {phase === "net" && currentNetStep === "payment" ? (
            <>
              {isPaymentScreenLoading ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-8 w-60 rounded bg-[#e4edf8]" />
                  <div className="h-16 rounded bg-[#edf3fb]" />
                  <div className="h-12 rounded bg-[#edf3fb]" />
                  <div className="h-36 rounded bg-[#edf3fb]" />
                </div>
              ) : null}

              {!isPaymentScreenLoading && isPaymentScreenError ? (
                <div className="rounded-lg border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
                  {resolveApiErrorMessage(
                    paymentScreenError,
                    "We could not load the payment screen right now."
                  )}
                </div>
              ) : null}

              {!isPaymentScreenLoading && !isPaymentScreenError && paymentScreen ? (
                <NetPaymentPanel
                  screen={paymentScreen}
                  payment={payment}
                  onUpdatePayment={updatePayment}
                  submitError={paymentStepError}
                  isSubmitting={isSubmittingPayment}
                />
              ) : null}
            </>
          ) : null}

          {phase === "net" && currentNetStep === "confirmed" ? (
            <NetConfirmedPanel course={course} />
          ) : null}

          {phase === "registration" ? (
            <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#dbe7f4] pt-5">
              <div className="flex gap-3">
                {currentIndex > 0 ? (
                  <button
                    type="button"
                    onClick={moveBack}
                    className="rounded-lg border border-[#d8e5f4] bg-white px-4 py-2.5 text-sm font-medium text-[#384a77]"
                  >
                    Back to previous step
                  </button>
                ) : (
                  <Link
                    href="/dashboard/courses"
                    className="rounded-lg border border-[#d8e5f4] bg-white px-4 py-2.5 text-sm font-medium text-[#384a77]"
                  >
                    Cancel
                  </Link>
                )}
              </div>

              {currentStep === "privacy" ? (
                <button
                  type="button"
                  disabled={
                    !privacyConfirmed ||
                    isPrivacyFormLoading ||
                    isPrivacyFormError ||
                    isSavingEligibility ||
                    isSavingPrivacy
                  }
                  onClick={handlePrivacyContinue}
                  className={`rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-[0_12px_24px_rgba(30,166,223,0.2)] ${
                    privacyConfirmed &&
                    !isPrivacyFormLoading &&
                    !isPrivacyFormError &&
                    !isSavingEligibility &&
                    !isSavingPrivacy
                      ? "bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)]"
                      : "cursor-not-allowed bg-[#a6dff6]"
                  }`}
                >
                  {isSavingEligibility || isSavingPrivacy
                    ? "Saving..."
                    : registrationContinueLabel}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={moveNext}
                  disabled={
                    (currentStep === "candidate" &&
                      (isRegistrationFormLoading ||
                        isRegistrationFormError ||
                        isCreatingBooking)) ||
                    (currentStep === "assessment" &&
                      (isAssessmentFormLoading ||
                        isAssessmentFormError ||
                        isSavingAssessment)) ||
                    (currentStep === "employer" &&
                      (isEmployerFormLoading ||
                        isEmployerFormError ||
                        isSavingEmployer)) ||
                    (currentStep === "training" &&
                      (isTrainingFormLoading ||
                        isTrainingFormError ||
                        isSavingTraining))
                  }
                  className={`rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-[0_12px_24px_rgba(30,166,223,0.2)] ${
                    (currentStep === "candidate" &&
                      (isRegistrationFormLoading ||
                        isRegistrationFormError ||
                        isCreatingBooking)) ||
                    (currentStep === "assessment" &&
                      (isAssessmentFormLoading ||
                        isAssessmentFormError ||
                        isSavingAssessment)) ||
                    (currentStep === "employer" &&
                      (isEmployerFormLoading ||
                        isEmployerFormError ||
                        isSavingEmployer)) ||
                    (currentStep === "training" &&
                      (isTrainingFormLoading ||
                        isTrainingFormError ||
                        isSavingTraining))
                      ? "cursor-not-allowed bg-[#a6dff6]"
                    : "bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)]"
                  }`}
                >
                  {currentStep === "candidate" && isCreatingBooking
                    ? "Saving..."
                    : currentStep === "assessment" && isSavingAssessment
                    ? "Saving..."
                    : currentStep === "employer" && isSavingEmployer
                      ? "Saving..."
                      : currentStep === "training" && isSavingTraining
                        ? "Saving..."
                      : currentStep === "candidate"
                        ? registrationContinueLabel
                        : "Continue"}
                </button>
              )}
            </div>
          ) : null}

          {phase === "net" ? (
            <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#dbe7f4] pt-5">
              <button
                type="button"
                onClick={() => {
                  if (currentNetStep === "documents") {
                    setPhase("registration");
                    setCurrentStep("privacy");
                    router.replace(`/dashboard/courses/${course.slug}/book`);
                    return;
                  }

                  if (currentNetStep === "checklist") {
                    moveToNetStep("documents");
                    return;
                  }

                  if (currentNetStep === "signatures") {
                    moveToNetStep("checklist");
                    return;
                  }

                  if (currentNetStep === "submit") {
                    moveToNetStep("signatures");
                    return;
                  }

                  if (currentNetStep === "review") {
                    moveToNetStep("submit");
                    return;
                  }

                  if (currentNetStep === "payment") {
                    moveToNetStep("review", "approved");
                    return;
                  }

                  moveToNetStep("payment");
                }}
                className="rounded-lg border border-[#d8e5f4] bg-white px-4 py-2.5 text-sm font-medium text-[#384a77]"
              >
                Back
              </button>

              <div className="flex items-center gap-3">
                {currentNetStep === "submit" ? (
                  <button
                    type="button"
                    disabled={isSubmittingBookingForReview}
                    onClick={() => void handleSubmitForReview()}
                    className={`rounded-lg px-5 py-2.5 text-sm font-medium ${
                      isSubmittingBookingForReview
                        ? "cursor-not-allowed bg-[#dce4ec] text-[#9eacba]"
                        : "bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)] text-white shadow-[0_12px_24px_rgba(30,166,223,0.2)]"
                    }`}
                  >
                    {isSubmittingBookingForReview
                      ? "Submitting..."
                      : submitScreenData?.data.screen.actions?.submit?.label ||
                        "Submit Application"}
                  </button>
                ) : null}

                {currentNetStep === "review" ? (
                  <>
                    {!effectiveReviewScreen?.actions?.continue && reviewStatus === "pending" ? (
                      <button
                        type="button"
                        onClick={() => moveToNetStep("review", "approved")}
                        className="rounded-lg border border-[#d8e5f4] bg-white px-5 py-2.5 text-sm font-medium text-[#384a77]"
                      >
                        Mark as Approved
                      </button>
                    ) : null}

                      <button
                        type="button"
                      disabled={
                        effectiveReviewScreen
                          ? effectiveReviewScreen.actions?.continue?.enabled === false
                          : reviewStatus !== "approved"
                      }
                      onClick={() => moveToNetStep("payment")}
                      className={`rounded-lg px-5 py-2.5 text-sm font-medium ${
                        (effectiveReviewScreen
                          ? effectiveReviewScreen.actions?.continue?.enabled !== false
                          : reviewStatus === "approved")
                          ? "bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)] text-white shadow-[0_12px_24px_rgba(30,166,223,0.2)]"
                          : "cursor-not-allowed bg-[#dce4ec] text-[#9eacba]"
                      }`}
                    >
                      {effectiveReviewScreen?.actions?.continue?.label || "Proceed to Payment"}
                    </button>
                  </>
                ) : null}

                {currentNetStep === "payment" ? (
                  <button
                    type="button"
                    disabled={
                      isPaymentScreenLoading ||
                      isPaymentScreenError ||
                      isSubmittingPayment ||
                      !canSubmitNetPayment
                    }
                    onClick={() => void handleNetPayment()}
                    className={`rounded-lg px-5 py-2.5 text-sm font-medium ${
                      !isPaymentScreenLoading &&
                      !isPaymentScreenError &&
                      !isSubmittingPayment &&
                      canSubmitNetPayment
                        ? "bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)] text-white shadow-[0_12px_24px_rgba(30,166,223,0.2)]"
                        : "cursor-not-allowed bg-[#dce4ec] text-[#9eacba]"
                    }`}
                  >
                    {isSubmittingPayment
                      ? "Preparing payment..."
                      : paymentScreen?.actions?.pay?.label ||
                        `Pay ${paymentScreen?.summary.displayAmount ?? normalizeCurrency(course.price)}`}
                  </button>
                ) : null}

                {currentNetStep === "confirmed" ? (
                  <Link
                    href="/dashboard/bookings"
                    className="rounded-lg bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)] px-5 py-2.5 text-sm font-medium text-white shadow-[0_12px_24px_rgba(30,166,223,0.2)]"
                  >
                    View My Bookings
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </PanelCard>

      <SignatureUploadModal
        open={signatureModalOpen}
        title={
          signaturesScreenData?.data.screen.items.find((item) => item.id === "candidate")
            ?.modal?.title
        }
        onClose={() => setSignatureModalOpen(false)}
        onSubmit={handleCandidateSignatureSubmit}
        isSubmitting={isSubmittingCandidateSignature}
      />

      <AskForSignedModal
        open={providerRequestModalOpen}
        value={providerSignatureRequest}
        onChange={updateProviderSignatureRequest}
        onClose={() => setProviderRequestModalOpen(false)}
        onSubmit={handleTrainingProviderSignatureRequest}
        isSubmitting={isRequestingTrainingProviderSignature}
      />

      <NvqRegistrationDateModal
        open={nvqModalOpen}
        value={nvqTiming}
        onChange={setNvqTiming}
        onClose={() => setNvqModalOpen(false)}
        onContinue={handleNqvContinue}
        isSubmitting={isSavingEligibility || isFetchingAm2eChecklistFlow}
      />
    </div>
  );
}
