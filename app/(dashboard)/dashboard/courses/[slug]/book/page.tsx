import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/app/(website)/courses/courses-data";
import CourseBookingFlow from "@/components/dashboard/course-booking-flow";

export default async function DashboardCourseBookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return <CourseBookingFlow course={course} />;
}
