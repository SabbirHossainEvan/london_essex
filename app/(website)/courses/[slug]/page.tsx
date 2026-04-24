import CourseDetailScreen from "@/components/courses/course-detail-screen";


export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <CourseDetailScreen
      slug={slug}
      coursesHrefBasePath="/courses"
      bookingHrefBasePath="/courses"
    />
  );
}
