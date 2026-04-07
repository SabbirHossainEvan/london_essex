"use client";

import React from "react";
import CourseCard from "@/components/website/course-card";
import type { CourseSummary } from "@/app/(website)/courses/courses-data";
import { ArrowLeft, ArrowRight } from "lucide-react";

type CoursesGridSectionProps = {
  eyebrow?: string;
  title?: string;
  courses: CourseSummary[];
};

export default function CoursesGridSection({
  eyebrow = "EXPLORE",
  title = "Top trending courses",
  courses,
}: CoursesGridSectionProps) {
  const coursesPerPage = 3;
  const totalPages = Math.ceil(courses.length / coursesPerPage);
  const [currentPage, setCurrentPage] = React.useState(0);

  const visibleCourses = courses.slice(
    currentPage * coursesPerPage,
    currentPage * coursesPerPage + coursesPerPage
  );

  const handlePrevious = () => {
    setCurrentPage((page) => (page === 0 ? totalPages - 1 : page - 1));
  };

  const handleNext = () => {
    setCurrentPage((page) => (page === totalPages - 1 ? 0 : page + 1));
  };

  return (
    <section className="bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#eef7ff_56%,_#e7f2fd_100%)] px-4 py-14 sm:px-6 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-[1480px]">
        <div className="flex flex-col items-center">
          <span className="rounded-full border border-[#d7ecfb] bg-[#edf7ff] px-5 py-2 text-sm font-semibold tracking-[0.18em] text-[#19a2dd]">
            {eyebrow}
          </span>
          <h2 className="mt-4 text-center text-3xl font-semibold tracking-tight text-[#38439e] sm:text-4xl">
            {title}
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleCourses.map((course) => (
            <CourseCard
              key={course.slug}
              slug={course.slug}
              category={course.category}
              title={course.title}
              schedule={course.schedule}
              description={course.description}
            />
          ))}
        </div>

        {totalPages > 1 ? (
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentPage(index)}
                  aria-label={`Show courses page ${index + 1}`}
                  className={`h-4 rounded-full transition-all ${index === currentPage ? "w-11 bg-[#1ca5dc]" : "w-4 bg-[#a8daf5]"}`}
                />
              ))}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handlePrevious}
                aria-label="Previous courses"
                className="flex h-14 w-14 items-center justify-center rounded-full border border-[#9dd8f4] text-[#38439e] transition-colors hover:bg-white"
              >
                <ArrowLeft size={28} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next courses"
                className="flex h-14 w-14 items-center justify-center rounded-full border border-[#9dd8f4] text-[#38439e] transition-colors hover:bg-white"
              >
                <ArrowRight size={28} />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
