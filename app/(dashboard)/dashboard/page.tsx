import DashboardWelcomeBanner from "@/components/dashboard/dashboard-welcome-banner";
import QuickActionsCard from "@/components/dashboard/quick-actions-card";
import RecentActivityFeed from "@/components/dashboard/recent-activity-feed";
import RunningCourseCard from "@/components/dashboard/running-course-card";
import UpcomingCourseEmptyCard from "@/components/dashboard/upcoming-course-empty-card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardWelcomeBanner />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.55fr)]">
        <RunningCourseCard />
        <QuickActionsCard />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.55fr)]">
        <UpcomingCourseEmptyCard />
        <RecentActivityFeed />
      </section>
    </div>
  );
}
