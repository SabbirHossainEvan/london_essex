"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, FileUp, PenTool } from "lucide-react";

type ProgressItem = {
  title: string;
  date: string;
  icon: "calendar" | "upload" | "signature";
};

type ProgressTrackingSectionProps = {
  badge?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  items?: ProgressItem[];
};

const defaultItems: ProgressItem[] = [
  {
    title: "AM2 Assessment",
    date: "22 Sep, 03:00 AM",
    icon: "calendar",
  },
  {
    title: "Document Uploaded",
    date: "21 Sep, 10:00 AM",
    icon: "upload",
  },
  {
    title: "Signature Received",
    date: "21 Sep, 03:02 PM",
    icon: "signature",
  },
];

function ProgressIcon({ icon }: { icon: ProgressItem["icon"] }) {
  const commonClass = "h-5 w-5 text-[#39b3eb]";

  if (icon === "calendar") {
    return <CalendarDays className={commonClass} />;
  }

  if (icon === "upload") {
    return <FileUp className={commonClass} />;
  }

  return <PenTool className={commonClass} />;
}

function ProgressCard({
  item,
  index,
  reduceMotion,
}: {
  item: ProgressItem;
  index: number;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, x: 36, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay: 0.12 * index, duration: 0.6, ease: "easeOut" }}
      whileHover={reduceMotion ? undefined : { y: -6, scale: 1.01 }}
      className="flex items-center gap-4 rounded-[22px] bg-white px-5 py-4 shadow-[0_18px_45px_rgba(72,113,170,0.12)] ring-1 ring-[#edf1f7]"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#ffffff_0%,#f2f8ff_100%)] shadow-[0_8px_18px_rgba(60,112,176,0.12)]">
        <ProgressIcon icon={item.icon} />
      </div>

      <div className="min-w-0">
        <h3 className="truncate text-2xl font-medium tracking-tight text-[#383838]">
          {item.title}
        </h3>
        <p className="mt-1 text-xl text-[#c0c0c8]">{item.date}</p>
      </div>
    </motion.div>
  );
}

export default function ProgressTrackingSection({
  badge = "# 2 Progress Tracking",
  title = "Track All Your Courses and Stay on Top of Your Training",
  description = "Monitor and categorize your learning in real-time. Get detailed insights into where your skills stand, and identify areas to improve with just a few taps.",
  buttonLabel = "Read more",
  items = defaultItems,
}: ProgressTrackingSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 26 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative overflow-hidden bg-[#f8f9ff] py-16 sm:py-20"
    >
      <div className="absolute inset-0 opacity-60">
        <div className="h-full w-full bg-[linear-gradient(rgba(82,109,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(82,109,184,0.06)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -30 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ delay: 0.08, duration: 0.65 }}
          className="max-w-xl"
        >
          <span className="inline-flex rounded-xl bg-[#ecf4fb] px-5 py-3 text-lg font-medium text-[#6c799b] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            {badge}
          </span>

          <h2 className="mt-8 text-4xl font-medium leading-[1.02] tracking-tight text-[#3540a0] sm:text-5xl lg:text-[4rem]">
            {title}
          </h2>

          <p className="mt-6 max-w-lg text-lg leading-9 text-[#59637d] sm:text-[1.35rem]">
            {description}
          </p>

          <motion.button
            whileHover={reduceMotion ? undefined : { y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            className="mt-10 rounded-xl bg-black px-7 py-4 text-lg font-medium text-white shadow-[0_10px_20px_rgba(0,0,0,0.12)]"
          >
            {buttonLabel}
          </motion.button>
        </motion.div>

        <div className="relative">
          <motion.div
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [0, -8, 0],
                  }
            }
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto flex max-w-[520px] flex-col gap-4 sm:gap-5"
          >
            {items.map((item, index) => (
              <ProgressCard
                key={`${item.title}-${item.date}`}
                item={item}
                index={index}
                reduceMotion={reduceMotion}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
