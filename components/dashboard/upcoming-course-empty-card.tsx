import PanelCard from "@/components/dashboard/panel-card";
import { CalendarClock } from "lucide-react";

export default function UpcomingCourseEmptyCard() {
  return (
    <PanelCard className="p-0">
      <div className="border-b border-[#e8eff8] px-5 py-4">
        <h3 className="text-[1.2rem] font-medium text-[#3a49aa]">
          Upcoming Course
        </h3>
      </div>

      <div className="p-5">
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[14px] border border-[#e7eef8] bg-[#fcfeff] px-5 text-center">
          <CalendarClock className="h-12 w-12 text-[#4156b8]" />
          <p className="mt-5 text-[2rem] font-medium text-[#3c4baa]">
            No Upcoming Courses.
          </p>
          <p className="mt-3 max-w-[280px] text-[15px] leading-7 text-[#7988a3]">
            Book your next training to see it listed here.
          </p>
          <button
            type="button"
            className="mt-6 rounded-[10px] bg-[#1ea6df] px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(30,166,223,0.22)]"
          >
            Browse Courses
          </button>
        </div>
      </div>
    </PanelCard>
  );
}
