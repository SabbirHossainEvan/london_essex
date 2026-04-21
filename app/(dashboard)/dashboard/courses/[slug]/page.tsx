import DashboardCourseDetailsView from "@/components/dashboard/dashboard-course-details-view";

export default async function DashboardCourseDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <DashboardCourseDetailsView slug={slug} />;
}
