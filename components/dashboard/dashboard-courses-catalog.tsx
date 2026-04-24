"use client";

import CourseCard from "@/components/website/course-card";
import PanelCard from "@/components/dashboard/panel-card";
import SectionHeader from "@/components/dashboard/section-header";
import {
  useGetCourseCatalogScreenQuery,
  type CourseCatalogCard,
} from "@/lib/redux/features/courses/course-api";

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

  return "We could not load the course catalog right now.";
}

function formatCatalogBadge(card: CourseCatalogCard) {
  return card.badge?.label ?? card.status ?? "Course";
}

function LoadingCard() {
  return (
    <div className="min-h-[300px] animate-pulse rounded-[16px] border border-[#d8e8f6] bg-white p-4 shadow-[0_10px_24px_rgba(60,101,154,0.08)]">
      <div className="h-10 w-28 rounded-full bg-[#eef5fd]" />
      <div className="mt-6 h-6 w-3/4 rounded bg-[#eef5fd]" />
      <div className="mt-4 h-5 w-1/2 rounded bg-[#eef5fd]" />
      <div className="mt-10 space-y-3">
        <div className="h-4 w-full rounded bg-[#f2f7fd]" />
        <div className="h-4 w-5/6 rounded bg-[#f2f7fd]" />
        <div className="h-4 w-2/3 rounded bg-[#f2f7fd]" />
      </div>
      <div className="mt-10 h-11 w-32 rounded-[8px] bg-[#d9edf9]" />
    </div>
  );
}

export default function DashboardCoursesCatalog() {
  const { data, isLoading, isFetching, isError, error } =
    useGetCourseCatalogScreenQuery();

  const screen = data?.data.screen;
  const cards = screen?.cards ?? [];

  return (
    <div className="space-y-6">
      <SectionHeader
        title={screen?.title ?? "Course Catalog"}
        description={
          screen?.subtitle ?? "Browse and book your preparation courses."
        }
      />

      <PanelCard className="p-5">
        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-2xl border border-[#fecaca] bg-[#fff3f3] px-5 py-4 text-sm text-[#dc2626]">
            {resolveErrorMessage(error)}
          </div>
        ) : null}

        {!isLoading && !isError && cards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d8e8f6] bg-[#f8fbff] px-5 py-12 text-center text-sm text-[#66758b]">
            No courses are available right now.
          </div>
        ) : null}

        {!isLoading && !isError && cards.length > 0 ? (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {cards.map((course) => (
                <CourseCard
                  key={course.id}
                  slug={course.slug}
                  category={formatCatalogBadge(course)}
                  title={course.title}
                  schedule={course.subtitle || course.schedule}
                  description={course.description || course.shortDescription}
                  hrefBasePath="/dashboard/courses"
                />
              ))}
            </div>

            {isFetching ? (
              <p className="mt-4 text-xs text-[#7a88a3]">Refreshing courses...</p>
            ) : null}
          </>
        ) : null}
      </PanelCard>
    </div>
  );
}
