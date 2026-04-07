"use client";

import React from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type FaqItem = {
  question: string;
  answer: string;
};

type FaqSectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: FaqItem[];
};

export default function FaqSection({
  eyebrow = "FAQ",
  title = "Common question in your mind",
  description = "We show the frequently question that our ask",
  items,
}: FaqSectionProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <section className="bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#eef7ff_58%,_#e9f4ff_100%)] px-4 py-14 sm:px-6 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-[1480px]">
        <div className="flex flex-col items-center">
          <span className="rounded-full border border-[#d7ecfb] bg-[#edf7ff] px-4 py-2 text-xs font-semibold tracking-[0.16em] text-[#19a2dd]">
            {eyebrow}
          </span>
          <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight text-[#38439e] sm:text-4xl lg:text-[3.1rem]">
            {title}
          </h2>
          <p className="mt-4 text-center text-lg text-[#8790a8] sm:text-[1.45rem]">
            {description}
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_520px]">
          <div>
            <div className="space-y-3">
              {items.map((item, index) => {
                const isActive = index === activeIndex;

                return (
                  <div
                    key={item.question}
                    className="overflow-hidden rounded-[16px] border border-[#dbe8f5] bg-white/55 shadow-[0_10px_30px_rgba(99,127,173,0.06)]"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                    >
                      <span className="text-[1.1rem] font-semibold leading-[1.25] text-[#202842] sm:text-[1.25rem]">
                        {item.question}
                      </span>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef7ff] text-[#5073ff]">
                        {isActive ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isActive ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-[#dbe8f5] px-5 py-5 text-[1rem] leading-8 text-[#7b859d] sm:px-6 sm:text-[1.08rem]">
                            {item.answer}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-[20px] bg-[#e5e5e5] shadow-[0_18px_40px_rgba(111,143,186,0.12)] sm:min-h-[460px] lg:min-h-[620px]">
            <Image
              src="/hero-2.png"
              alt="Electrical training workshop"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 520px"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,36,101,0.08)_0%,rgba(26,36,101,0.28)_100%)]" />
            <div className="absolute inset-x-5 bottom-5 rounded-[18px] border border-white/20 bg-white/12 p-5 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#dff6ff]">
                Support
              </p>
              <h3 className="mt-2 text-xl font-semibold leading-tight text-white">
                Talk to our team about course guidance, booking, and next steps
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
