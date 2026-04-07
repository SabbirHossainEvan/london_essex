"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import type { CourseSummary } from "@/app/(website)/courses/courses-data";
import CourseCard from "@/components/website/course-card";

type CourseDetailsContentProps = {
  course: CourseSummary;
  relatedCourses: CourseSummary[];
};

type AccordionKey = "learning" | "delivery" | "additional";

export default function CourseDetailsContent({
  course,
  relatedCourses,
}: CourseDetailsContentProps) {
  const [selectedImage, setSelectedImage] = React.useState(course.gallery[0] ?? course.heroImage);
  const [openSection, setOpenSection] = React.useState<AccordionKey>("learning");
  const [relatedIndex, setRelatedIndex] = React.useState(0);

  const accordionItems: Array<{ key: AccordionKey; title: string; content: string }> = [
    { key: "learning", title: "What you'll learn", content: course.learning },
    { key: "delivery", title: "How you'll learn", content: course.delivery },
    { key: "additional", title: "Additional info", content: course.additionalInfo },
  ];

  const visibleRelatedCourses =
    relatedCourses.length <= 3
      ? relatedCourses
      : Array.from({ length: 3 }, (_, index) => {
          const courseIndex = (relatedIndex + index) % relatedCourses.length;
          return relatedCourses[courseIndex];
        });

  const showPreviousRelated = () => {
    if (relatedCourses.length <= 1) {
      return;
    }

    setRelatedIndex((current) =>
      current === 0 ? relatedCourses.length - 1 : current - 1
    );
  };

  const showNextRelated = () => {
    if (relatedCourses.length <= 1) {
      return;
    }

    setRelatedIndex((current) =>
      current >= relatedCourses.length - 1 ? 0 : current + 1
    );
  };

  return (
    <section className="bg-[#f6f8ff] px-4 py-10 sm:px-6 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-[1480px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)] lg:items-start">
          <div>
            <div className="overflow-hidden rounded-[16px] bg-white shadow-[0_8px_24px_rgba(60,101,154,0.08)]">
              <div className="relative aspect-[16/9]">
                <Image src={selectedImage} alt={course.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 900px" />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {course.gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`relative overflow-hidden rounded-[10px] border ${selectedImage === image ? "border-[#1ea9de]" : "border-[#d6e4f5]"}`}
                >
                  <div className="relative aspect-[4/3]">
                    <Image src={image} alt={`${course.title} preview ${index + 1}`} fill className="object-cover" sizes="160px" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[16px] bg-white p-6 shadow-[0_8px_24px_rgba(60,101,154,0.08)]">
            <h1 className="text-[1.9rem] font-semibold leading-tight text-[#3943a5]">{course.title}</h1>
            <p className="mt-4 text-[1rem] leading-7 text-[#646f8a]">{course.description}</p>

            <div className="mt-6 divide-y divide-[#dbe7f4] border-y border-[#dbe7f4]">
              {[
                ["Qualification", course.qualification],
                ["Location", course.location],
                ["Entry Requirements", course.entryRequirements],
                ["Duration", course.duration],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[170px_1fr] gap-4 py-4 text-[0.98rem]">
                  <span className="font-semibold text-[#4a57b2]">{label}</span>
                  <span className="text-[#6d7690]">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-end gap-2">
              <span className="text-[2rem] font-semibold leading-none text-[#38439e]">{course.price}</span>
              <span className="pb-1 text-sm text-[#6f7894]">{course.vatLabel}</span>
            </div>

            <button className="mt-5 w-full rounded-[8px] bg-[#1ea9de] px-6 py-4 text-base font-semibold text-white shadow-[0_4px_0_#315063]">
              Book Now
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-[2rem] font-medium text-[#37409b]">Course details</h2>
          <div className="mt-5 space-y-4">
            {accordionItems.map((item) => {
              const isOpen = openSection === item.key;
              return (
                <div key={item.key} className="overflow-hidden rounded-[12px] border border-[#deebf6] bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenSection(isOpen ? "learning" : item.key)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="text-[1.05rem] font-medium text-[#3943a5]">{item.title}</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eef7ff] text-[#5c6dc8]">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </button>
                  {isOpen ? (
                    <div className="border-t border-[#deebf6] px-5 py-4 text-[0.98rem] leading-7 text-[#6b7590]">
                      {item.content}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-[2rem] font-medium text-[#3943a5]">Related courses</h2>
              <p className="mt-1 text-sm text-[#707896]">Our most popular courses</p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={showPreviousRelated}
                aria-label="Previous related courses"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#cae0f3] text-[#3943a5]"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                type="button"
                onClick={showNextRelated}
                aria-label="Next related courses"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#cae0f3] text-[#3943a5]"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleRelatedCourses.map((relatedCourse) => (
              <CourseCard
                key={relatedCourse.slug}
                slug={relatedCourse.slug}
                category={relatedCourse.category}
                title={relatedCourse.title}
                schedule={relatedCourse.schedule}
                description={relatedCourse.description}
              />
            ))}
          </div>
        </div>

        <div className="mt-8">
          <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-medium text-[#3943a5]">
            <ChevronLeft size={16} />
            Back to all courses
          </Link>
        </div>
      </div>
    </section>
  );
}
