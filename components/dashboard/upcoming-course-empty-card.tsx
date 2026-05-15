import Link from "next/link";
import PanelCard from "@/components/dashboard/panel-card";
import { CalendarClock } from "lucide-react";

type UpcomingCourseCardProps = {
  title: string;
  booking?: {
    id: string;
    statusBadge?: {
      label: string;
      tone?: string;
    };
    course?: {
      title?: string;
      schedule?: string;
      duration?: string;
      location?: string;
      displayPrice?: string;
    };
    action?: {
      label?: string;
      url?: string;
    };
  } | null;
  emptyState?: {
    title?: string;
    description?: string;
    action?: {
      label?: string;
      url?: string;
    } | null;
  } | null;
};

function resolveToneClasses(tone?: string) {
  switch (tone) {
    case "success":
      return "bg-[#edf9f0] text-[#31b45b]";
    case "warning":
      return "bg-[#fff5ea] text-[#ff9e2c]";
    case "danger":
      return "bg-[#fff1f1] text-[#dc2626]";
    default:
      return "bg-[#eef5ff] text-[#667fd9]";
  }
}

export default function UpcomingCourseEmptyCard({
  title,
  booking,
  emptyState,
}: UpcomingCourseCardProps) {
  return (
    <PanelCard className="p-0">
      <div className="border-b border-[#e8eff8] px-5 py-4">
        <h3 className="text-[1.2rem] font-medium text-[#3a49aa]">{title}</h3>
      </div>

      <div className="p-5">
        {booking ? (
          <div className="rounded-[14px] border border-[#e7eef8] bg-[#fcfeff] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[1.1rem] font-semibold text-[#26355f]">
                  {booking.course?.title || "Upcoming booking"}
                </p>
                <p className="mt-2 text-sm text-[#7a88a5]">
                  {booking.course?.schedule || "Schedule to be confirmed"}
                </p>
              </div>
              {booking.statusBadge?.label ? (
                <span
                  className={`rounded-full px-4 py-2 text-xs font-medium ${resolveToneClasses(
                    booking.statusBadge.tone
                  )}`}
                >
                  {booking.statusBadge.label}
                </span>
              ) : null}
            </div>

            <div className="mt-5 grid gap-3 rounded-[12px] border border-[#e8eff8] bg-white px-4 py-4 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b99b4]">
                  Duration
                </p>
                <p className="mt-1 text-sm font-medium text-[#3646a5]">
                  {booking.course?.duration || "TBC"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b99b4]">
                  Location
                </p>
                <p className="mt-1 text-sm font-medium text-[#3646a5]">
                  {booking.course?.location || "TBC"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8b99b4]">
                  Price
                </p>
                <p className="mt-1 text-sm font-medium text-[#3646a5]">
                  {booking.course?.displayPrice || "TBC"}
                </p>
              </div>
            </div>

            {booking.action?.url ? (
              <Link
                href={booking.action.url}
                className="mt-5 inline-flex rounded-[10px] bg-[#1ea6df] px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(30,166,223,0.22)]"
              >
                {booking.action.label || "View Booking"}
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[14px] border border-[#e7eef8] bg-[#fcfeff] px-5 text-center">
            <CalendarClock className="h-12 w-12 text-[#4156b8]" />
            <p className="mt-5 text-[2rem] font-medium text-[#3c4baa]">
              {emptyState?.title || "No Upcoming Courses."}
            </p>
            <p className="mt-3 max-w-[280px] text-[15px] leading-7 text-[#7988a3]">
              {emptyState?.description || "Book your next training to see it listed here."}
            </p>
            {emptyState?.action?.url ? (
              <Link
                href={emptyState.action.url}
                className="mt-6 rounded-[10px] bg-[#1ea6df] px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(30,166,223,0.22)]"
              >
                {emptyState.action.label || "Browse Courses"}
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </PanelCard>
  );
}
