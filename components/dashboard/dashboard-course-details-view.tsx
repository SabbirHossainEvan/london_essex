"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FileCheck2, X } from "lucide-react";
import type { CourseSummary } from "@/app/(website)/courses/courses-data";
import CourseDetailsContent from "@/components/website/course-details-content";

type DashboardCourseDetailsViewProps = {
  course: CourseSummary;
  relatedCourses: CourseSummary[];
};

const eligibilityOptions = [
  "(EWA) City & Guilds 2346",
  "EAL 603/5982/1",
  "City & Guilds 2357",
  "EAL 501/1605/6 Electrotechnical",
  "EAL 501/1604/6 Electrotechnical Maintenance",
  "City & Guilds 2356 Certificate (NVQ)",
  "City & Guilds 2355-03 Certificate (NVQ)",
  "EAL 100/472/07 Certificate in Electrotechnical Services (NVQ)",
  "City & Guilds 2356-99 JIB Mature Candidate Assessment route",
  "EAL ETS3 JIB Mature Candidate Assessment route",
  "City & Guilds 2360 Parts 1 and 2",
  "Level 3 or Level 4 Diplomas in Electrotechnical Studies and Practice (Military Engineering)",
];

export default function DashboardCourseDetailsView({
  course,
  relatedCourses,
}: DashboardCourseDetailsViewProps) {
  const router = useRouter();
  const [bookingOpen, setBookingOpen] = React.useState(false);
  const [selectedQualification, setSelectedQualification] = React.useState(
    eligibilityOptions[0]
  );
  const useBookingDrawer = course.slug === "am2-assessment-preparation";

  React.useEffect(() => {
    if (!bookingOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [bookingOpen]);

  const closeBookingDrawer = () => {
    setBookingOpen(false);
  };

  return (
    <>
      <CourseDetailsContent
        course={course}
        relatedCourses={relatedCourses}
        coursesHrefBasePath="/dashboard/courses"
        bookingHrefBasePath={useBookingDrawer ? undefined : "/dashboard/courses"}
        defaultSelectedImageIndex={2}
        onBookNow={useBookingDrawer ? () => setBookingOpen(true) : undefined}
      />

      {useBookingDrawer ? (
        <>
          <div
            className={`fixed inset-0 z-40 bg-[#12214d]/42 backdrop-blur-[2px] transition ${
              bookingOpen
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
            onClick={closeBookingDrawer}
          />

          <aside
            className={`fixed right-0 top-0 z-50 h-screen w-full max-w-[420px] border-l border-[#d8e7f8] bg-[#f5f9ff] shadow-[-24px_0_60px_rgba(18,33,77,0.18)] transition-transform duration-300 ${
              bookingOpen ? "translate-x-0" : "translate-x-full"
            }`}
            aria-hidden={!bookingOpen}
          >
            <div className="flex h-full flex-col px-3 py-3">
              <div className="rounded-[18px] border border-[#d6e6fb] bg-white shadow-[0_16px_38px_rgba(102,138,193,0.12)]">
                <div className="flex items-center justify-between gap-3 border-b border-[#e7eef8] px-4 py-3">
                  <div className="flex items-center gap-2 text-[#3346a5]">
                    <FileCheck2 className="h-4 w-4" />
                    <h2 className="text-base font-semibold">Eligibility Check</h2>
                  </div>

                  <button
                    type="button"
                    onClick={closeBookingDrawer}
                    className="rounded-full border border-[#d7e5f5] bg-[#f8fbff] p-1.5 text-[#4f63b7] transition hover:bg-white"
                    aria-label="Close booking panel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-3">
                  <div className="rounded-[14px] border border-[#51c4ff] bg-[linear-gradient(180deg,#f9fbff_0%,#f4f7fc_100%)] p-3">
                    <p className="text-[0.95rem] font-medium leading-6 text-[#3546a5]">
                      Have you completed or are you registered for any of the
                      following qualifications?
                    </p>
                    <p className="mt-2 text-xs font-medium text-[#7a88a7]">Ans:</p>

                    <div className="mt-2 max-h-[560px] space-y-2 overflow-y-auto pr-1">
                      {eligibilityOptions.map((option) => {
                        const isSelected = selectedQualification === option;

                        return (
                          <label
                            key={option}
                            className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 text-[0.8rem] leading-5 transition ${
                              isSelected
                                ? "border-[#b9e7ff] bg-[#fcfeff] text-[#3346a5]"
                                : "border-[#d9e7f5] bg-white text-[#44577e]"
                            }`}
                          >
                            <input
                              type="radio"
                              name="eligibility"
                              checked={isSelected}
                              onChange={() => setSelectedQualification(option)}
                              className="mt-0.5 h-4 w-4 accent-[#1ea6df]"
                            />
                            <span>{option}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-[#e7eef8] px-4 py-3">
                  <button
                    type="button"
                    onClick={closeBookingDrawer}
                    className="rounded-md border border-[#d8e5f4] bg-white px-4 py-2 text-sm font-medium text-[#384a77]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBookingOpen(false);
                      router.push(`/dashboard/courses/${course.slug}/book`);
                    }}
                    className="rounded-md bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)] px-4 py-2 text-sm font-medium text-white shadow-[0_12px_24px_rgba(30,166,223,0.26)]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
