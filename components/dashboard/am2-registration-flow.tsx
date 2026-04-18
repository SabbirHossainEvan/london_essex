"use client";

import React from "react";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Mail,
  Phone,
} from "lucide-react";
import type { CourseSummary } from "@/app/(website)/courses/courses-data";
import PanelCard from "@/components/dashboard/panel-card";

type Am2RegistrationFlowProps = {
  course: CourseSummary;
};

type StepKey = "candidate" | "assessment" | "employer" | "training" | "privacy";

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

type TrainingFormState = {
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

const steps: Array<{ key: StepKey; label: string }> = [
  { key: "candidate", label: "Candidate" },
  { key: "assessment", label: "Assessment" },
  { key: "employer", label: "Employer" },
  { key: "training", label: "Training" },
  { key: "privacy", label: "Privacy" },
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

function Stepper({ currentStep }: { currentStep: StepKey }) {
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
                      ? "bg-[#17a85a] text-white"
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
}: {
  icon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
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
        className={`h-11 w-full rounded-lg border border-[#dde9f7] bg-[#eef7ff] pr-4 text-sm text-[#27396b] outline-none transition focus:border-[#28aee5] focus:bg-white ${
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

export default function Am2RegistrationFlow({
  course,
}: Am2RegistrationFlowProps) {
  const [currentStep, setCurrentStep] = React.useState<StepKey>("candidate");
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

  const currentIndex = steps.findIndex((step) => step.key === currentStep);

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
    setEmployer((current) => ({ ...current, [field]: value }));
  };

  const updateTraining = (field: keyof TrainingFormState, value: string) => {
    setTraining((current) => ({ ...current, [field]: value }));
  };

  const moveNext = () => {
    if (currentStep === "privacy") {
      return;
    }
    const nextStep = steps[currentIndex + 1];
    if (nextStep) {
      setCurrentStep(nextStep.key);
    }
  };

  const moveBack = () => {
    const previousStep = steps[currentIndex - 1];
    if (previousStep) {
      setCurrentStep(previousStep.key);
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

        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[#2d3f8f]">
          NET Candidate Registration Form
        </h1>
        <p className="mt-3 max-w-[920px] text-sm leading-6 text-[#667795]">
          Once this form is completed please return it to your assessment centre.
          All fields are mandatory. To view how NET uses candidate data please
          view our Privacy Policy at www.netservices.org.uk/policies
        </p>
      </div>

      <PanelCard className="rounded-[24px] border-[#d7e5f7] bg-[#eef6ff] p-4 sm:p-5">
        <Stepper currentStep={currentStep} />

        <div className="mt-5 rounded-[18px] border border-[#d7e5f7] bg-white/75 p-4 sm:p-5">
          {currentStep === "candidate" ? (
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

          {currentStep === "assessment" ? (
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
                  <RadioRow
                    name="assessment-type"
                    options={assessmentTypeOptions}
                    value={assessment.assessmentType}
                    onChange={(value) => updateAssessment("assessmentType", value)}
                    columns="md:grid-cols-3"
                  />
                </div>
              </div>
            </>
          ) : null}

          {currentStep === "employer" ? (
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
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Company Name *</FieldLabel>
                    <TextField
                      value={employer.companyName}
                      onChange={(value) => updateEmployer("companyName", value)}
                      placeholder="Enter employer company name"
                    />
                  </div>
                  <div>
                    <FieldLabel>Email *</FieldLabel>
                    <TextField
                      value={employer.email}
                      onChange={(value) => updateEmployer("email", value)}
                      placeholder="Enter employer email address"
                      type="email"
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
                    />
                  </div>
                  <div>
                    <FieldLabel>Contact Number *</FieldLabel>
                    <TextField
                      value={employer.contactNumber}
                      onChange={(value) => updateEmployer("contactNumber", value)}
                      placeholder="Enter employer mobile number"
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>Address 1 *</FieldLabel>
                  <TextField
                    value={employer.address1}
                    onChange={(value) => updateEmployer("address1", value)}
                    placeholder="Enter address line 1"
                  />
                </div>

                <div>
                  <FieldLabel>Address 2 *</FieldLabel>
                  <TextField
                    value={employer.address2}
                    onChange={(value) => updateEmployer("address2", value)}
                    placeholder="Enter address line 1"
                  />
                </div>

                <div>
                  <FieldLabel>Address 3 *</FieldLabel>
                  <TextField
                    value={employer.address3}
                    onChange={(value) => updateEmployer("address3", value)}
                    placeholder="Enter address line 1"
                  />
                </div>

                <div>
                  <FieldLabel>Address 4 *</FieldLabel>
                  <TextField
                    value={employer.address4}
                    onChange={(value) => updateEmployer("address4", value)}
                    placeholder="Enter address line 1"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <FieldLabel>Town *</FieldLabel>
                    <TextField
                      value={employer.town}
                      onChange={(value) => updateEmployer("town", value)}
                      placeholder="Enter town"
                    />
                  </div>
                  <div>
                    <FieldLabel>Postcode *</FieldLabel>
                    <TextField
                      value={employer.postcode}
                      onChange={(value) => updateEmployer("postcode", value)}
                      placeholder="Enter postcode"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {currentStep === "training" ? (
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

                <div>
                  <FieldLabel>Address 1</FieldLabel>
                  <TextField
                    value={training.address1}
                    onChange={(value) => updateTraining("address1", value)}
                    placeholder="Enter address line 1"
                  />
                </div>

                <div>
                  <FieldLabel>Address 2</FieldLabel>
                  <TextField
                    value={training.address2}
                    onChange={(value) => updateTraining("address2", value)}
                    placeholder="Enter address line 2"
                  />
                </div>

                <div>
                  <FieldLabel>Address 3</FieldLabel>
                  <TextField
                    value={training.address3}
                    onChange={(value) => updateTraining("address3", value)}
                    placeholder="Enter address line 3"
                  />
                </div>

                <div>
                  <FieldLabel>Address 4</FieldLabel>
                  <TextField
                    value={training.address4}
                    onChange={(value) => updateTraining("address4", value)}
                    placeholder="Enter address line 4"
                  />
                </div>

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

          {currentStep === "privacy" ? (
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
                  obligations. In accordance with our terms and conditions, in
                  cases of non-assessment maybe completed within 24 months of
                  commencement, WHO are required to retain your information until
                  the date of completed expiry which can be withheld from
                  collection if you identify. Specifically photographic retention
                  of those concerned with 24 months or 6 months after the 24
                  month period has expired. Other data is kept in accordance with
                  our data retention policy. For full details of NET&apos;s policy on
                  data protection please visit www.netservices.org.uk or the
                  website of your assigned Assessment Centre.
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
              <Link
                href="/dashboard/courses"
                aria-disabled={!privacyConfirmed}
                className={`rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-[0_12px_24px_rgba(30,166,223,0.2)] ${
                  privacyConfirmed
                    ? "bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)]"
                    : "pointer-events-none bg-[#a6dff6]"
                }`}
              >
                Continue
              </Link>
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
        </div>
      </PanelCard>
    </div>
  );
}
