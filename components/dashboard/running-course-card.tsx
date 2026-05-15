"use client";

import Link from "next/link";
import PanelCard from "@/components/dashboard/panel-card";
import AnimatedProgressBar, {
  AnimatedCounter,
} from "@/components/dashboard/animated-progress-bar";

type StatusTone = "success" | "warning" | "info" | "danger" | string;

type SupportCard = {
  id: string;
  label: string;
  summary?: string;
  description?: string;
  status?: {
    label: string;
    tone?: StatusTone;
  };
  action?: {
    label?: string;
    url?: string;
  };
};

type RunningCourseCardProps = {
  title: string;
  booking?: {
    id: string;
    bookingNumber: string;
    progress?: {
      title?: string;
      trackLabel?: string;
      percentage?: number;
      status?: {
        label: string;
        tone?: StatusTone;
      };
      description?: string;
    };
    cards?: {
      documents?: SupportCard;
      signatures?: SupportCard;
    };
    action?: {
      label?: string;
      url?: string;
    };
    course?: {
      title?: string;
      schedule?: string;
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

function resolveToneClasses(tone?: StatusTone) {
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

export default function RunningCourseCard({
  title,
  booking,
  emptyState,
}: RunningCourseCardProps) {
  const progressValue = booking?.progress?.percentage ?? 0;
  const supportCards: SupportCard[] = [];

  if (booking?.cards?.documents) {
    supportCards.push(booking.cards.documents);
  }

  if (booking?.cards?.signatures) {
    supportCards.push(booking.cards.signatures);
  }

  return (
    <PanelCard className="p-0">
      <div className="border-b border-[#e8eff8] px-5 py-4">
        <h3 className="text-[1.2rem] font-medium text-[#3a49aa]">{title}</h3>
      </div>

      <div className="p-5">
        {booking ? (
          <div className="rounded-[14px] border border-[#e7eef8] bg-[#fcfeff] p-5">
            <div className="mb-5 rounded-[12px] border border-[#e8eff8] bg-white px-4 py-3">
              <p className="text-sm font-semibold text-[#3646a5]">
                {booking.course?.title || "Current booking"}
              </p>
              <p className="mt-1 text-sm text-[#7a88a5]">
                {booking.course?.schedule || `Booking #${booking.bookingNumber}`}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[1.1rem] font-semibold text-[#26355f]">
                  {booking.progress?.title || "Course progress"}
                </p>
                <p className="mt-3 text-sm font-medium text-[#5367b5]">
                  {booking.progress?.trackLabel || "Progress"}
                </p>
              </div>
              <span
                className={`rounded-full px-4 py-2 text-xs font-medium ${resolveToneClasses(
                  booking.progress?.status?.tone ?? booking.progress?.status?.label
                )}`}
              >
                {booking.progress?.status?.label || "In Progress"}
              </span>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-sm text-[#7a88a5]">
                <span>Progress</span>
                <span className="font-semibold text-[#1ea6df]">
                  <AnimatedCounter value={progressValue} />
                </span>
              </div>
              <AnimatedProgressBar value={progressValue} />
            </div>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[15px] text-[#7a88a5]">
                {booking.progress?.description || "Continue your current booking flow."}
              </p>
              {booking.action?.url ? (
                <Link
                  href={booking.action.url}
                  className="rounded-[8px] bg-[#1ea6df] px-6 py-3 text-center text-sm font-semibold text-white shadow-[0_8px_18px_rgba(30,166,223,0.22)]"
                >
                  {booking.action.label || "Continue"}
                </Link>
              ) : null}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {supportCards.map((item) => (
                <div
                  key={item.id}
                  className="rounded-[12px] border border-[#e7eef8] bg-white p-4"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${resolveToneClasses(
                        item.status?.tone ?? item.status?.label
                      )}`}
                    >
                      {item.label.charAt(0)}
                    </span>
                    <div>
                      <p className="font-medium text-[#3646a5]">{item.label}</p>
                      <p className="mt-1 text-sm text-[#7b8ca8]">
                        {item.summary || item.description || "Status available"}
                      </p>
                      {item.action?.url ? (
                        <Link
                          href={item.action.url}
                          className="mt-2 inline-block text-sm font-medium text-[#1ea6df]"
                        >
                          {item.action.label || "View"} {"->"}
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[14px] border border-[#e7eef8] bg-[#fcfeff] px-5 text-center">
            <p className="text-[1.5rem] font-medium text-[#3c4baa]">
              {emptyState?.title || "No Running Course"}
            </p>
            <p className="mt-3 max-w-[320px] text-[15px] leading-7 text-[#7988a3]">
              {emptyState?.description || "Your active booking will appear here once available."}
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
