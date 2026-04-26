"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { CourseSummary } from "@/app/(website)/courses/courses-data";
import PanelCard from "@/components/dashboard/panel-card";
import {
  type GetAm2eChecklistFlowByCourseResponse,
  type GetBookingFlowChecklistFullResponse,
  useLazyGetAm2eChecklistFlowByCourseQuery,
  useGetBookingFlowChecklistFullQuery,
  useSaveBookingChecklistDraftMutation,
} from "@/lib/redux/features/bookings/booking-api";

type Am2FullChecklistPageProps = {
  course: CourseSummary;
  flow: "am2" | "am2e" | "am2e-v1";
  bookingId?: string;
  courseId?: string;
  section?: string;
};

type ChecklistScreen =
  GetBookingFlowChecklistFullResponse["data"]["screen"];

type ChecklistItem = ChecklistScreen["activeSection"]["items"][number];

type ChecklistOption = {
  id: string;
  label: string;
};

type ChecklistResponseField = "knowledgeLevel" | "experienceLevel";

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

  const match = value.match(/\/bookings\/([^/]+)/i);
  return match?.[1] ?? "";
}

function extractSectionFromApiUrl(value?: string | null) {
  if (!value) {
    return "";
  }

  try {
    const url = new URL(value, "http://localhost");
    return url.searchParams.get("section") ?? "";
  } catch {
    const match = value.match(/[?&]section=([^&]+)/i);
    return match?.[1] ? decodeURIComponent(match[1]) : "";
  }
}

function buildQueryString({
  flow,
  bookingId,
  courseId,
  section,
}: {
  flow: Am2FullChecklistPageProps["flow"];
  bookingId?: string;
  courseId?: string;
  section?: string;
}) {
  const params = new URLSearchParams();
  params.set("flow", flow);

  if (bookingId) {
    params.set("bookingId", bookingId);
  }

  if (courseId) {
    params.set("courseId", courseId);
  }

  if (section) {
    params.set("section", section);
  }

  return params.toString();
}

function Stepper({
  steps,
}: {
  steps: ChecklistScreen["steps"];
}) {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-center gap-3">
        {steps.map((step, index) => {
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";

          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2">
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold ${
                    isCompleted || isCurrent
                      ? "bg-[#1ea6df] text-white"
                      : "bg-[#e6edf8] text-[#8a97b2]"
                  }`}
                >
                  {index + 1}
                </span>
                <span
                  className={`text-xs font-medium ${
                    isCompleted || isCurrent
                      ? "text-[#32439b]"
                      : "text-[#9aa7be]"
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

function ChoicePill({
  label,
  tone,
  selected,
  onClick,
}: {
  label: string;
  tone: "green" | "yellow" | "red";
  selected: boolean;
  onClick?: () => void;
}) {
  const selectedClass =
    tone === "green"
      ? "border-[#8be2a8] bg-[#effcf3] text-[#1c8f53]"
      : tone === "yellow"
        ? "border-[#f4ce7a] bg-[#fff7df] text-[#9f6a00]"
        : "border-[#f4a4a4] bg-[#fff1f1] text-[#bf3d3d]";
  const idleClass = "border-[#dbe5f2] bg-[#f7faff] text-[#667895]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-w-[72px] items-center justify-center rounded-md border px-3 py-1.5 text-xs font-medium transition ${
        selected ? selectedClass : idleClass
      }`}
    >
      {label}
    </button>
  );
}

function resolveTone(optionId: string) {
  if (optionId === "extensive" || optionId === "adequate") {
    return "green";
  }

  if (optionId === "limited") {
    return "yellow";
  }

  return "red";
}

function renderOptionGroup({
  options,
  selectedValue,
  onSelect,
}: {
  options: ChecklistOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => (
        <ChoicePill
          key={option.id}
          label={option.label}
          tone={resolveTone(option.id)}
          selected={selectedValue === option.id}
          onClick={() => onSelect(option.id)}
        />
      ))}
    </div>
  );
}

type Am2eChecklistFlowData =
  GetAm2eChecklistFlowByCourseResponse["data"];

function getNvqAnswerForChecklistFlow(
  flow: Am2FullChecklistPageProps["flow"]
) {
  return flow === "am2e"
    ? "before-3rd-september-2023"
    : flow === "am2e-v1"
      ? "after-september-2023"
      : null;
}

function mapAm2eFlowToFullChecklistScreen({
  flowData,
  flow,
  requestedSection,
}: {
  flowData: Am2eChecklistFlowData;
  flow: Am2FullChecklistPageProps["flow"];
  requestedSection: string;
}): ChecklistScreen {
  const meta = checklistMeta[flow];
  const sections = flowData.flow.checklistSections ?? [];
  const activeSource =
    sections.find(
      (entry) =>
        entry.key.trim().toUpperCase() === requestedSection.trim().toUpperCase()
    ) ||
    sections[0];
  const activeSection = activeSource
    ? {
        id: activeSource.id,
        key: activeSource.key,
        title: activeSource.title,
        summary: activeSource.summary,
        duration: activeSource.duration,
        completedItems: 0,
        totalItems: activeSource.totalItems,
        items: activeSource.items.map((item) => ({
          ...item,
          completed: false,
        })),
      }
    : {
        id: "section-a1",
        key: "A1",
        title: "Section A1",
        completedItems: 0,
        totalItems: 0,
        items: [],
      };

  return {
    steps: flowData.flow.steps.map((step) => ({
      id: step.id,
      label: step.label,
      status:
        step.id === "documents"
          ? "completed"
          : step.id === "checklist"
            ? "current"
            : "upcoming",
    })),
    title: meta.title,
    subtitle: `Complete your ${meta.title}.`,
    overallCompletion: flowData.flow.checklistSummary?.overallCompletion ?? 0,
    actions: {
      saveDraft: {
        label: "Save Draft",
      },
      nextSection: {
        label: "Next Section",
      },
    },
    sections: sections.map((entry) => ({
      id: entry.id,
      key: entry.key,
      label: entry.label,
      completedItems: 0,
      totalItems: entry.totalItems,
      active: entry.key === activeSection.key,
    })),
    activeSection,
  };
}

function FullChecklistContent({
  course,
  flow,
  bookingId,
  courseId,
  screen,
  onScreenChange,
}: {
  course: CourseSummary;
  flow: Am2FullChecklistPageProps["flow"];
  bookingId: string;
  courseId?: string;
  screen: ChecklistScreen;
  onScreenChange: React.Dispatch<React.SetStateAction<ChecklistScreen | null>>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const meta = checklistMeta[flow];
  const displayTitle = flow === "am2" ? screen.title || meta.title : meta.title;
  const displaySubtitle =
    flow === "am2"
      ? screen.subtitle || `Complete your ${meta.title.toLowerCase()}.`
      : `Complete your ${meta.title}.`;
  const [saveDraft, { isLoading: isSavingDraft }] =
    useSaveBookingChecklistDraftMutation();
  const [saveMessage, setSaveMessage] = React.useState("");
  const [saveError, setSaveError] = React.useState("");
  const [isNavigatingSection, setIsNavigatingSection] = React.useState(false);
  const nextSectionKey = extractSectionFromApiUrl(
    screen.actions?.nextSection?.apiUrl
  );
  const signaturesHref = `/dashboard/courses/${course.slug}/book?${buildQueryString({
    flow,
    bookingId,
    courseId,
  })}&netStep=signatures`;

  const navigateToSection = React.useCallback(
    (targetSection: string) => {
      router.replace(
        `${pathname}?${buildQueryString({
          flow,
          bookingId,
          courseId,
          section: targetSection,
        })}`
      );
    },
    [bookingId, courseId, flow, pathname, router]
  );

  const updateItemSelection = React.useCallback(
    (
      itemId: string,
      field: ChecklistResponseField,
      value: string
    ) => {
      onScreenChange((current) => {
        if (!current) {
          return current;
        }

        const nextItems = current.activeSection.items.map((item) => {
          if (item.id !== itemId) {
            return item;
          }

          const nextItem = {
            ...item,
            [field]: value,
          };

          return {
            ...nextItem,
            completed: Boolean(
              nextItem.knowledgeLevel && nextItem.experienceLevel
            ),
          };
        });
        const completedItems = nextItems.filter((item) => item.completed).length;
        const answeredPairs = nextItems.reduce((count, item) => {
          return (
            count +
            (item.knowledgeLevel ? 1 : 0) +
            (item.experienceLevel ? 1 : 0)
          );
        }, 0);

        return {
          ...current,
          overallCompletion: answeredPairs,
          sections: current.sections.map((entry) =>
            entry.key === current.activeSection.key
              ? {
                  ...entry,
                  completedItems,
                }
              : entry
          ),
          activeSection: {
            ...current.activeSection,
            completedItems,
            items: nextItems,
          },
        };
      });
      setSaveMessage("");
      setSaveError("");
    },
    [onScreenChange]
  );

  const persistCurrentSection = React.useCallback(async () => {
    setSaveMessage("");
    setSaveError("");

    const responses = screen.activeSection.items.map((item) => ({
      itemId: item.id,
      knowledgeLevel: item.knowledgeLevel ?? "",
      experienceLevel: item.experienceLevel ?? "",
    }));

    try {
      const response = await saveDraft({
        bookingId,
        section: screen.activeSection.key,
        responses,
      }).unwrap();

      if (flow === "am2") {
        onScreenChange(response.data.screen);
      }
      setSaveMessage(response.message || "Checklist draft saved successfully.");
      return flow === "am2" ? response.data.screen : screen;
    } catch (saveDraftError) {
      setSaveError(
        resolveApiErrorMessage(
          saveDraftError,
          "We could not save the checklist draft right now."
        )
      );
      return null;
    }
  }, [
    bookingId,
    flow,
    onScreenChange,
    saveDraft,
    screen,
  ]);

  const handleSaveDraft = React.useCallback(async () => {
    await persistCurrentSection();
  }, [persistCurrentSection]);

  const handleSectionNavigation = React.useCallback(async (targetSection: string) => {
    setIsNavigatingSection(true);
    const savedScreen = await persistCurrentSection();

    if (savedScreen) {
      navigateToSection(targetSection);
    }

    setIsNavigatingSection(false);
  }, [navigateToSection, persistCurrentSection]);

  const handleNextSection = React.useCallback(async () => {
    setIsNavigatingSection(true);
    const savedScreen = await persistCurrentSection();

    if (!savedScreen) {
      setIsNavigatingSection(false);
      return;
    }

    if (nextSectionKey) {
      navigateToSection(nextSectionKey);
      setIsNavigatingSection(false);
      return;
    }

    router.push(signaturesHref);
    setIsNavigatingSection(false);
  }, [navigateToSection, nextSectionKey, persistCurrentSection, router, signaturesHref]);

  return (
    <PanelCard className="rounded-[24px] border-[#d7e5f7] bg-[#eef6ff] p-4 sm:p-5">
      <Stepper steps={screen.steps} />

      <div className="mt-5 rounded-[18px] border border-[#d7e5f7] bg-white/75 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[1.4rem] font-semibold text-[#3849a0]">
              {displayTitle}
            </h1>
            {displaySubtitle ? (
              <p className="mt-2 text-sm text-[#7a88a3]">
                {displaySubtitle}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isSavingDraft || isNavigatingSection}
              onClick={handleSaveDraft}
              className={`rounded-md border border-[#d8e5f4] bg-white px-4 py-2 text-xs font-medium ${
                isSavingDraft || isNavigatingSection
                  ? "cursor-wait text-[#9eacba]"
                  : "text-[#384a77]"
              }`}
            >
              {isSavingDraft || isNavigatingSection
                ? "Saving..."
                : screen.actions?.saveDraft?.label || "Save Draft"}
            </button>
            <button
              type="button"
              onClick={handleNextSection}
              disabled={isSavingDraft || isNavigatingSection}
              className="rounded-md bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)] px-4 py-2 text-xs font-medium text-white"
            >
              {isNavigatingSection
                ? "Saving..."
                : screen.actions?.nextSection?.label || "Next Section"}
            </button>
          </div>
        </div>

        {saveMessage ? (
          <div className="mt-4 rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-sm text-[#15803d]">
            {saveMessage}
          </div>
        ) : null}

        {saveError ? (
          <div className="mt-4 rounded-lg border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
            {saveError}
          </div>
        ) : null}

        <div className="mt-5 rounded-[14px] border border-[#d7e5f7] bg-[#eaf5ff] p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-[#7a88a3]">Overall Completion</span>
            <span className="text-xs text-[#7a88a3]">
              {screen.overallCompletion}%
            </span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white">
            <div
              className="h-2 rounded-full bg-[#1ea6df] transition-all"
              style={{ width: `${screen.overallCompletion}%` }}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-5 border-b border-[#cfe0f2] pb-3 text-xs font-medium text-[#5b6d8e]">
            {screen.sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => void handleSectionNavigation(section.key)}
                disabled={isSavingDraft || isNavigatingSection}
                className={`border-b-2 pb-2 transition ${
                  section.active
                    ? "border-[#1ea6df] text-[#32439b]"
                    : "border-transparent text-[#5b6d8e]"
                }`}
              >
                {section.completedItems}/{section.totalItems} {section.label}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-[#d5e6f5] bg-[#dff1fd] px-4 py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-[#3849a0]">
                {screen.activeSection.title}
              </h2>
              {screen.activeSection.duration ? (
                <span className="text-sm font-medium text-[#5f7492]">
                  {screen.activeSection.duration}
                </span>
              ) : null}
            </div>
            {screen.activeSection.summary ? (
              <p className="mt-2 text-sm text-[#5f7492]">
                {screen.activeSection.summary}
              </p>
            ) : null}
          </div>

          <div className="mt-4 space-y-3">
            {screen.activeSection.items.map((item: ChecklistItem) => (
              <div
                key={item.id}
                className="rounded-xl border border-[#4db6ef] bg-white px-4 py-4"
              >
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px_240px] lg:items-center">
                  <div className="flex gap-3">
                    <span className="mt-1 grid h-5 w-5 place-items-center rounded-full bg-[#eef5fd] text-[11px] font-semibold text-[#5c6f96]">
                      {item.no}
                    </span>
                    <div>
                      <p className="text-sm text-[#32439b]">{item.criterion}</p>
                      {!item.completed ? (
                        <p className="mt-1 text-xs text-[#8a97b2]">
                          Not completed yet
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-center text-xs font-medium text-[#6f819f]">
                      Knowledge Level
                    </p>
                    {renderOptionGroup({
                      options: item.options.knowledge,
                      selectedValue: item.knowledgeLevel,
                      onSelect: (value) =>
                        updateItemSelection(item.id, "knowledgeLevel", value),
                    })}
                  </div>

                  <div>
                    <p className="mb-2 text-center text-xs font-medium text-[#6f819f]">
                      Experience Level
                    </p>
                    {renderOptionGroup({
                      options: item.options.experience,
                      selectedValue: item.experienceLevel,
                      onSelect: (value) =>
                        updateItemSelection(item.id, "experienceLevel", value),
                    })}
                  </div>
                </div>
              </div>
            ))}

            {screen.activeSection.items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#cfe0f2] bg-white px-4 py-8 text-center text-sm text-[#6f819f]">
                No checklist items were returned for this section.
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleNextSection}
              disabled={isSavingDraft || isNavigatingSection}
              className="rounded-md bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)] px-4 py-2 text-xs font-medium text-white"
            >
              {isNavigatingSection
                ? "Saving..."
                : screen.actions?.nextSection?.label || "Next Section"}
            </button>
          </div>
        </div>
      </div>
    </PanelCard>
  );
}

export default function Am2FullChecklistPage({
  course,
  flow,
  bookingId = "",
  courseId = "",
  section = "A1",
}: Am2FullChecklistPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [getAm2eChecklistFlowByCourse] = useLazyGetAm2eChecklistFlowByCourseQuery();
  const [am2eFlowData, setAm2eFlowData] =
    React.useState<Am2eChecklistFlowData | null>(null);
  const [am2eFlowError, setAm2eFlowError] = React.useState<unknown>(null);
  const [isAm2eFlowLoading, setIsAm2eFlowLoading] = React.useState(false);
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetBookingFlowChecklistFullQuery(
    { bookingId, section },
    { skip: !bookingId || flow !== "am2" }
  );
  const previewCourseId = courseId || course.id || "";
  const screen = React.useMemo(
    () =>
      flow === "am2"
        ? data?.data.screen
        : am2eFlowData
          ? mapAm2eFlowToFullChecklistScreen({
              flowData: am2eFlowData,
              flow,
              requestedSection: section,
            })
          : null,
    [am2eFlowData, data?.data, flow, section]
  );
  const [editableScreen, setEditableScreen] = React.useState<ChecklistScreen | null>(
    null
  );
  const normalizedSection = section.trim().toUpperCase();
  const isShowingRequestedSection =
    editableScreen?.activeSection.key?.trim().toUpperCase() === normalizedSection;
  const isSectionTransitioning =
    Boolean(bookingId) &&
    ((flow === "am2" && (isLoading || isFetching)) ||
      (flow !== "am2" && isAm2eFlowLoading) ||
      !isShowingRequestedSection);

  React.useEffect(() => {
    if (flow === "am2") {
      setAm2eFlowData(null);
      setAm2eFlowError(null);
      return;
    }

    const answerId = getNvqAnswerForChecklistFlow(flow);

    if (!answerId || !previewCourseId) {
      return;
    }

    setIsAm2eFlowLoading(true);
    setAm2eFlowError(null);
    getAm2eChecklistFlowByCourse({
      variant: flow,
      courseId: previewCourseId,
      questionId: "nvq-registration-date",
      answerId,
    })
      .unwrap()
      .then((response) => {
        setAm2eFlowData(response.data);
      })
      .catch((errorResponse) => {
        setAm2eFlowError(errorResponse);
      })
      .finally(() => {
        setIsAm2eFlowLoading(false);
      });
  }, [flow, getAm2eChecklistFlowByCourse, previewCourseId]);

  React.useEffect(() => {
    setEditableScreen(null);
  }, [bookingId, flow, normalizedSection]);

  React.useEffect(() => {
    if (screen) {
      setEditableScreen(screen);
    }
  }, [screen]);

  React.useEffect(() => {
    if (!editableScreen) {
      return;
    }

    const nextBookingId =
      extractBookingIdFromApiUrl(editableScreen.actions?.saveDraft?.apiUrl) ||
      extractBookingIdFromApiUrl(editableScreen.actions?.nextSection?.apiUrl) ||
      editableScreen.sections
        .map((entry) => extractBookingIdFromApiUrl(entry.apiUrl))
        .find(Boolean) ||
      bookingId;

    if (nextBookingId === bookingId) {
      return;
    }

    router.replace(
      `${pathname}?${buildQueryString({
        flow,
        bookingId: nextBookingId,
        courseId: previewCourseId,
        section,
      })}`
    );
  }, [bookingId, editableScreen, flow, pathname, previewCourseId, router, section]);

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

      {!bookingId ? (
        <PanelCard className="rounded-[24px] border-[#fecaca] bg-[#fff3f3] p-5 text-sm text-[#dc2626]">
          We could not determine a booking id for this checklist.
        </PanelCard>
      ) : null}

      {bookingId && isSectionTransitioning ? (
        <PanelCard className="rounded-[24px] border-[#d7e5f7] bg-[#eef6ff] p-5">
          <div className="space-y-4 animate-pulse">
            <div className="h-6 w-56 rounded bg-[#e4edf8]" />
            <div className="h-5 w-80 rounded bg-[#edf3fb]" />
            <div className="h-16 rounded bg-[#edf3fb]" />
            <div className="h-52 rounded bg-[#edf3fb]" />
          </div>
        </PanelCard>
      ) : null}

      {bookingId && !isSectionTransitioning && isError ? (
        <PanelCard className="rounded-[24px] border-[#fecaca] bg-[#fff3f3] p-5 text-sm text-[#dc2626]">
          {resolveApiErrorMessage(
            error,
            "We could not load the booking full checklist right now."
          )}
        </PanelCard>
      ) : null}

      {bookingId && !isSectionTransitioning && flow !== "am2" && am2eFlowError ? (
        <PanelCard className="rounded-[24px] border-[#fecaca] bg-[#fff3f3] p-5 text-sm text-[#dc2626]">
          {resolveApiErrorMessage(
            am2eFlowError,
            "We could not load the AM2E full checklist right now."
          )}
        </PanelCard>
      ) : null}

      {bookingId &&
      !isSectionTransitioning &&
      !isError &&
      !am2eFlowError &&
      editableScreen ? (
        <FullChecklistContent
          course={course}
          flow={flow}
          bookingId={bookingId}
          courseId={previewCourseId}
          screen={editableScreen}
          onScreenChange={setEditableScreen}
        />
      ) : null}
    </div>
  );
}
