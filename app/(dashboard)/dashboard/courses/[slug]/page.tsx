import { notFound } from "next/navigation";
import { coursesData, getCourseBySlug } from "@/app/(website)/courses/courses-data";
import DashboardCourseDetailsView from "@/components/dashboard/dashboard-course-details-view";

export default async function DashboardCourseDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const relatedCourses = coursesData.filter((item) => item.slug !== course.slug);

  return <DashboardCourseDetailsView course={course} relatedCourses={relatedCourses} />;
}
