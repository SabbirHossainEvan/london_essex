"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { CourseSummary } from "@/app/(website)/courses/courses-data";
import PanelCard from "@/components/dashboard/panel-card";

type Am2FullChecklistPageProps = {
  course: CourseSummary;
  flow: "am2" | "am2e" | "am2e-v1";
};

const netSteps = [
  { key: "documents", label: "Documents" },
  { key: "checklist", label: "Checklist" },
  { key: "signatures", label: "Signatures" },
  { key: "submit", label: "Submit" },
  { key: "review", label: "Review" },
  { key: "payment", label: "Payment" },
  { key: "confirmed", label: "Confirmed" },
] as const;

const checklistMeta = {
  am2: {
    title: "AM2 Checklist",
  },
  am2e: {
    title: "AM2E Checklist",
  },
  "am2e-v1": {
    title: "AM2E V1 Checklist",
  },
} as const;

type SectionKey = "a1" | "a2a5" | "a3a5" | "b" | "c" | "d" | "e";

type QuestionItem = {
  id: number;
  text: string;
  knowledge: "Extensive" | "Adequate" | "Limited" | "Unsure";
  experience: "Extensive" | "Adequate" | "Limited" | "Unsure";
};

type RatingOption = "Extensive" | "Adequate" | "Limited" | "Unsure";
type QuestionSelections = Record<
  SectionKey,
  Record<number, { knowledge: RatingOption | null; experience: RatingOption | null }>
>;

const sectionTabs: Array<{ key: SectionKey; label: string }> = [
  { key: "a1", label: "Section A1" },
  { key: "a2a5", label: "Sections A2-A5" },
  { key: "b", label: "Section B" },
  { key: "c", label: "Section C:" },
  { key: "d", label: "Section D" },
  { key: "e", label: "Section E" },
];

const sectionContent: Record<
  SectionKey,
  {
    title: string;
    description: string;
    questions: QuestionItem[];
  }
> = {
  a1: {
    title: "Section A1: Safe Isolation and Risk Assessment (45 mins)",
    description:
      "To demonstrate occupational competence candidates will be expected to:",
    questions: [
      {
        id: 1,
        text: "Carry out and document an assessment of risk",
        knowledge: "Extensive",
        experience: "Adequate",
      },
      {
        id: 2,
        text: "Carry out safe isolation in the correct sequence",
        knowledge: "Limited",
        experience: "Unsure",
      },
    ],
  },
  a2a5: {
    title: "Sections A2-A5: Composite Installation (8.5 hours)",
    description:
      "This section has areas where candidates will need to demonstrate occupational competence in accordance with statutory and non-statutory regulations and approved industry working practices.",
    questions: [
      {
        id: 1,
        text: "Interpretation of specifications and technical data",
        knowledge: "Limited",
        experience: "Limited",
      },
      {
        id: 2,
        text: "Selection of protective devices",
        knowledge: "Adequate",
        experience: "Adequate",
      },
      {
        id: 3,
        text: "Install protective equipotential bonding",
        knowledge: "Extensive",
        experience: "Extensive",
      },
      {
        id: 4,
        text: "Install and terminate PVC singles cable",
        knowledge: "Unsure",
        experience: "Unsure",
      },
      {
        id: 5,
        text: "Install and terminate PVC/PVC multi-core & cpc cable",
        knowledge: "Limited",
        experience: "Limited",
      },
      {
        id: 6,
        text: "Install and terminate SY multi-flex cable",
        knowledge: "Adequate",
        experience: "Adequate",
      },
      {
        id: 7,
        text: "Install and terminate heat-resistant flex",
        knowledge: "Limited",
        experience: "Unsure",
      },
      {
        id: 8,
        text: "Install and terminate XLPE SWA",
        knowledge: "Unsure",
        experience: "Limited",
      },
      {
        id: 9,
        text: "Install and terminate data-cable",
        knowledge: "Adequate",
        experience: "Limited",
      },
      {
        id: 10,
        text: "Install and terminate FP200 type cable",
        knowledge: "Limited",
        experience: "Adequate",
      },
      {
        id: 11,
        text: "Protective devices in a TP&N distribution board",
        knowledge: "Extensive",
        experience: "Adequate",
      },
      {
        id: 12,
        text: "Install a two-way and intermediate lighting circuit in PVC/PVC multi-core cable",
        knowledge: "Unsure",
        experience: "Unsure",
      },
      {
        id: 13,
        text: "Install a BS 1363 13A socket outlet ring circuit in PVC singles cable",
        knowledge: "Adequate",
        experience: "Adequate",
      },
      {
        id: 14,
        text: "Install a carbon monoxide detector safety service circuit in FP200 type cable",
        knowledge: "Limited",
        experience: "Limited",
      },
      {
        id: 15,
        text: "Install data outlets circuit in Cat. 5 cable",
        knowledge: "Adequate",
        experience: "Limited",
      },
      {
        id: 16,
        text: "Install a BS EN 60309 16A T P & N socket outlet in XLPE SWA cable",
        knowledge: "Limited",
        experience: "Adequate",
      },
      {
        id: 17,
        text: "Install protective equipotential bonding to gas and water services",
        knowledge: "Extensive",
        experience: "Adequate",
      },
      {
        id: 18,
        text: "Connect a 3-phase direct on line motor circuit in SY cable",
        knowledge: "Limited",
        experience: "Unsure",
      },
      {
        id: 19,
        text: "Install an S Plan central heating and hot water system with a solar thermal sustainable energy element utilising heat resistant flexible cable and PVC singles cable",
        knowledge: "Unsure",
        experience: "Limited",
      },
    ],
  },
  a3a5: {
    title: "Sections A3-A5",
    description:
      "This section is ready for the next checklist items.",
    questions: [],
  },
  b: {
    title: "Section B: Inspection, Testing and Certification (3.5 hours)",
    description:
      "In this area candidates will be expected to follow practices and procedures that take into account electrically sensitive equipment. To demonstrate occupational competence, candidates will be expected to:",
    questions: [
      {
        id: 1,
        text: "Work according to best practice as required by Health and Safety legislation",
        knowledge: "Adequate",
        experience: "Adequate",
      },
      {
        id: 2,
        text: "Ensure the installation is correctly isolated before commencing the inspection and test activity",
        knowledge: "Adequate",
        experience: "Adequate",
      },
      {
        id: 3,
        text: "Carry out a visual inspection of the installation in accordance with BS 7671 and IET Guidance Note 3",
        knowledge: "Adequate",
        experience: "Adequate",
      },
      {
        id: 4,
        text: "Continuity of protective conductors",
        knowledge: "Limited",
        experience: "Limited",
      },
      {
        id: 5,
        text: "Continuity of ring final circuit conductors",
        knowledge: "Limited",
        experience: "Limited",
      },
      {
        id: 6,
        text: "Insulation resistance",
        knowledge: "Adequate",
        experience: "Adequate",
      },
      {
        id: 7,
        text: "Polarity",
        knowledge: "Adequate",
        experience: "Adequate",
      },
      {
        id: 8,
        text: "Earth fault-loop impedance (EFLI)",
        knowledge: "Adequate",
        experience: "Limited",
      },
      {
        id: 9,
        text: "Prospective fault current (PFC)",
        knowledge: "Adequate",
        experience: "Limited",
      },
      {
        id: 10,
        text: "Check for phase sequence and phase rotation",
        knowledge: "Limited",
        experience: "Unsure",
      },
      {
        id: 11,
        text: "Functional testing",
        knowledge: "Adequate",
        experience: "Adequate",
      },
      {
        id: 12,
        text: "Verify that the test results obtained conform to the values required by BS 7671 and IET Guidance Note 3",
        knowledge: "Extensive",
        experience: "Adequate",
      },
      {
        id: 13,
        text: "Complete an electrical installation certificate, schedule of inspections and schedule of test results using the model forms as illustrated in Appendix 6 of BS 7671",
        knowledge: "Extensive",
        experience: "Adequate",
      },
    ],
  },
  c: {
    title: "Section C: Safe Isolation of Circuits (30 mins)",
    description:
      "To demonstrate occupational competence candidates will be expected to:",
    questions: [
      {
        id: 1,
        text: "Carry out safe isolation in the correct sequence on a single-phase circuit",
        knowledge: "Adequate",
        experience: "Adequate",
      },
      {
        id: 2,
        text: "Carry out safe isolation in the correct sequence on a three-phase circuit",
        knowledge: "Adequate",
        experience: "Limited",
      },
      {
        id: 3,
        text: "Carry out safe isolation in the correct sequence on a three-phase installation",
        knowledge: "Limited",
        experience: "Unsure",
      },
    ],
  },
  d: {
    title: "Section D: Fault Diagnosis and Rectification (2 hours)",
    description:
      "To demonstrate occupational competence candidates will be expected to:",
    questions: [
      {
        id: 1,
        text: "Work according to best practice as required by Health and Safety legislation",
        knowledge: "Adequate",
        experience: "Adequate",
      },
      {
        id: 2,
        text: "Correctly identify and use tools, equipment and test instruments that are fit for purpose",
        knowledge: "Adequate",
        experience: "Adequate",
      },
      {
        id: 3,
        text: "Carry out checks and preparations that must be completed prior to undertaking fault diagnosis",
        knowledge: "Adequate",
        experience: "Limited",
      },
      {
        id: 4,
        text: "Identify faults from 'fault symptom' information given by the assessor",
        knowledge: "Limited",
        experience: "Unsure",
      },
      {
        id: 5,
        text: "State and record how the identified faults can be rectified",
        knowledge: "Adequate",
        experience: "Adequate",
      },
    ],
  },
  e: {
    title: "Section E: Assessment of Applied Knowledge (1 hour)",
    description:
      "This assessment will last for one hour and be in the form of a computerised multiple-choice test. Candidates will be expected to answer 30 questions and will be assessed on their application of knowledge associated with:",
    questions: [
      {
        id: 1,
        text: "Health and Safety",
        knowledge: "Adequate",
        experience: "Adequate",
      },
      {
        id: 2,
        text: "BS 7671: Requirements for Electrical Installations",
        knowledge: "Adequate",
        experience: "Limited",
      },
      {
        id: 3,
        text: "Building Regulations",
        knowledge: "Limited",
        experience: "Limited",
      },
      {
        id: 4,
        text: "Inspection, Testing and Fault Finding",
        knowledge: "Adequate",
        experience: "Adequate",
      },
    ],
  },
};

function Stepper() {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-center gap-3">
        {netSteps.map((step, index) => {
          const isDone = index < 1;
          const isActive = index === 1;

          return (
            <React.Fragment key={step.key}>
              <div className="flex items-center gap-2">
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold ${
                    isDone || isActive
                      ? "bg-[#1ea6df] text-white"
                      : "bg-[#e6edf8] text-[#8a97b2]"
                  }`}
                >
                  {isDone ? "1" : index + 1}
                </span>
                <span
                  className={`text-xs font-medium ${
                    isDone || isActive ? "text-[#32439b]" : "text-[#9aa7be]"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < netSteps.length - 1 ? (
                <div className="h-px w-16 bg-[#d7e2f2]" />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function ChoicePill({
  label,
  tone,
  onClick,
}: {
  label: string;
  tone: "green" | "yellow" | "red" | "neutral";
  onClick: () => void;
}) {
  const toneClass =
    tone === "green"
      ? "border-[#8be2a8] bg-[#effcf3] text-[#1c8f53]"
      : tone === "yellow"
        ? "border-[#f4ce7a] bg-[#fff7df] text-[#9f6a00]"
        : tone === "red"
          ? "border-[#f4a4a4] bg-[#fff1f1] text-[#bf3d3d]"
          : "border-[#dbe5f2] bg-[#f7faff] text-[#667895]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-w-[66px] items-center justify-center rounded-md border px-3 py-1.5 text-xs font-medium ${toneClass}`}
    >
      {label}
    </button>
  );
}

function formatSectionCount(completed: number, total: number) {
  return `${completed}/${total}`;
}

export default function Am2FullChecklistPage({
  course,
  flow,
}: Am2FullChecklistPageProps) {
  const router = useRouter();
  const meta = checklistMeta[flow];
  const [activeSection, setActiveSection] = React.useState<SectionKey>("a1");
  const [questionSelections, setQuestionSelections] = React.useState<QuestionSelections>(() => {
    return Object.fromEntries(
      (Object.entries(sectionContent) as Array<
        [SectionKey, (typeof sectionContent)[SectionKey]]
      >).map(([sectionKey, section]) => [
        sectionKey,
        Object.fromEntries(
          section.questions.map((question) => [
            question.id,
            {
              knowledge: null,
              experience: null,
            },
          ])
        ),
      ])
    ) as QuestionSelections;
  });
  const activeSectionIndex = sectionTabs.findIndex(
    (section) => section.key === activeSection
  );
  const currentSection = sectionContent[activeSection];
  const sectionCounts = Object.fromEntries(
    sectionTabs.map((section) => {
      const questions = sectionContent[section.key].questions;
      const total = questions.length;
      const completed = questions.reduce((count, question) => {
        const selection = questionSelections[section.key]?.[question.id];
        return selection?.knowledge || selection?.experience ? count + 1 : count;
      }, 0);

      return [section.key, formatSectionCount(completed, total)];
    })
  ) as Record<SectionKey, string>;
  const overallTotals = sectionTabs.reduce(
    (totals, section) => {
      const questions = sectionContent[section.key].questions;
      const answered = questions.reduce((count, question) => {
        const selection = questionSelections[section.key]?.[question.id];
        return selection?.knowledge || selection?.experience ? count + 1 : count;
      }, 0);

      return {
        answered: totals.answered + answered,
        total: totals.total + questions.length,
      };
    },
    { answered: 0, total: 0 }
  );
  const overallPercent =
    overallTotals.total === 0
      ? 0
      : Math.round((overallTotals.answered / overallTotals.total) * 100);
  const isChecklistComplete =
    overallTotals.total > 0 && overallTotals.answered === overallTotals.total;

  const moveToNextSection = () => {
    if (activeSectionIndex === sectionTabs.length - 1 && isChecklistComplete) {
      router.push(
        `/dashboard/courses/${course.slug}/book?flow=${flow}&netStep=signatures`
      );
      return;
    }

    const nextSection = sectionTabs[activeSectionIndex + 1];
    if (nextSection) {
      setActiveSection(nextSection.key);
    }
  };

  const updateSelection = (
    sectionKey: SectionKey,
    questionId: number,
    field: "knowledge" | "experience",
    value: RatingOption
  ) => {
    setQuestionSelections((current) => ({
      ...current,
      [sectionKey]: {
        ...current[sectionKey],
        [questionId]: {
          ...current[sectionKey][questionId],
          [field]: value,
        },
      },
    }));
  };

  const renderQuestionMatrix = (
    sectionKey: SectionKey,
    question: QuestionItem,
    field: "knowledge" | "experience"
  ) => {
    const options: RatingOption[] = ["Limited", "Adequate", "Extensive", "Unsure"];

    return options.map((option) => {
      const selected =
        questionSelections[sectionKey]?.[question.id]?.[field] === option;
      const tone =
        option === "Extensive" || option === "Adequate"
          ? "green"
          : option === "Limited"
            ? "yellow"
            : "red";

      return (
        <ChoicePill
          key={`${field}-${option}`}
          label={option}
          tone={selected ? tone : "neutral"}
          onClick={() => updateSelection(sectionKey, question.id, field, option)}
        />
      );
    });
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
      </div>

      <PanelCard className="rounded-[24px] border-[#d7e5f7] bg-[#eef6ff] p-4 sm:p-5">
        <Stepper />

        <div className="mt-5 rounded-[18px] border border-[#d7e5f7] bg-white/75 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[1.4rem] font-semibold text-[#3849a0]">
                {meta.title}
              </h1>
              <p className="mt-2 text-sm text-[#7a88a3]">
                Complete your {meta.title.toLowerCase()}.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-md border border-[#d8e5f4] bg-white px-4 py-2 text-xs font-medium text-[#384a77]"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={moveToNextSection}
                disabled={
                  activeSectionIndex === sectionTabs.length - 1 &&
                  !isChecklistComplete
                }
                className="rounded-md bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)] px-4 py-2 text-xs font-medium text-white"
              >
                {activeSectionIndex === sectionTabs.length - 1
                  ? "Continue to Signatures"
                  : "Next Section"}
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-[14px] border border-[#d7e5f7] bg-[#eaf5ff] p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-[#7a88a3]">Overall Completion</span>
              <span className="text-xs text-[#7a88a3]">{overallPercent}%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white">
              <div
                className="h-2 rounded-full bg-[#1ea6df] transition-all"
                style={{ width: `${overallPercent}%` }}
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-5 border-b border-[#cfe0f2] pb-3 text-xs font-medium text-[#5b6d8e]">
              {sectionTabs.map((section) => (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => setActiveSection(section.key)}
                  className={`border-b-2 pb-2 transition ${
                    activeSection === section.key
                      ? "border-[#1ea6df] text-[#32439b]"
                      : "border-transparent text-[#5b6d8e]"
                  }`}
                >
                  {sectionCounts[section.key]} {section.label}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-[#d5e6f5] bg-[#dff1fd] px-4 py-4">
              <h2 className="text-lg font-semibold text-[#3849a0]">
                {currentSection.title}
              </h2>
              <p className="mt-2 text-sm text-[#5f7492]">
                {currentSection.description}
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {currentSection.questions.map((question) => (
                <div
                  key={question.id}
                  className="rounded-xl border border-[#4db6ef] bg-white px-4 py-4"
                >
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px_240px] lg:items-center">
                    <div className="flex gap-3">
                      <span className="mt-1 grid h-5 w-5 place-items-center rounded-full bg-[#eef5fd] text-[11px] font-semibold text-[#5c6f96]">
                        {question.id}
                      </span>
                      <p className="text-sm text-[#32439b]">{question.text}</p>
                    </div>

                    <div>
                      <p className="mb-2 text-center text-xs font-medium text-[#6f819f]">
                        Knowledge Level
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {renderQuestionMatrix(activeSection, question, "knowledge")}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-center text-xs font-medium text-[#6f819f]">
                        Experience Level
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {renderQuestionMatrix(activeSection, question, "experience")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {currentSection.questions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#cfe0f2] bg-white px-4 py-8 text-center text-sm text-[#6f819f]">
                  This section is ready for the next checklist items.
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={moveToNextSection}
                disabled={
                  activeSectionIndex === sectionTabs.length - 1 &&
                  !isChecklistComplete
                }
                className={`rounded-md px-4 py-2 text-xs font-medium ${
                  activeSectionIndex === sectionTabs.length - 1 &&
                  !isChecklistComplete
                    ? "cursor-not-allowed bg-[#dce4ec] text-[#9eacba]"
                    : "bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)] text-white"
                }`}
              >
                {activeSectionIndex === sectionTabs.length - 1
                  ? "Continue to Signatures"
                  : "Next Section"}
              </button>
            </div>
          </div>
        </div>
      </PanelCard>
    </div>
  );
}
