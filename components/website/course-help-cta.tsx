"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type CourseHelpCtaProps = {
  title?: string;
  buttonLabel?: string;
  backgroundSrc?: string;
  personImageSrc?: string;
};

export default function CourseHelpCta({
  title = "Need help finding the right course?",
  buttonLabel = "Contact Us",
  backgroundSrc = "/Section.png",
  personImageSrc = "/img.png",
}: CourseHelpCtaProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-white py-10 sm:py-12"
    >
      <div className="mx-auto w-full px-0 sm:px-2">
        <div className="relative overflow-hidden rounded-[0px] bg-[#87d6f4] sm:rounded-[26px]">
          <Image
            src={backgroundSrc}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />

          <div className="relative z-10 grid min-h-[230px] grid-cols-1 items-center gap-2 px-5 py-8 sm:px-8 md:min-h-[250px] lg:grid-cols-[360px_1fr] lg:px-12 xl:grid-cols-[390px_1fr] xl:px-16">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: -28 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: 0.1, duration: 0.65 }}
              className="relative order-2 mx-auto -mb-8 h-[210px] w-[210px] self-end sm:h-[240px] sm:w-[240px] lg:order-1 lg:mx-0 lg:-mb-10 lg:h-[300px] lg:w-[300px] xl:h-[325px] xl:w-[325px]"
            >
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative h-full w-full"
              >
                <Image
                  src={personImageSrc}
                  alt="Student support"
                  fill
                  className="object-contain object-bottom"
                  sizes="(max-width: 1024px) 240px, 325px"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 28 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: 0.15, duration: 0.65 }}
              className="order-1 flex flex-col items-start justify-center lg:order-2 lg:pl-6 xl:pl-10"
            >
              <div className="relative">
                <div className="absolute left-[82px] top-[6px] hidden h-[138px] w-[92px] opacity-75 sm:block">
                  <div className="grid grid-cols-5 gap-[6px]">
                    {Array.from({ length: 45 }).map((_, index) => (
                      <span
                        key={index}
                        className="h-[3px] w-[3px] rounded-full bg-[#d7f4ff]"
                      />
                    ))}
                  </div>
                </div>

                <h2 className="relative max-w-[640px] text-[3rem] font-semibold leading-[0.94] tracking-[-0.04em] text-[#38439e] sm:text-[4rem] lg:text-[4.5rem] xl:text-[4.8rem]">
                  {title}
                </h2>
              </div>

              <motion.button
                whileHover={reduceMotion ? undefined : { y: -2 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                className="mt-7 rounded-[10px] bg-[#18a9df] px-9 py-4 text-[1.05rem] font-semibold text-white shadow-[0_4px_0_#4f5561]"
              >
                {buttonLabel}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
