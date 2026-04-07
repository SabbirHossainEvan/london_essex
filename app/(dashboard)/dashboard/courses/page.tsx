import { coursesData } from "@/app/(website)/courses/courses-data";
import SectionHeader from "@/components/dashboard/section-header";
import CourseCard from "@/components/website/course-card";
import PanelCard from "@/components/dashboard/panel-card";

export default function DashboardCoursesPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Course Catalog"
        description="Browse and book your preparation courses."
      />

      <PanelCard className="p-5">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {coursesData.map((course) => (
            <CourseCard
              key={course.slug}
              slug={course.slug}
              category="Available"
              title={course.title}
              schedule={course.schedule}
              description={course.description}
              hrefBasePath="/dashboard/courses"
            />
          ))}
        </div>
      </PanelCard>
    </div>
  );
}
