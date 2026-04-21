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
} from "lucide-react";
import type { CourseSummary } from "@/app/(website)/courses/courses-data";
import PanelCard from "@/components/dashboard/panel-card";

type Am2RegistrationFlowProps = {
  course: CourseSummary;
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
type NvqTiming = "before-september-2023" | "after-september-2023";
type EmployerStatus = "yes" | "no";
type DocumentRequirement = {
  id: string;
  title: string;
  description: string;
  initiallyUploaded?: boolean;
};
type UploadedDocumentState = {
  fileName: string;
};

const registrationSteps: Array<{ key: RegistrationStepKey; label: string }> = [
  { key: "candidate", label: "Candidate" },
  { key: "assessment", label: "Assessment" },
  { key: "employer", label: "Employer" },
  { key: "training", label: "Training" },
  { key: "privacy", label: "Privacy" },
];

const netSteps: Array<{ key: NetStepKey; label: string }> = [
  { key: "documents", label: "Documents" },
  { key: "checklist", label: "Checklist" },
  { key: "signatures", label: "Signatures" },
  { key: "submit", label: "Submit" },
  { key: "review", label: "Review" },
  { key: "payment", label: "Payment" },
  { key: "confirmed", label: "Confirmed" },
];

const fundingOptions = [
  "England 16-18 Apprenticeship funded",
  "England 19+ Apprenticeship funded",
  "Other Funding Method",
];

const awardingBodyOptions = ["City & Guilds", "EAL", "N/A", "Other"];

const assessmentTypeOptions = [
  "AM2",
  "AM2E",
  "AM2S v1.0",
  "AM2ED",
  "AM2D",
  "Cable Jointing",
  "AM2E v1.1",
  "AM2S v1.1 / 1.2",
  "AM2SN",
];

const am2eEligibleQualifications = new Set([
  "(EWA) City & Guilds 2346",
  "EAL 603/5982/1",
]);

const netFlowContent: Record<
  NetFlowType,
  {
    documentsTitle: string;
    documentsSubtitle: string;
    checklistTitle: string;
    checklistSubtitle: string;
    requirements: DocumentRequirement[];
  }
> = {
  am2: {
    documentsTitle: "AM2 Readiness Checklist",
    documentsSubtitle: "for those who don't already hold AM2",
    checklistTitle: "AM2 Checklist",
    checklistSubtitle:
      "Readiness for Assessment: Candidate Self-Assessment Checklist",
    requirements: [
      {
        id: "learner-history",
        title: "Learner History Report or Walled Garden Report (City & Guilds)",
        description: "Requested from your NVQ provider",
      },
    ],
  },
  am2e: {
    documentsTitle: "AM2E Checklist",
    documentsSubtitle:
      "This required document must be uploaded for the assessment.",
    checklistTitle: "AM2E Checklist",
    checklistSubtitle:
      "Readiness for Assessment: Candidate Self-Assessment Checklist",
    requirements: [
      {
        id: "ewq-certificate",
        title: "The Experienced Worker Qualification Certificate",
        description:
          "Certificate must show City & Guilds 2346 or EAL 603/5982/1",
        initiallyUploaded: true,
      },
      {
        id: "learner-history",
        title:
          "City & Guilds Walled Garden Report or EAL Learner History Report",
        description: "Both must confirm your NVQ provider",
      },
      {
        id: "still-in-scope",
        title: "Still In Scope (Sep 2023)",
        description:
          "Skills Scan dated September 2023 onwards will be required if out of scope for two years",
      },
    ],
  },
  "am2e-v1": {
    documentsTitle: "AM2E V1 Checklist",
    documentsSubtitle:
      "The required documents must be uploaded for the assessment.",
    checklistTitle: "AM2E V1 Checklist",
    checklistSubtitle:
      "Readiness for Assessment: Candidate Self-Assessment Checklist",
    requirements: [
      {
        id: "ewq-certificate",
        title: "The Experienced Worker Qualification Certificate",
        description:
          "Certificate must show City & Guilds 2346 or EAL 603/5982/1",
        initiallyUploaded: true,
      },
      {
        id: "learner-history",
        title:
          "City & Guilds Walled Garden Report or EAL Learner History Report",
        description: "Both must confirm your NVQ provider",
      },
      {
        id: "still-in-scope",
        title: "Still In Scope (Sep 2023)",
        description:
          "Skills Scan dated September 2023 onwards will be required if out of scope for two years",
      },
      {
        id: "technical-certificate",
        title: "Level 2 or Level 3 Technical Certificate",
        description:
          "For example City & Guilds 2365/5357 or EAL equivalent",
      },
    ],
  },
};

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
  flow,
  uploadedDocuments,
  onUpload,
  onContinue,
}: {
  flow: NetFlowType;
  uploadedDocuments: Map<string, UploadedDocumentState>;
  onUpload: (id: string, file: File) => void;
  onContinue: () => void;
}) {
  const content = netFlowContent[flow];
  const allRequiredUploaded = content.requirements.every((item) => {
    if (item.initiallyUploaded) {
      return true;
    }

    return uploadedDocuments.has(item.id);
  });

  const acceptedDocumentTypes =
    ".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.rtf,.odt,.ods,.zip,.jpg,.jpeg,.png,.webp";

  const handleFileChange = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    onUpload(id, file);
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
          {content.documentsTitle}
        </h3>
        <p className="mt-1 text-xs text-[#6c7f9d]">{content.documentsSubtitle}</p>

        <div className="mt-5 rounded-lg border border-[#f2c463] bg-[#fffaf1] px-4 py-3 text-sm text-[#8f6413]">
          You must upload all required documents before proceeding.
        </div>

        <div className="mt-4 space-y-3">
          {content.requirements.map((item) => {
            const uploadedDocument = uploadedDocuments.get(item.id);
            const isUploaded = item.initiallyUploaded || Boolean(uploadedDocument);

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
                    {uploadedDocument ? (
                      <p className="mt-2 text-xs font-medium text-[#1f8f54]">
                        Selected file: {uploadedDocument.fileName}
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
                      onChange={(event) => handleFileChange(item.id, event)}
                    />
                    {isUploaded ? "Re-uploaded" : "Upload"}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#dbe7f4] pt-5">
        <button
          type="button"
          disabled={!allRequiredUploaded}
          onClick={onContinue}
          className={`rounded-lg px-5 py-2.5 text-sm font-medium text-white ${
            allRequiredUploaded
              ? "bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)] shadow-[0_12px_24px_rgba(30,166,223,0.2)]"
              : "cursor-not-allowed bg-[#dce6ef]"
          }`}
        >
          Continue
        </button>
      </div>
    </>
  );
}

function NetChecklistPanel({ flow }: { flow: NetFlowType }) {
  const content = netFlowContent[flow];

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[1rem] font-semibold text-[#3849a0]">
            {content.checklistTitle}
          </h2>
          <p className="mt-1 text-xs text-[#7a88a3]">{content.checklistSubtitle}</p>
        </div>
        <button
          type="button"
          className="text-sm font-semibold text-[#4451ac]"
        >
          Important Information
        </button>
      </div>

      <div className="mt-5 rounded-[14px] border border-[#d7e5f7] bg-[#eaf5ff] p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs text-[#7a88a3]">Overall Completion</span>
          <span className="text-xs text-[#7a88a3]">0%</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-white">
          <div className="h-2 w-0 rounded-full bg-[#1ea6df]" />
        </div>

        <div className="mt-5 rounded-lg border border-[#d5e6f5] bg-[#dff1fd] px-4 py-3 text-sm text-[#46627d]">
          Complete all sections of the checklist. You can use the full checklist
          page for a detailed view.
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px]">
          <Link
            href={`/dashboard/courses/am2-assessment-preparation/book/full-checklist?flow=${flow}`}
            className="rounded-lg border border-[#d3dfef] bg-white px-4 py-3 text-sm font-medium text-[#2f407f]"
          >
            Open Full Checklist
          </Link>
          <button
            type="button"
            className="rounded-lg bg-[#dce4ec] px-4 py-3 text-sm font-medium text-[#9eacba]"
          >
            Continue
          </button>
        </div>
      </div>
    </>
  );
}

function NetSignaturesPanel({
  candidateSigned,
  providerSigned,
  onCandidateSign,
  onProviderRequest,
  onContinue,
}: {
  candidateSigned: boolean;
  providerSigned: boolean;
  onCandidateSign: () => void;
  onProviderRequest: () => void;
  onContinue: () => void;
}) {
  const allSigned = candidateSigned && providerSigned;

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[1rem] font-semibold text-[#3849a0]">
            Michael Johnson
          </h2>
          <p className="mt-1 text-xs text-[#7a88a3]">
            Readiness for Assessment: Candidate Self-Assessment Checklist
          </p>
        </div>
        <button
          type="button"
          className="text-sm font-semibold text-[#4451ac]"
        >
          Important Information
        </button>
      </div>

      <div className="mt-5 rounded-[14px] border border-[#d7e5f7] bg-[#eaf5ff] p-4">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-[#d5e6f5] bg-[#f4fbff] px-4 py-3">
          <span className="text-sm text-[#50637f]">Step 1 of 2</span>
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
                  Candidates
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
                {candidateSigned ? "View" : "Submit Signature"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-[#dbe7f4] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-[#4451ac]">
                  <PenTool className="h-4 w-4" />
                  Training Provider
                </p>
                <p
                  className={`mt-3 flex items-center gap-2 text-xs ${
                    providerSigned ? "text-[#1e9d57]" : "text-[#8b97ac]"
                  }`}
                >
                  {providerSigned ? (
                    <CircleCheckBig className="h-4 w-4" />
                  ) : (
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-[#ffe8ea] text-[10px] text-[#d55465]">
                      x
                    </span>
                  )}
                  {providerSigned ? "Signed" : "not Signed"}
                </p>
              </div>

              <button
                type="button"
                onClick={onProviderRequest}
                className="rounded-lg border border-[#d5e2f2] bg-white px-4 py-2 text-xs font-medium text-[#4451ac]"
              >
                {providerSigned ? "View" : "Ask for signed"}
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
            Continue
          </button>
        </div>
      </div>
    </>
  );
}

function NetSubmitPanel() {
  return (
    <>
      <div>
        <h2 className="text-[1rem] font-semibold text-[#3849a0]">
          Review & Submit
        </h2>
        <p className="mt-1 text-xs text-[#7a88a3]">
          Review your application before submitting to the admin for approval.
        </p>
      </div>

      <div className="mt-5 rounded-[14px] border border-[#d7e5f7] bg-[#eaf5ff] p-4">
        <div className="rounded-lg border border-[#f2c463] bg-[#fffaf1] px-4 py-3 text-sm text-[#8f6413]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#f59e0b]" />
            <p>
              Once submitted, the admin will review your documents, checklist,
              and signatures. You&apos;ll be notified when your application is
              approved and you can proceed to payment.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {[
            {
              label: "NET Candidate Registration Form",
              status: "Uploaded",
            },
            {
              label: "AM2 Checklist",
              status: "Completed",
            },
            {
              label: "Candidate Signature",
              status: "Signed",
            },
            {
              label: "Training Provider Signature",
              status: "Signed",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-3 rounded-xl border border-[#dbe7f4] bg-white px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#e8f8ee] text-[#16a34a]">
                  <FileText className="h-4.5 w-4.5" />
                </span>
                <p className="text-sm font-medium text-[#32439b]">{item.label}</p>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-medium text-[#16a34a]">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function NetReviewPanel({
  reviewStatus,
}: {
  reviewStatus: ReviewStatus;
}) {
  const isApproved = reviewStatus === "approved";

  return (
    <>
      <div>
        <h2 className="text-[1rem] font-semibold text-[#3849a0]">
          Admin Review
        </h2>
        <p className="mt-1 text-xs text-[#7a88a3]">
          Your application is being reviewed by the admin team.
        </p>
      </div>

      <div className="mt-5 rounded-[14px] border border-[#d7e5f7] bg-[#eaf5ff] p-4">
        <div className="rounded-lg border border-[#f2c463] bg-[#fffaf1] px-4 py-3 text-sm text-[#8f6413]">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#f59e0b]" />
            <p>
              Once submitted, the admin will review your documents, checklist,
              and signatures. You&apos;ll be notified when your application is
              approved and you can proceed to payment.
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
              {isApproved ? "Application Approved!" : "Under Review"}
            </p>
            <p className="mt-3 max-w-[540px] text-sm leading-6 text-[#7a88a3]">
              {isApproved
                ? "The admin has reviewed and approved your documents, checklist, and signatures. You can now proceed to payment."
                : "Admin is currently reviewing your application. You&apos;ll be notified once it has been approved."}
            </p>
            <span
              className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                isApproved
                  ? "bg-[#dcfce7] text-[#16a34a]"
                  : "bg-[#e0f2fe] text-[#0284c7]"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {isApproved ? "Approved" : "Under Review"}
            </span>
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

function NetPaymentPanel({
  payment,
  onUpdatePayment,
}: {
  payment: PaymentFormState;
  onUpdatePayment: (
    field: keyof PaymentFormState,
    value: string | boolean
  ) => void;
}) {
  return (
    <>
      <div>
        <h2 className="text-[1rem] font-semibold text-[#3849a0]">
          Complete Payment
        </h2>
        <p className="mt-1 text-xs text-[#7a88a3]">
          Your application is approved. Complete payment to secure your place.
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
              checked={payment.acceptedTerms}
              onChange={(event) =>
                onUpdatePayment("acceptedTerms", event.target.checked)
              }
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
}: {
  open: boolean;
  value: NvqTiming;
  onChange: (value: NvqTiming) => void;
  onClose: () => void;
  onContinue: () => void;
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
                    key: "before-september-2023" as const,
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
              onClick={onClose}
              className="rounded-xl border border-[#d8e5f4] bg-white px-8 py-3 text-base font-medium text-[#384a77]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onContinue}
              className="rounded-xl bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)] px-8 py-3 text-base font-medium text-white shadow-[0_12px_24px_rgba(30,166,223,0.2)]"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Am2RegistrationFlow({
  course,
}: Am2RegistrationFlowProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    apprentice: "Yes",
    uln: "",
    funding: "",
    awardingBody: "",
    adjustments: "No",
    recognition: "No",
    assessmentType: "AM2",
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
  const [employerStepError, setEmployerStepError] = React.useState("");
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
  const [uploadedDocuments, setUploadedDocuments] = React.useState<
    Map<string, UploadedDocumentState>
  >(
    new Map()
  );
  const [nvqModalOpen, setNvqModalOpen] = React.useState(false);
  const [nvqTiming, setNvqTiming] =
    React.useState<NvqTiming>("before-september-2023");
  const [candidateSigned, setCandidateSigned] = React.useState(false);
  const [providerSigned, setProviderSigned] = React.useState(false);
  const [reviewStatus, setReviewStatus] =
    React.useState<ReviewStatus>("pending");
  const [payment, setPayment] = React.useState<PaymentFormState>({
    acceptedTerms: false,
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const selectedQualification = searchParams.get("qualification") ?? "";
  const requestedFlow = searchParams.get("flow");
  const requestedNetStep = searchParams.get("netStep");
  const requestedReviewStatus = searchParams.get("reviewStatus");
  const lockedAssessmentType = am2eEligibleQualifications.has(selectedQualification)
    ? "AM2E"
    : "AM2";

  React.useEffect(() => {
    setAssessment((current) => ({
      ...current,
      assessmentType: lockedAssessmentType,
    }));
  }, [lockedAssessmentType]);

  React.useEffect(() => {
    const initialUploads = netFlowContent[netFlowType].requirements
      .filter((item) => item.initiallyUploaded)
      .map((item) => item.id);

    setUploadedDocuments(
      new Map(
        initialUploads.map((id) => [
          id,
          {
            fileName: "Previously uploaded document",
          },
        ])
      )
    );
  }, [netFlowType]);

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

  const currentIndex = registrationSteps.findIndex(
    (step) => step.key === currentStep
  );

  const updateCandidate = (field: keyof CandidateFormState, value: string) => {
    setCandidate((current) => ({ ...current, [field]: value }));
  };

  const updateAssessment = (
    field: keyof AssessmentFormState,
    value: string
  ) => {
    setAssessment((current) => ({ ...current, [field]: value }));
  };

  const updateEmployer = (field: keyof EmployerFormState, value: string) => {
    setEmployerStepError("");
    setEmployer((current) => ({ ...current, [field]: value }));
  };

  const updateTraining = (field: keyof TrainingFormState, value: string) => {
    setTraining((current) => ({ ...current, [field]: value }));
  };

  const updatePayment = (
    field: keyof PaymentFormState,
    value: string | boolean
  ) => {
    setPayment((current) => ({ ...current, [field]: value }));
  };

  const isPaymentComplete =
    payment.acceptedTerms &&
    payment.cardNumber.replace(/\s/g, "").length === 16 &&
    payment.expiry.replace(/\D/g, "").length === 4 &&
    payment.cvc.length >= 3;

  const selectAssessmentType = (value: string) => {
    if (value !== lockedAssessmentType) {
      return;
    }

    updateAssessment("assessmentType", value);
  };

  const moveNext = () => {
    if (currentStep === "employer") {
      if (hasEmployer === "no") {
        setEmployerStepError("");
      } else {
        const employerValues = Object.values(employer).map((value) => value.trim());
        const hasMissingEmployerField = employerValues.some((value) => value.length === 0);

        if (hasMissingEmployerField) {
          setEmployerStepError(
            "Please complete all employer fields, or select No if you are self-employed or do not have an employer."
          );
          return;
        }
      }
    }

    const nextStep = registrationSteps[currentIndex + 1];
    if (nextStep) {
      setCurrentStep(nextStep.key);
    }
  };

  const moveBack = () => {
    const previousStep = registrationSteps[currentIndex - 1];
    if (previousStep) {
      setCurrentStep(previousStep.key);
    }
  };

  const startNetFlow = (flowType: NetFlowType) => {
    setNetFlowType(flowType);
    setPhase("net");
    setCurrentNetStep("documents");
  };

  const handlePrivacyContinue = () => {
    if (am2eEligibleQualifications.has(selectedQualification)) {
      setNvqModalOpen(true);
      return;
    }

    startNetFlow("am2");
  };

  const handleNqvContinue = () => {
    setNvqModalOpen(false);
    startNetFlow(
      nvqTiming === "before-september-2023" ? "am2e" : "am2e-v1"
    );
  };

  const handleUploadDocument = (id: string, file: File) => {
    setUploadedDocuments((current) => {
      const next = new Map(current);
      next.set(id, { fileName: file.name });
      return next;
    });
  };

  const handleSignaturesContinue = () => {
    setCurrentNetStep("submit");
    router.replace(
      `/dashboard/courses/${course.slug}/book?flow=${netFlowType}&netStep=submit`
    );
  };

  const syncNetRoute = React.useCallback(
    (step: NetStepKey, nextReviewStatus?: ReviewStatus) => {
      const params = new URLSearchParams();
      params.set("flow", netFlowType);
      params.set("netStep", step);

      if (nextReviewStatus) {
        params.set("reviewStatus", nextReviewStatus);
      }

      router.replace(`/dashboard/courses/${course.slug}/book?${params.toString()}`);
    },
    [course.slug, netFlowType, router]
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
              NET Candidate Registration Form
            </h1>
            <p className="mt-3 max-w-[920px] text-sm leading-6 text-[#667795]">
              Once this form is completed please return it to your assessment centre.
              All fields are mandatory. To view how NET uses candidate data please
              view our Privacy Policy at www.netservices.org.uk/policies
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
            steps={registrationSteps}
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
          {phase === "registration" && currentStep === "candidate" ? (
            <>
              <div>
                <h2 className="text-[1.6rem] font-semibold text-[#3849a0]">
                  Candidate Details
                </h2>
                <p className="mt-2 text-sm text-[#7a88a3]">
                  Please complete all fields. All fields in this section are
                  mandatory.
                </p>
              </div>

              <div className="mt-5 grid gap-4">
                <div>
                  <FieldLabel>Title *</FieldLabel>
                  <TextField
                    value={candidate.title}
                    onChange={(value) => updateCandidate("title", value)}
                    placeholder="Enter title"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>First Name *</FieldLabel>
                    <TextField
                      value={candidate.firstName}
                      onChange={(value) => updateCandidate("firstName", value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <FieldLabel>Last Name *</FieldLabel>
                    <TextField
                      value={candidate.lastName}
                      onChange={(value) => updateCandidate("lastName", value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Date of Birth *</FieldLabel>
                    <TextField
                      icon={<CalendarDays className="h-4 w-4" />}
                      value={candidate.dob}
                      onChange={(value) => updateCandidate("dob", value)}
                      placeholder="mm/dd/yyyy"
                    />
                  </div>
                  <div>
                    <FieldLabel>NI Number *</FieldLabel>
                    <TextField
                      value={candidate.niNumber}
                      onChange={(value) => updateCandidate("niNumber", value)}
                      placeholder="Enter NI Number"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Email *</FieldLabel>
                    <TextField
                      icon={<Mail className="h-4 w-4" />}
                      value={candidate.email}
                      onChange={(value) => updateCandidate("email", value)}
                      placeholder="Enter email address"
                      type="email"
                    />
                  </div>
                  <div>
                    <FieldLabel>Mobile Number *</FieldLabel>
                    <TextField
                      icon={<Phone className="h-4 w-4" />}
                      value={candidate.mobileNumber}
                      onChange={(value) => updateCandidate("mobileNumber", value)}
                      placeholder="Enter mobile number"
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>Address 1 *</FieldLabel>
                  <TextField
                    value={candidate.address1}
                    onChange={(value) => updateCandidate("address1", value)}
                    placeholder="Enter address line 1"
                  />
                </div>

                <div>
                  <FieldLabel>Address 2 *</FieldLabel>
                  <TextField
                    value={candidate.address2}
                    onChange={(value) => updateCandidate("address2", value)}
                    placeholder="Enter address line 2"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Town *</FieldLabel>
                    <TextField
                      value={candidate.town}
                      onChange={(value) => updateCandidate("town", value)}
                      placeholder="Enter town"
                    />
                  </div>
                  <div>
                    <FieldLabel>Postcode *</FieldLabel>
                    <TextField
                      value={candidate.postcode}
                      onChange={(value) => updateCandidate("postcode", value)}
                      placeholder="Enter postcode"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {phase === "registration" && currentStep === "assessment" ? (
            <>
              <div>
                <h2 className="text-[1.6rem] font-semibold text-[#3849a0]">
                  Assessment & Registration Details
                </h2>
                <p className="mt-2 text-sm text-[#7a88a3]">
                  Please complete all fields.
                </p>
              </div>

              <div className="mt-5 grid gap-5">
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
                  <div>
                    <FieldLabel>Apprentice *</FieldLabel>
                    <RadioRow
                      name="apprentice"
                      options={["Yes", "No"]}
                      value={assessment.apprentice}
                      onChange={(value) => updateAssessment("apprentice", value)}
                    />
                  </div>
                  <div>
                    <FieldLabel>U.L.N.</FieldLabel>
                    <TextField
                      value={assessment.uln}
                      onChange={(value) => updateAssessment("uln", value)}
                      placeholder="Enter U.L.N."
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>Funding *</FieldLabel>
                  <RadioRow
                    name="funding"
                    options={fundingOptions}
                    value={assessment.funding}
                    onChange={(value) => updateAssessment("funding", value)}
                    columns="md:grid-cols-3"
                  />
                </div>

                <div>
                  <FieldLabel>Awarding Body</FieldLabel>
                  <RadioRow
                    name="awarding-body"
                    options={awardingBodyOptions}
                    value={assessment.awardingBody}
                    onChange={(value) => updateAssessment("awardingBody", value)}
                    columns="md:grid-cols-4"
                  />
                </div>

                <div>
                  <FieldLabel>
                    Does the candidate require any reasonable adjustments? *
                  </FieldLabel>
                  <RadioRow
                    name="adjustments"
                    options={["Yes", "No"]}
                    value={assessment.adjustments}
                    onChange={(value) => updateAssessment("adjustments", value)}
                  />
                  <p className="mt-2 text-xs leading-5 text-[#8795af]">
                    If Yes, the Reasonable Adjustments Request Form must be
                    submitted and evidence provided.
                  </p>
                </div>

                <div>
                  <FieldLabel>Recognition of Prior Learning *</FieldLabel>
                  <RadioRow
                    name="recognition"
                    options={["Yes", "No"]}
                    value={assessment.recognition}
                    onChange={(value) => updateAssessment("recognition", value)}
                  />
                </div>

                <div>
                  <FieldLabel>Type of assessment</FieldLabel>
                  <div className="grid gap-3 md:grid-cols-3">
                    {assessmentTypeOptions.map((option) => {
                      const checked = assessment.assessmentType === option;
                      const disabled = option !== lockedAssessmentType;

                      return (
                        <label
                          key={option}
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
                            name="assessment-type"
                            checked={checked}
                            disabled={disabled}
                            onChange={() => selectAssessmentType(option)}
                            className="h-4 w-4 accent-[#1ea6df]"
                          />
                          <span>{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {phase === "registration" && currentStep === "employer" ? (
            <>
              <div>
                <h2 className="text-[1.6rem] font-semibold text-[#3849a0]">
                  Current Employer
                </h2>
                <p className="mt-2 text-sm text-[#7a88a3]">
                  Please complete all fields.
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

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Company Name *</FieldLabel>
                    <TextField
                      value={employer.companyName}
                      onChange={(value) => updateEmployer("companyName", value)}
                      placeholder="Enter employer company name"
                      disabled={hasEmployer === "no"}
                    />
                  </div>
                  <div>
                    <FieldLabel>Email *</FieldLabel>
                    <TextField
                      value={employer.email}
                      onChange={(value) => updateEmployer("email", value)}
                      placeholder="Enter employer email address"
                      type="email"
                      disabled={hasEmployer === "no"}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Contact Name *</FieldLabel>
                    <TextField
                      value={employer.contactName}
                      onChange={(value) => updateEmployer("contactName", value)}
                      placeholder="Enter employer contact name"
                      disabled={hasEmployer === "no"}
                    />
                  </div>
                  <div>
                    <FieldLabel>Contact Number *</FieldLabel>
                    <TextField
                      value={employer.contactNumber}
                      onChange={(value) => updateEmployer("contactNumber", value)}
                      placeholder="Enter employer mobile number"
                      disabled={hasEmployer === "no"}
                    />
                  </div>
                </div>

                {["address1", "address2", "address3", "address4"].map((field, index) => (
                  <div key={field}>
                    <FieldLabel>{`Address ${index + 1} *`}</FieldLabel>
                    <TextField
                      value={employer[field as keyof EmployerFormState] as string}
                      onChange={(value) =>
                        updateEmployer(field as keyof EmployerFormState, value)
                      }
                      placeholder={`Enter address line ${index + 1}`}
                      disabled={hasEmployer === "no"}
                    />
                  </div>
                ))}

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Town *</FieldLabel>
                    <TextField
                      value={employer.town}
                      onChange={(value) => updateEmployer("town", value)}
                      placeholder="Enter town"
                      disabled={hasEmployer === "no"}
                    />
                  </div>
                  <div>
                    <FieldLabel>Postcode *</FieldLabel>
                    <TextField
                      value={employer.postcode}
                      onChange={(value) => updateEmployer("postcode", value)}
                      placeholder="Enter postcode"
                      disabled={hasEmployer === "no"}
                    />
                  </div>
                </div>

                {employerStepError ? (
                  <p className="rounded-lg border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
                    {employerStepError}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}

          {phase === "registration" && currentStep === "training" ? (
            <>
              <div>
                <h2 className="text-[1.6rem] font-semibold text-[#3849a0]">
                  Training Provider / Certificate Issuer
                </h2>
                <p className="mt-2 text-sm text-[#7a88a3]">
                  Please enter the details of the training provider or college
                  where you gained the qualifications to enable you to apply for
                  this assessment. This section is mandatory. Please complete all
                  fields.
                </p>
              </div>

              <div className="mt-5 grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Company Name</FieldLabel>
                    <TextField
                      value={training.companyName}
                      onChange={(value) => updateTraining("companyName", value)}
                      placeholder="Enter training provider or college name"
                    />
                  </div>
                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <TextField
                      value={training.email}
                      onChange={(value) => updateTraining("email", value)}
                      placeholder="Enter provider email"
                      type="email"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Contact Name</FieldLabel>
                    <TextField
                      value={training.contactName}
                      onChange={(value) => updateTraining("contactName", value)}
                      placeholder="Enter contact name"
                    />
                  </div>
                  <div>
                    <FieldLabel>Contact Number</FieldLabel>
                    <TextField
                      value={training.contactNumber}
                      onChange={(value) => updateTraining("contactNumber", value)}
                      placeholder="Enter contact number"
                    />
                  </div>
                </div>

                {["address1", "address2", "address3", "address4"].map((field, index) => (
                  <div key={field}>
                    <FieldLabel>{`Address ${index + 1}`}</FieldLabel>
                    <TextField
                      value={training[field as keyof TrainingFormState] as string}
                      onChange={(value) =>
                        updateTraining(field as keyof TrainingFormState, value)
                      }
                      placeholder={`Enter address line ${index + 1}`}
                    />
                  </div>
                ))}

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Town</FieldLabel>
                    <TextField
                      value={training.town}
                      onChange={(value) => updateTraining("town", value)}
                      placeholder="Enter town"
                    />
                  </div>
                  <div>
                    <FieldLabel>Postcode</FieldLabel>
                    <TextField
                      value={training.postcode}
                      onChange={(value) => updateTraining("postcode", value)}
                      placeholder="Enter postcode"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {phase === "registration" && currentStep === "privacy" ? (
            <>
              <div>
                <h2 className="text-[1.6rem] font-semibold text-[#3849a0]">
                  Privacy Notice & Confirmation
                </h2>
              </div>

              <div className="mt-5 space-y-4 text-sm leading-6 text-[#6e7f9b]">
                <p>
                  NET and the Assessment Centre you attend are both Data
                  Controllers for the purposes of Data Protection Law. Where
                  applicable they will jointly uphold your rights. Information
                  that you include in this form is necessary for the completion
                  of your assessment and will only be shared between the
                  Controllers for this purpose or if the provision of legal
                  obligations. In accordance with our terms and conditions, data
                  may be retained in line with the applicable retention policy.
                </p>

                <label className="flex items-start gap-3 rounded-lg border border-[#dde9f7] bg-[#f4f9ff] px-4 py-3 text-[#33446d]">
                  <input
                    type="checkbox"
                    checked={privacyConfirmed}
                    onChange={(event) => setPrivacyConfirmed(event.target.checked)}
                    className="mt-1 h-4 w-4 accent-[#1ea6df]"
                  />
                  <span>
                    I confirm that the information provided in this registration
                    form is complete and accurate.
                  </span>
                </label>
              </div>
            </>
          ) : null}

          {phase === "net" && currentNetStep === "documents" ? (
            <NetDocumentsPanel
              flow={netFlowType}
              uploadedDocuments={uploadedDocuments}
              onUpload={handleUploadDocument}
              onContinue={() => setCurrentNetStep("checklist")}
            />
          ) : null}

          {phase === "net" && currentNetStep === "checklist" ? (
            <NetChecklistPanel flow={netFlowType} />
          ) : null}

          {phase === "net" && currentNetStep === "signatures" ? (
            <NetSignaturesPanel
              candidateSigned={candidateSigned}
              providerSigned={providerSigned}
              onCandidateSign={() => setCandidateSigned(true)}
              onProviderRequest={() => setProviderSigned(true)}
              onContinue={handleSignaturesContinue}
            />
          ) : null}

          {phase === "net" && currentNetStep === "submit" ? (
            <NetSubmitPanel />
          ) : null}

          {phase === "net" && currentNetStep === "review" ? (
            <NetReviewPanel reviewStatus={reviewStatus} />
          ) : null}

          {phase === "net" && currentNetStep === "payment" ? (
            <NetPaymentPanel payment={payment} onUpdatePayment={updatePayment} />
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
                  disabled={!privacyConfirmed}
                  onClick={handlePrivacyContinue}
                  className={`rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-[0_12px_24px_rgba(30,166,223,0.2)] ${
                    privacyConfirmed
                      ? "bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)]"
                      : "cursor-not-allowed bg-[#a6dff6]"
                  }`}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={moveNext}
                  className="rounded-lg bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)] px-5 py-2.5 text-sm font-medium text-white shadow-[0_12px_24px_rgba(30,166,223,0.2)]"
                >
                  Continue
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
                    onClick={() => moveToNetStep("review", "pending")}
                    className="rounded-lg bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)] px-5 py-2.5 text-sm font-medium text-white shadow-[0_12px_24px_rgba(30,166,223,0.2)]"
                  >
                    Submit Application
                  </button>
                ) : null}

                {currentNetStep === "review" ? (
                  <>
                    {reviewStatus === "pending" ? (
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
                      disabled={reviewStatus !== "approved"}
                      onClick={() => moveToNetStep("payment")}
                      className={`rounded-lg px-5 py-2.5 text-sm font-medium ${
                        reviewStatus === "approved"
                          ? "bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)] text-white shadow-[0_12px_24px_rgba(30,166,223,0.2)]"
                          : "cursor-not-allowed bg-[#dce4ec] text-[#9eacba]"
                      }`}
                    >
                      Proceed to Payment
                    </button>
                  </>
                ) : null}

                {currentNetStep === "payment" ? (
                  <button
                    type="button"
                    disabled={!isPaymentComplete}
                    onClick={() => moveToNetStep("confirmed")}
                    className={`rounded-lg px-5 py-2.5 text-sm font-medium ${
                      isPaymentComplete
                        ? "bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)] text-white shadow-[0_12px_24px_rgba(30,166,223,0.2)]"
                        : "cursor-not-allowed bg-[#dce4ec] text-[#9eacba]"
                    }`}
                  >
                    Pay {normalizeCurrency(course.price)}
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

      <NvqRegistrationDateModal
        open={nvqModalOpen}
        value={nvqTiming}
        onChange={setNvqTiming}
        onClose={() => setNvqModalOpen(false)}
        onContinue={handleNqvContinue}
      />
    </div>
  );
}
