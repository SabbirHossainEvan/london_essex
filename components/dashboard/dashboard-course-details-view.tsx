import CourseDetailScreen from "@/components/courses/course-detail-screen";

type DashboardCourseDetailsViewProps = {
  slug: string;
};

export default function DashboardCourseDetailsView({
  slug,
}: DashboardCourseDetailsViewProps) {
  return (
    <CourseDetailScreen
      slug={slug}
      coursesHrefBasePath="/dashboard/courses"
      bookingHrefBasePath="/dashboard/courses"
      dashboardMode
    />
  );
}
