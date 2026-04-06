"use client";

import React from "react";
import { Flame } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

type TrendingCourse = {
  category: string;
  title: string;
  schedule: string;
  description: string;
  ctaLabel?: string;
};

type TrendingCoursesMarqueeProps = {
  eyebrow?: string;
  title?: string;
  courses?: TrendingCourse[];
};

const defaultCourses: TrendingCourse[] = [
  {
    category: "Gas Engineer",
    title: "How To Become A Gas Engineer (New Entrants)",
    schedule: "Weekdays or Weekends",
    description:
      "Great if you are looking to become a Gas Safe registered Engineer and have no previous experience",
    ctaLabel: "View Details",
  },
  {
    category: "Gas Engineer",
    title: "How To Become A Gas Engineer (New Entrants)",
    schedule: "Weekdays or Weekends",
    description:
      "Great if you are looking to become a Gas Safe registered Engineer and have no previous experience",
    ctaLabel: "View Details",
  },
  {
    category: "Gas Engineer",
    title: "How To Become A Gas Engineer (New Entrants)",
    schedule: "Weekdays or Weekends",
    description:
      "Great if you are looking to become a Gas Safe registered Engineer and have no previous experience",
    ctaLabel: "View Details",
  },
];

function CourseCard({
  category,
  title,
  schedule,
  description,
  ctaLabel = "View Details",
}: TrendingCourse) {
  return (
    <motion.article
      whileHover={{ y: -10, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className="group flex min-h-[360px] w-[300px] flex-none flex-col overflow-hidden rounded-[22px] border border-[#d9e7f5] bg-white shadow-[0_10px_25px_rgba(32,89,153,0.08)] sm:w-[360px] lg:w-[392px]"
    >
      <div className="bg-[#edf6fd] p-4 sm:p-5">
        <motion.div
          whileHover={{ x: 4 }}
          className="inline-flex items-center gap-2 rounded-2xl border border-[#dbe9f6] bg-white px-4 py-2 text-base font-medium text-[#4f567f] shadow-sm"
        >
          <Flame className="h-4 w-4 text-red-500 transition-transform duration-300 group-hover:scale-115" />
          <span>{category}</span>
        </motion.div>

        <h3 className="mt-5 text-2xl font-bold leading-tight text-[#37409b]">
          {title}
        </h3>

        <p className="mt-4 text-[1.1rem] font-medium text-[#4f567f]">
          {schedule}
        </p>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <p className="max-w-[28ch] text-xl leading-relaxed text-[#59637d]">
          {description}
        </p>

        <div className="mt-6 flex items-end justify-between gap-4">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl bg-[#1ca5dc] px-6 py-3 text-base font-bold text-white shadow-[0_4px_0_#2f4152] transition-transform"
          >
            {ctaLabel}
          </motion.button>

          <motion.div
            animate={{ y: [0, -5, 0], rotate: [0, 6, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className="h-10 w-10 rounded-full border-2 border-[#2b6ad8] opacity-90"
          />
        </div>
      </div>
    </motion.article>
  );
}

export default function TrendingCoursesMarquee({
  eyebrow = "EXPLORE",
  title = "Top trending courses",
  courses = defaultCourses,
}: TrendingCoursesMarqueeProps) {
  const reduceMotion = useReducedMotion();
  const duplicatedCourses = [...courses, ...courses];

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="overflow-hidden bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#eef7ff_56%,_#e7f2fd_100%)] py-14 sm:py-18"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <motion.span
            animate={
              reduceMotion
                ? undefined
                : {
                    boxShadow: [
                      "0 0 0 rgba(25,162,221,0.0)",
                      "0 0 0 10px rgba(25,162,221,0.08)",
                      "0 0 0 rgba(25,162,221,0.0)",
                    ],
                  }
            }
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-full border border-[#d7ecfb] bg-[#edf7ff] px-5 py-2 text-sm font-semibold tracking-[0.18em] text-[#19a2dd]"
          >
            {eyebrow}
          </motion.span>

          <motion.h2
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="mt-4 text-center text-3xl font-semibold tracking-tight text-[#38439e] sm:text-4xl"
          >
            {title}
          </motion.h2>
        </motion.div>

        <div className="relative mt-10 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#edf7ff] via-[#edf7ff]/85 to-transparent sm:w-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#edf7ff] via-[#edf7ff]/85 to-transparent sm:w-20" />

          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={reduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="course-marquee-track flex w-max items-stretch gap-6 pb-4"
          >
            {duplicatedCourses.map((course, index) => (
              <div key={`${course.title}-${index}`} className="flex-none">
                <CourseCard {...course} />
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-8 flex items-center gap-4"
        >
          <motion.span
            animate={reduceMotion ? undefined : { scaleX: [1, 1.15, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="h-4 w-11 rounded-full bg-[#1ca5dc]"
          />
          <motion.span
            animate={reduceMotion ? undefined : { opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-4 w-4 rounded-full bg-[#a8daf5]"
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
