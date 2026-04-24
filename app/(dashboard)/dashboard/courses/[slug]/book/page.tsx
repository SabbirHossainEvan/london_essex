import DashboardCourseBookingView from "@/components/dashboard/dashboard-course-booking-view";

export default async function DashboardCourseBookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <DashboardCourseBookingView slug={slug} />;
}
