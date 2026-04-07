import { notFound } from "next/navigation";
import CourseDetailsContent from "@/components/website/course-details-content";
import { coursesData, getCourseBySlug } from "../courses-data";


export default async function CourseDetailsPage({
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

  return (
    <>
      <CourseDetailsContent course={course} relatedCourses={relatedCourses} />

    </>
  );
}
