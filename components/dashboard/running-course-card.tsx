"use client";

import PanelCard from "@/components/dashboard/panel-card";
import AnimatedProgressBar, {
  AnimatedCounter,
} from "@/components/dashboard/animated-progress-bar";

export default function RunningCourseCard() {
  return (
    <PanelCard className="p-0">
      <div className="border-b border-[#e8eff8] px-5 py-4">
        <h3 className="text-[1.2rem] font-medium text-[#3a49aa]">
          Running Course
        </h3>
      </div>

      <div className="p-5">
        <div className="rounded-[14px] border border-[#e7eef8] bg-[#fcfeff] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[1.1rem] font-semibold text-[#26355f]">
                AM2 Readiness Progress
              </p>
              <p className="mt-3 text-sm font-medium text-[#5367b5]">
                Self-Assessment Checklist
              </p>
            </div>
            <span className="rounded-full bg-[#eef5ff] px-4 py-2 text-xs font-medium text-[#667fd9]">
              In Progress
            </span>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm text-[#7a88a5]">
              <span>Progress</span>
              <span className="font-semibold text-[#1ea6df]">
                <AnimatedCounter value={45} />
              </span>
            </div>
            <AnimatedProgressBar value={45} />
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[15px] text-[#7a88a5]">
              Complete all sections to proceed
            </p>
            <button
              type="button"
              className="rounded-[8px] bg-[#1ea6df] px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(30,166,223,0.22)]"
            >
              Continue
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Documents",
                meta: "0/2 uploaded",
                action: "View",
                color: "bg-[#edf9f0] text-[#31b45b]",
              },
              {
                title: "Signatures",
                meta: "Pending approval",
                action: "View",
                color: "bg-[#fff5ea] text-[#ff9e2c]",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[12px] border border-[#e7eef8] bg-white p-4"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${item.color}`}
                  >
                    {item.title.charAt(0)}
                  </span>
                  <div>
                    <p className="font-medium text-[#3646a5]">{item.title}</p>
                    <p className="mt-1 text-sm text-[#7b8ca8]">{item.meta}</p>
                    <button
                      type="button"
                      className="mt-2 text-sm font-medium text-[#1ea6df]"
                    >
                      {item.action} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelCard>
  );
}
