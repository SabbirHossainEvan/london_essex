import PanelCard from "@/components/dashboard/panel-card";

type UpcomingSession = {
  title: string;
  schedule: string;
  status: string;
};

type UpcomingSessionsProps = {
  courses: UpcomingSession[];
};

export default function UpcomingSessions({
  courses,
}: UpcomingSessionsProps) {
  return (
    <PanelCard>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-[#1f2a44]">
            Upcoming sessions
          </h3>
          <p className="mt-1 text-sm text-[#6c7b91]">
            Your next booked classes and workshops
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {courses.map((course) => (
          <div key={course.title} className="rounded-2xl bg-[#f4f8fc] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-[#1f2a44]">
                  {course.title}
                </p>
                <p className="mt-1 text-sm text-[#6c7b91]">{course.schedule}</p>
              </div>
              <span className="rounded-full bg-[#dff5ff] px-4 py-2 text-sm font-medium text-[#127db5]">
                {course.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </PanelCard>
  );
}
