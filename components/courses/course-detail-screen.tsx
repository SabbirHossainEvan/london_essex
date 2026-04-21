"use client";

import CourseDetailsContent from "@/components/website/course-details-content";
import {
  useGetCourseDetailScreenQuery,
} from "@/lib/redux/features/courses/course-api";
import {
  mapDetailCourseToSummary,
  mapRelatedCourseToSummary,
} from "@/lib/redux/features/courses/course-mappers";

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
  const { data, isLoading, isError, error } = useGetCourseDetailScreenQuery(slug);

  const screen = data?.data.screen;
  const course = screen?.course ? mapDetailCourseToSummary(screen.course) : null;
  const relatedCourses =
    screen?.relatedCourses?.map(mapRelatedCourseToSummary) ?? [];

  if (isLoading) {
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
      coursesHrefBasePath={coursesHrefBasePath}
      bookingHrefBasePath={bookingHrefBasePath}
      dashboardMode={dashboardMode}
      breadcrumbs={screen.breadcrumbs}
    />
  );
}
