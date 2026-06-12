import { notFound } from "next/navigation";
import {
  coursesData,
  getCourseBySlug,
} from "@/app/(website)/courses/courses-data";
import Am2FullChecklistPage from "@/components/dashboard/am2-full-checklist-page";

export default async function DashboardCourseFullChecklistPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    bookingId?: string;
    courseId?: string;
    flow?: string;
    section?: string;
    hasEmployer?: string;
  }>;
}) {
  const { slug } = await params;
  const { bookingId, courseId, flow, section, hasEmployer } = await searchParams;
  const fallbackCourse = coursesData.find((course) => course.bookingFlow === "am2");
  const course =
    getCourseBySlug(slug) ??
    ((flow === "am2" || flow === "am2e" || flow === "am2e-v1")
      ? fallbackCourse
      : undefined);

  if (!course) {
    notFound();
  }

  const resolvedFlow =
    flow === "am2e" || flow === "am2e-v1" ? flow : "am2";

  return (
    <Am2FullChecklistPage
      course={course}
      flow={resolvedFlow}
      bookingId={bookingId}
      courseId={courseId}
      section={section}
      hasEmployer={hasEmployer}
    />
  );
}
