"use client";

import React from "react";
import { ArrowLeft, ArrowRight, Flame } from "lucide-react";
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
  {
    category: "Gas ",
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
      className="group flex min-h-[360px] flex-col overflow-hidden rounded-[22px] border border-[#d9e7f5] bg-white shadow-[0_10px_25px_rgba(32,89,153,0.08)]"
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
            className="flex h-[34px] w-[30px] items-center justify-center opacity-95"
          >
            <svg
              width="30"
              height="34"
              viewBox="0 0 30 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M27.0004 6.86538L25.0388 9.19231C26.2888 10.2692 27.2696 11.2308 27.9427 11.9423C28.6158 12.6538 28.9619 13.0769 28.9619 13.0769C29.2696 11.0192 29.3081 9.55769 29.3465 9.09615C28.5773 8.28846 27.8081 7.55769 27.0196 6.86538H27.0004ZM25.9619 12.8077C24.1542 23.7115 18.3658 28.6538 14.6542 30.7692C12.8658 31.7885 11.5581 32.1346 11.4235 32.1731C11.5581 32.25 11.6927 32.3462 11.8081 32.4231C12.9619 33.1346 13.9042 33.6346 14.3658 33.8654C14.4619 33.9038 14.5581 33.9615 14.6542 34H14.6735C15.8273 33.4423 16.9042 32.8462 17.8658 32.1731C24.635 27.5962 27.3658 20.6154 28.5004 15.4808L25.9619 12.7885V12.8077ZM19.0965 1.69231C18.885 1.59615 18.6735 1.5 18.4811 1.40385C16.2888 0.423078 14.7888 0.0384615 14.6542 0C14.6542 0 14.6158 -1.76092e-06 14.5581 0.019229C14.5581 0.019229 14.5388 0.019229 14.5196 0.019229C14.5196 0.019229 14.4811 0.019229 14.4619 0.019229C13.9619 0.134614 13.4042 0.326923 12.9042 0.51923C12.7504 0.576922 12.5581 0.634615 12.385 0.711538C11.9811 0.865384 11.6927 0.980769 11.4235 1.09615C11.385 1.09615 11.3658 1.11538 11.3273 1.13461C11.1158 1.23077 10.9235 1.32692 10.7504 1.40385C10.5581 1.5 10.385 1.57692 10.2119 1.65384C11.7888 1.96154 13.2888 2.38461 14.6927 2.92308C16.4811 3.59615 18.135 4.42308 19.6542 5.28846L22.5388 3.51923C21.3081 2.75 20.1542 2.15384 19.1158 1.65384L19.0965 1.69231Z" fill="#0BA8DD" />
              <path d="M4.46154 17.5192C4.01923 16.0962 3.63462 14.5385 3.34615 12.8462C0.846154 15.4808 0.807693 15.5 0.807693 15.5C1.36539 18 2.28846 20.9808 3.88462 23.8654C4.90385 22.6731 6 21.3846 6 21.3846C5.42308 20.2308 4.90385 18.9423 4.44231 17.5192H4.46154ZM14.6538 30.75C13.25 29.9615 11.5577 28.75 9.90385 27L7.34615 28.6538C8.5 29.9038 9.86539 31.0962 11.4231 32.1538C11.5385 32.25 11.6731 32.3269 11.8077 32.4038C12.6154 32.9231 13.4615 33.4038 14.3654 33.8462C14.4615 33.8846 14.5577 33.9423 14.6538 33.9808H14.6731C15.8269 33.4231 16.9038 32.8269 17.8654 32.1538C17.5 32.0577 16.2308 31.6346 14.6346 30.7308L14.6538 30.75ZM18.4808 1.40385C16.2885 0.423078 14.7885 0.0384615 14.6538 0C14.6538 0 14.6154 -1.76092e-06 14.5577 0.019229C14.5577 0.019229 14.5385 0.019229 14.5192 0.019229C14.5192 0.019229 14.4808 0.019229 14.4615 0.019229C14.1923 0.0961521 13.6538 0.249999 12.9038 0.51923C12.75 0.576922 12.5577 0.634615 12.3846 0.711538C12.0962 0.826923 11.7692 0.961538 11.4231 1.09615C11.3846 1.09615 11.3654 1.11538 11.3269 1.13461C10.9808 1.28846 10.5962 1.44231 10.2115 1.63462C7.36539 2.98077 3.55769 5.28846 0 9.03846C0.0384615 9.5 0.0769234 10.9808 0.365385 13.0192C0.365385 13.0192 5.92308 6.19231 14.6923 2.90384C16.0962 2.38461 17.5577 1.94231 19.1154 1.63462C18.9038 1.53846 18.6923 1.44231 18.5 1.34615L18.4808 1.40385Z" fill="#33358E" />
              <path d="M28.7499 1.90385L17.3845 15.7115L14.7307 14.7692L26.9615 3.25001L10.673 15.4423L7.55762 14.4808L28.7499 1.90385Z" fill="#0BA8DD" />
              <path d="M21.9803 17.8654L18.8457 16.8269L1.8457 29.5769L14.9803 17.5577L12.1149 16.6731L0.595703 30.5769L21.9803 17.8654Z" fill="#33358E" />
            </svg>
          </motion.div>
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
  const resolvedCourses = courses.length > 0 ? courses : defaultCourses;
  const [cardsPerView, setCardsPerView] = React.useState(3);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
        return;
      }

      if (window.innerWidth < 1024) {
        setCardsPerView(2);
        return;
      }

      setCardsPerView(3);
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);

    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const totalPositions = Math.max(1, resolvedCourses.length);
  const safeIndex = currentIndex % totalPositions;
  const visibleCount = Math.min(cardsPerView, resolvedCourses.length);
  const visibleCourses = Array.from({ length: visibleCount }, (_, offset) => {
    const courseIndex = (safeIndex + offset) % resolvedCourses.length;
    return resolvedCourses[courseIndex];
  });

  React.useEffect(() => {
    if (currentIndex > totalPositions - 1) {
      setCurrentIndex(Math.max(0, totalPositions - 1));
    }
  }, [currentIndex, totalPositions]);

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

        <div className="mt-10">
          <motion.div
            key={`${safeIndex}-${cardsPerView}`}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visibleCourses.map((course, index) => (
              <CourseCard key={`${course.title}-${safeIndex}-${index}`} {...course} />
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="relative z-[60] mt-8 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            {Array.from({ length: totalPositions }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`transition ${
                  index === safeIndex
                    ? "h-4 w-11 rounded-full bg-[#1ca5dc]"
                    : "h-4 w-4 rounded-full bg-[#a8daf5]"
                } relative z-[60]`}
                aria-label={`Go to course slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((current) =>
                  current === 0 ? totalPositions - 1 : current - 1
                )
              }
              className="relative z-[60] grid h-11 w-11 place-items-center rounded-full border border-[#9ed8f5] bg-[#eef8ff] text-[#2d3f8f] shadow-[0_6px_18px_rgba(30,166,223,0.12)] transition hover:bg-white"
              aria-label="Previous courses"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((current) =>
                  current === totalPositions - 1 ? 0 : current + 1
                )
              }
              className="relative z-[60] grid h-11 w-11 place-items-center rounded-full border border-[#9ed8f5] bg-[#eef8ff] text-[#2d3f8f] shadow-[0_6px_18px_rgba(30,166,223,0.12)] transition hover:bg-white"
              aria-label="Next courses"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
