"use client";

import PanelCard from "@/components/dashboard/panel-card";
import AnimatedProgressBar, {
  AnimatedCounter,
} from "@/components/dashboard/animated-progress-bar";

type CourseProgressItem = {
  title: string;
  progress: string;
  nextLesson: string;
};

type CourseProgressListProps = {
  courses: CourseProgressItem[];
};

export default function CourseProgressList({
  courses,
}: CourseProgressListProps) {
  return (
    <div className="grid gap-5">
      {courses.map((course) => {
        const progressValue = parseInt(course.progress.replace("%", "")) || 0;

        return (
          <PanelCard key={course.title}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-[#1f2a44]">
                  {course.title}
                </h3>
                <p className="mt-2 text-sm text-[#66758b]">
                  Next lesson: {course.nextLesson}
                </p>
              </div>

              <div className="min-w-[220px]">
                <div className="flex items-center justify-between text-sm font-medium text-[#127db5]">
                  <AnimatedCounter value={progressValue} />
                  <span>Continue</span>
                </div>
                <AnimatedProgressBar
                  value={progressValue}
                  className="mt-3 h-3 rounded-full bg-[#e7f1f7]"
                  fillClassName="h-3 rounded-full bg-[#18a8df]"
                />
              </div>
            </div>
          </PanelCard>
        );
      })}
    </div>
  );
}
