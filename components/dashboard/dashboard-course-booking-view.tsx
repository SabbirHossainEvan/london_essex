"use client";

import Am2RegistrationFlow from "@/components/dashboard/am2-registration-flow";
import CourseBookingFlow from "@/components/dashboard/course-booking-flow";
import { useGetCourseDetailScreenQuery } from "@/lib/redux/features/courses/course-api";
import { mapDetailCourseToSummary } from "@/lib/redux/features/courses/course-mappers";

type DashboardCourseBookingViewProps = {
  slug: string;
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

  return "We could not load the course booking flow right now.";
}

export default function DashboardCourseBookingView({
  slug,
}: DashboardCourseBookingViewProps) {
  const { data, isLoading, isError, error } = useGetCourseDetailScreenQuery(slug);
  const course = data?.data.screen.course
    ? mapDetailCourseToSummary(data.data.screen.course)
    : null;

  if (isLoading) {
    return (
      <section className="bg-[#f6f8ff] px-4 py-10 sm:px-6 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-[1480px] animate-pulse space-y-6">
          <div className="h-5 w-48 rounded bg-[#e6eef8]" />
          <div className="rounded-[20px] bg-white p-6 shadow-[0_8px_24px_rgba(60,101,154,0.08)]">
            <div className="h-6 w-72 rounded bg-[#e6eef8]" />
            <div className="mt-6 h-10 rounded bg-[#eef4fb]" />
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="h-12 rounded bg-[#eef4fb]" />
              <div className="h-12 rounded bg-[#eef4fb]" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || !course) {
    return (
      <section className="bg-[#f6f8ff] px-4 py-10 sm:px-6 lg:px-10 xl:px-16">
        <div className="mx-auto max-w-[1480px] rounded-2xl border border-[#fecaca] bg-[#fff3f3] px-5 py-4 text-sm text-[#dc2626]">
          {resolveErrorMessage(error)}
        </div>
      </section>
    );
  }

  if (course.slug === "am2-assessment-preparation") {
    return (
      <Am2RegistrationFlow
        course={course}
        bookingId={data?.data.screen.course.id}
      />
    );
  }

  return <CourseBookingFlow course={course} />;
}
