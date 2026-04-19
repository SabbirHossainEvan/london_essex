import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/app/(website)/courses/courses-data";
import Am2RegistrationFlow from "@/components/dashboard/am2-registration-flow";
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

  if (course.slug === "am2-assessment-preparation") {
    return <Am2RegistrationFlow course={course} />;
  }

  return <CourseBookingFlow course={course} />;
}
