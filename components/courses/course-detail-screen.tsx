"use client";

import React from "react";
import CourseDetailsContent from "@/components/website/course-details-content";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  useGetCourseDetailScreenQuery,
} from "@/lib/redux/features/courses/course-api";
import { useLazyGetAm2eChecklistFlowByCourseQuery } from "@/lib/redux/features/bookings/booking-api";
import { isAm2Course } from "@/lib/redux/features/courses/course-flow";
import {
  mapDetailCourseToSummary,
  mapRelatedCourseToSummary,
} from "@/lib/redux/features/courses/course-mappers";

function cleanVariantLabel(value: string) {
  return value
    .replace(/\s+full\s+checklist/gi, "")
    .replace(/\s+checklist/gi, "")
    .trim();
}

type CourseDetailScreenProps = {
  slug: string;
  coursesHrefBasePath?: string;
  bookingHrefBasePath?: string;
  dashboardMode?: boolean;
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

  return "We could not load the course details right now.";
}

export default function CourseDetailScreen({
  slug,
  coursesHrefBasePath = "/courses",
  bookingHrefBasePath,
  dashboardMode = false,
}: CourseDetailScreenProps) {
  const hydrated = useAppSelector((state) => state.auth.hydrated);
  const [fetchChecklistFlow, checklistFlowQuery] =
    useLazyGetAm2eChecklistFlowByCourseQuery();
  const { data, isLoading, isError, error } = useGetCourseDetailScreenQuery(slug, {
    skip: !hydrated,
    refetchOnMountOrArgChange: true,
  });

  const screen = data?.data.screen;
  const course = screen?.course ? mapDetailCourseToSummary(screen.course) : null;
  const shouldLoadAm2ChecklistFlow = screen?.course ? isAm2Course(screen.course) : false;
  const relatedCourses =
    screen?.relatedCourses?.map(mapRelatedCourseToSummary) ?? [];
  const variantPrices = checklistFlowQuery.data?.data.availableVariants?.map((item) => ({
    variant: item.variant,
    label: cleanVariantLabel(
      item.label || item.title || item.variant.toUpperCase()
    ),
    displayPrice:
      item.pricing?.totalDisplayPrice ||
      item.pricing?.displayPrice ||
      item.displayPrice ||
      "",
  }))
    .filter((item) => item.displayPrice) ?? [];

  React.useEffect(() => {
    if (
      !hydrated ||
      !screen?.course?.id ||
      !shouldLoadAm2ChecklistFlow ||
      checklistFlowQuery.data?.data.course?.id === screen.course.id
    ) {
      return;
    }

    void fetchChecklistFlow({
      courseId: screen.course.id,
      variant: "am2",
    });
  }, [
    checklistFlowQuery.data?.data.course?.id,
    fetchChecklistFlow,
    hydrated,
    screen?.course?.id,
    shouldLoadAm2ChecklistFlow,
  ]);

  if (!hydrated || isLoading) {
    return (
      <section className="bg-[#f6f8ff] px-4 py-10 sm:px-6 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-[1480px] animate-pulse space-y-6">
          <div className="h-5 w-60 rounded bg-[#e6eef8]" />
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
            <div className="aspect-[16/9] rounded-[16px] bg-[#e6eef8]" />
            <div className="rounded-[16px] bg-white p-6 shadow-[0_8px_24px_rgba(60,101,154,0.08)]">
              <div className="h-8 w-3/4 rounded bg-[#e6eef8]" />
              <div className="mt-4 h-24 rounded bg-[#eef4fb]" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !course || !screen) {
    return (
      <section className="bg-[#f6f8ff] px-4 py-10 sm:px-6 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-[1480px] rounded-2xl border border-[#fecaca] bg-[#fff3f3] px-5 py-4 text-sm text-[#dc2626]">
          {resolveErrorMessage(error)}
        </div>
      </section>
    );
  }

  return (
    <CourseDetailsContent
      course={course}
      relatedCourses={relatedCourses}
      variantPrices={variantPrices}
      coursesHrefBasePath={coursesHrefBasePath}
      bookingHrefBasePath={bookingHrefBasePath}
      dashboardMode={dashboardMode}
      breadcrumbs={screen.breadcrumbs}
    />
  );
}
