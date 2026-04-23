"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import type { CourseSummary } from "@/app/(website)/courses/courses-data";
import CourseCard from "@/components/website/course-card";
import { useAppSelector } from "@/lib/redux/hooks";
import type {
  CourseDetailBookingModalStep,
  CourseDetailBreadcrumb,
} from "@/lib/redux/features/courses/course-api";
import { useLazyGetCourseBookNowQuery } from "@/lib/redux/features/courses/course-api";

type CourseDetailsContentProps = {
  course: CourseSummary;
  relatedCourses: CourseSummary[];
  coursesHrefBasePath?: string;
  bookingHrefBasePath?: string;
  defaultSelectedImageIndex?: number;
  onBookNow?: () => void;
  dashboardMode?: boolean;
  breadcrumbs?: CourseDetailBreadcrumb[];
  bookingModal?: {
    title: string;
    cancelLabel?: string;
    confirmLabel?: string;
    initialStepId?: string;
    steps?: CourseDetailBookingModalStep[];
    options?: Array<{ id: string; label: string; nextStepId?: string }>;
    question?: string;
  };
};

type AccordionKey = "learning" | "delivery" | "additional";

export default function CourseDetailsContent({
  course,
  relatedCourses,
  coursesHrefBasePath = "/courses",
  bookingHrefBasePath,
  defaultSelectedImageIndex = 0,
  onBookNow,
  dashboardMode = false,
  breadcrumbs,
  bookingModal,
}: CourseDetailsContentProps) {
  const router = useRouter();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [fetchBookNowModal, bookNowModalQuery] = useLazyGetCourseBookNowQuery();
  const shouldUseDashboardBookingModal =
    dashboardMode && course.bookingFlow === "am2";
  const [selectedImage, setSelectedImage] = React.useState(
    course.gallery[defaultSelectedImageIndex] ?? course.gallery[0] ?? course.heroImage
  );
  const [openSection, setOpenSection] = React.useState<AccordionKey>("learning");
  const [relatedIndex, setRelatedIndex] = React.useState(0);
  const [bookingOpen, setBookingOpen] = React.useState(false);
  const effectiveBookingModal = bookNowModalQuery.data?.data.modal ?? bookingModal;
  const modalSteps = effectiveBookingModal?.steps ?? [];
  const initialModalStepId =
    effectiveBookingModal?.initialStepId ?? modalSteps[0]?.id ?? "";
  const [activeModalStepId, setActiveModalStepId] = React.useState(initialModalStepId);
  const [selectedModalOptionId, setSelectedModalOptionId] = React.useState("");
  const activeModalStep =
    modalSteps.find((step) => step.id === activeModalStepId) ?? modalSteps[0];

  const accordionItems: Array<{ key: AccordionKey; title: string; content: string }> = [
    { key: "learning", title: "What you'll learn", content: course.learning },
    { key: "delivery", title: "How you'll learn", content: course.delivery },
    { key: "additional", title: "Additional info", content: course.additionalInfo },
  ];

  const visibleRelatedCourses =
    relatedCourses.length <= 3
      ? relatedCourses
      : Array.from({ length: 3 }, (_, index) => {
          const courseIndex = (relatedIndex + index) % relatedCourses.length;
          return relatedCourses[courseIndex];
        });

  const showPreviousRelated = () => {
    if (relatedCourses.length <= 1) {
      return;
    }

    setRelatedIndex((current) =>
      current === 0 ? relatedCourses.length - 1 : current - 1
    );
  };

  const showNextRelated = () => {
    if (relatedCourses.length <= 1) {
      return;
    }

    setRelatedIndex((current) =>
      current >= relatedCourses.length - 1 ? 0 : current + 1
    );
  };

  React.useEffect(() => {
    if (!bookingOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [bookingOpen]);

  React.useEffect(() => {
    setActiveModalStepId(initialModalStepId);
    setSelectedModalOptionId("");
  }, [initialModalStepId, effectiveBookingModal?.title]);

  const goToBookingPage = (
    selectedQualification?: string,
    selectedQualificationId?: string,
  ) => {
    if (!accessToken) {
      router.push("/login");
      return;
    }

    const bookingBasePath = bookingHrefBasePath ?? coursesHrefBasePath;

    if (!bookingBasePath) {
      onBookNow?.();
      return;
    }

    const params = new URLSearchParams();

    if (selectedQualification) {
      params.set("qualification", selectedQualification);
    }

    if (selectedQualificationId) {
      params.set("qualificationId", selectedQualificationId);
    }

    const qualificationQuery = params.toString();

    router.push(
      `${bookingBasePath}/${course.slug}/book${qualificationQuery ? `?${qualificationQuery}` : ""}`,
    );
  };

  const openBookingModal = async () => {
    if (!accessToken) {
      router.push("/login");
      return;
    }

    if (!shouldUseDashboardBookingModal) {
      goToBookingPage();
      return;
    }

    if (!dashboardMode) {
      onBookNow?.();
      return;
    }

    setBookingOpen(true);
    setSelectedModalOptionId("");

    if (effectiveBookingModal?.steps?.length) {
      setActiveModalStepId(initialModalStepId);
      return;
    }

    try {
      const response = await fetchBookNowModal(course.slug).unwrap();
      const nextInitialStepId =
        response.data.modal.initialStepId ?? response.data.modal.steps?.[0]?.id ?? "";

      if (!response.data.modal.steps?.length) {
        closeBookingModal();
        goToBookingPage();
        return;
      }

      setActiveModalStepId(nextInitialStepId);
    } catch {
      setActiveModalStepId("");
    }
  };

  const closeBookingModal = () => {
    setBookingOpen(false);
    setActiveModalStepId(initialModalStepId);
    setSelectedModalOptionId("");
  };

  const handleBookingContinue = () => {
    if (!activeModalStep || !selectedModalOptionId) {
      return;
    }

    const selectedOption = activeModalStep.options.find(
      (option) => option.id === selectedModalOptionId
    );

    if (selectedOption?.nextStepId) {
      setActiveModalStepId(selectedOption.nextStepId);
      setSelectedModalOptionId("");
      return;
    }

    closeBookingModal();

    const selectedQualification = selectedOption?.label ?? selectedModalOptionId;
    goToBookingPage(selectedQualification, selectedOption?.id);
  };

  return (
    <section className="bg-[#f6f8ff] px-4 py-10 sm:px-6 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-[1480px]">
        {breadcrumbs?.length ? (
          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#9ba6b9]">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={`${crumb.label}-${index}`}>
                {index > 0 ? <ChevronRight className="h-3.5 w-3.5" /> : null}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-[#4451ac]">{crumb.label}</span>
                ) : (
                  <Link href={crumb.url} className="transition hover:text-[#4451ac]">
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)] lg:items-start">
          <div>
            <div className="overflow-hidden rounded-[16px] bg-white shadow-[0_8px_24px_rgba(60,101,154,0.08)]">
              <div className="relative aspect-[16/9]">
                <Image src={selectedImage} alt={course.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 900px" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {course.gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`relative overflow-hidden rounded-[10px] border ${selectedImage === image ? "border-[#1ea9de]" : "border-[#d6e4f5]"}`}
                >
                  <div className="relative aspect-[4/3]">
                    <Image src={image} alt={`${course.title} preview ${index + 1}`} fill className="object-cover" sizes="160px" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[16px] bg-white p-6 shadow-[0_8px_24px_rgba(60,101,154,0.08)]">
            <h1 className="text-[1.9rem] font-semibold leading-tight text-[#3943a5]">{course.title}</h1>
            <p className="mt-4 text-[1rem] leading-7 text-[#646f8a]">{course.description}</p>

            <div className="mt-6 divide-y divide-[#dbe7f4] border-y border-[#dbe7f4]">
              {[
                ["Qualification", course.qualification],
                ["Location", course.location],
                ["Entry Requirements", course.entryRequirements],
                ["Duration", course.duration],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[170px_1fr] gap-4 py-4 text-[0.98rem]">
                  <span className="font-semibold text-[#4a57b2]">{label}</span>
                  <span className="text-[#6d7690]">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-end gap-2">
              <span className="text-[2rem] font-semibold leading-none text-[#38439e]">{course.price}</span>
              <span className="pb-1 text-sm text-[#6f7894]">{course.vatLabel}</span>
            </div>

            {onBookNow ? (
              <button
                type="button"
                onClick={onBookNow}
                className="mt-5 block w-full rounded-[8px] bg-[#1ea9de] px-6 py-4 text-center text-base font-semibold text-white shadow-[0_4px_0_#315063]"
              >
                Book Now
              </button>
            ) : shouldUseDashboardBookingModal ? (
              <button
                type="button"
                onClick={() => {
                  void openBookingModal();
                }}
                className="mt-5 block w-full rounded-[8px] bg-[#1ea9de] px-6 py-4 text-center text-base font-semibold text-white shadow-[0_4px_0_#315063]"
              >
                Book Now
              </button>
            ) : (
              <button
                type="button"
                onClick={() => goToBookingPage()}
                disabled={!bookingHrefBasePath}
                className={`mt-5 block w-full rounded-[8px] px-6 py-4 text-center text-base font-semibold text-white shadow-[0_4px_0_#315063] ${
                  bookingHrefBasePath
                    ? "bg-[#1ea9de]"
                    : "pointer-events-none cursor-not-allowed bg-[#8fc9df]"
                }`}
              >
                Book Now
              </button>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-[2rem] font-medium text-[#37409b]">Course details</h2>
          <div className="mt-5 space-y-4">
            {accordionItems.map((item) => {
              const isOpen = openSection === item.key;
              return (
                <div key={item.key} className="overflow-hidden rounded-[12px] border border-[#deebf6] bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenSection(isOpen ? "learning" : item.key)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="text-[1.05rem] font-medium text-[#3943a5]">{item.title}</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef7ff] text-[#5c6dc8]">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </button>
                  {isOpen ? (
                    <div className="border-t border-[#deebf6] px-5 py-4 text-[0.98rem] leading-7 text-[#6b7590]">
                      {item.content}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-[2rem] font-medium text-[#3943a5]">Related courses</h2>
              <p className="mt-1 text-sm text-[#707896]">Our most popular courses</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={showPreviousRelated}
                aria-label="Previous related courses"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#cae0f3] text-[#3943a5]"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={showNextRelated}
                aria-label="Next related courses"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#cae0f3] text-[#3943a5]"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleRelatedCourses.map((relatedCourse) => (
              <CourseCard
                key={relatedCourse.slug}
                slug={relatedCourse.slug}
                category={relatedCourse.category}
                title={relatedCourse.title}
                schedule={relatedCourse.schedule}
                description={relatedCourse.description}
                hrefBasePath={coursesHrefBasePath}
              />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Link href={coursesHrefBasePath} className="inline-flex items-center gap-2 text-sm font-medium text-[#3943a5]">
            <ChevronLeft size={16} />
            Back to all courses
          </Link>
        </div>
      </div>

      {shouldUseDashboardBookingModal && bookingOpen ? (
        <>
          <div
            className={`fixed inset-0 z-40 bg-[#12214d]/42 backdrop-blur-[2px] transition ${
              bookingOpen
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
            onClick={closeBookingModal}
          />

          <aside
            className={`fixed right-0 top-0 z-50 h-screen w-full max-w-[420px] border-l border-[#d8e7f8] bg-[#f5f9ff] shadow-[-24px_0_60px_rgba(18,33,77,0.18)] transition-transform duration-300 ${
              bookingOpen ? "translate-x-0" : "translate-x-full"
            }`}
            aria-hidden={!bookingOpen}
          >
            <div className="flex h-full flex-col px-3 py-3">
              <div className="rounded-[18px] border border-[#d6e6fb] bg-white shadow-[0_16px_38px_rgba(102,138,193,0.12)]">
                <div className="flex items-center justify-between gap-3 border-b border-[#e7eef8] px-4 py-3">
                  <div className="text-[#3346a5]">
                    <h2 className="text-base font-semibold">
                      {activeModalStep?.title ?? effectiveBookingModal?.title ?? "Book Now"}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={closeBookingModal}
                    className="rounded-full border border-[#d7e5f5] bg-[#f8fbff] p-1.5 text-[#4f63b7] transition hover:bg-white"
                    aria-label="Close booking panel"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180" />
                  </button>
                </div>

                <div className="p-3">
                  {bookNowModalQuery.isFetching ? (
                    <div className="rounded-[14px] border border-[#d9e7f5] bg-[linear-gradient(180deg,#f9fbff_0%,#f4f7fc_100%)] p-5 text-sm text-[#5a6d96]">
                      Loading booking options...
                    </div>
                  ) : bookNowModalQuery.isError ? (
                    <div className="rounded-[14px] border border-[#fecaca] bg-[#fff3f3] p-4">
                      <p className="text-sm font-medium text-[#dc2626]">
                        {"error" in bookNowModalQuery &&
                        typeof bookNowModalQuery.error === "object" &&
                        bookNowModalQuery.error !== null &&
                        "data" in bookNowModalQuery.error &&
                        typeof bookNowModalQuery.error.data === "object" &&
                        bookNowModalQuery.error.data !== null &&
                        "message" in bookNowModalQuery.error.data &&
                        typeof bookNowModalQuery.error.data.message === "string"
                          ? bookNowModalQuery.error.data.message
                          : "We could not load the booking options right now."}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          void fetchBookNowModal(course.slug);
                        }}
                        className="mt-3 rounded-md bg-[#1ea9de] px-4 py-2 text-sm font-medium text-white"
                      >
                        Try again
                      </button>
                    </div>
                  ) : activeModalStep ? (
                    <div className="rounded-[14px] border border-[#51c4ff] bg-[linear-gradient(180deg,#f9fbff_0%,#f4f7fc_100%)] p-3">
                      <p className="text-[0.95rem] font-medium leading-6 text-[#3546a5]">
                        {activeModalStep.question ?? effectiveBookingModal?.question}
                      </p>
                      <p className="mt-2 text-xs font-medium text-[#7a88a7]">Ans:</p>

                      <div className="mt-2 max-h-[560px] space-y-2 overflow-y-auto pr-1">
                        {activeModalStep.options.map((option) => {
                          const isSelected = selectedModalOptionId === option.id;

                          return (
                            <label
                              key={option.id}
                              className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 text-[0.8rem] leading-5 transition ${
                                isSelected
                                  ? "border-[#b9e7ff] bg-[#fcfeff] text-[#3346a5]"
                                  : "border-[#d9e7f5] bg-white text-[#44577e]"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`booking-step-${activeModalStep.id}`}
                                checked={isSelected}
                                onChange={() => setSelectedModalOptionId(option.id)}
                                className="mt-0.5 h-4 w-4 accent-[#1ea6df]"
                              />
                              <span>{option.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-[14px] border border-[#d9e7f5] bg-[linear-gradient(180deg,#f9fbff_0%,#f4f7fc_100%)] p-5 text-sm text-[#5a6d96]">
                      No booking steps are available for this course yet.
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-[#e7eef8] px-4 py-3">
                  <button
                    type="button"
                    onClick={closeBookingModal}
                    className="rounded-md border border-[#d8e5f4] bg-white px-4 py-2 text-sm font-medium text-[#384a77]"
                  >
                    {effectiveBookingModal?.cancelLabel ?? "Cancel"}
                  </button>
                  <button
                    type="button"
                    disabled={!selectedModalOptionId || bookNowModalQuery.isFetching || bookNowModalQuery.isError}
                    onClick={handleBookingContinue}
                    className={`rounded-md px-4 py-2 text-sm font-medium ${
                      selectedModalOptionId && !bookNowModalQuery.isFetching && !bookNowModalQuery.isError
                        ? "bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)] text-white shadow-[0_12px_24px_rgba(30,166,223,0.26)]"
                        : "cursor-not-allowed bg-[#dce4ec] text-[#9eacba]"
                    }`}
                  >
                    {activeModalStep?.confirmLabel ?? effectiveBookingModal?.confirmLabel ?? "Continue"}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </>
      ) : null}
    </section>
  );
}
