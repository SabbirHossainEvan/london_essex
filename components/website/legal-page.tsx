"use client";

import React from "react";
import type { ReactNode } from "react";
import {
  useGetLegalPageQuery,
  useGetPublicLegalPageQuery,
} from "@/lib/redux/features/settings/settings-api";

type LegalSection = {
  heading: string;
  content: ReactNode;
};

type LegalPageProps = {
  pageSlug?: "terms-and-conditions" | "privacy-policy";
  endpointScope?: "public" | "private";
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
};

function splitContentToParagraphs(value?: string) {
  return (value ?? "")
    .split(/\n\s*\n|\r\n\s*\r\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function LegalPage({
  pageSlug,
  endpointScope = "public",
  eyebrow,
  title,
  intro,
  sections,
}: LegalPageProps) {
  const publicQuery = useGetPublicLegalPageQuery(pageSlug!, {
    skip: !pageSlug || endpointScope !== "public",
  });
  const privateQuery = useGetLegalPageQuery(pageSlug!, {
    skip: !pageSlug || endpointScope !== "private",
  });
  const legalPage = (
    endpointScope === "private" ? privateQuery.data : publicQuery.data
  )?.data.page;
  const resolvedTitle = legalPage?.title || title;
  const resolvedIntro = legalPage?.subtitle || intro;
  const resolvedSections =
    legalPage?.sections
      ?.filter((section) => section.isVisible !== false)
      .sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
      .map((section) => ({
        heading: section.title,
        content: (
          <>
            {splitContentToParagraphs(section.content || section.introduction).map(
              (paragraph, index) => (
                <p key={`${section.id}-${index}`}>{paragraph}</p>
              )
            )}
          </>
        ),
      })) ?? sections;

  return (
    <section className="bg-[linear-gradient(180deg,#eef7fd_0%,#ffffff_20%)] px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-[#d7e8f7] bg-white/95 p-8 shadow-[0_24px_80px_rgba(17,65,114,0.08)] sm:p-10 lg:p-14">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#18a8df]">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#1b2560] sm:text-5xl">
          {resolvedTitle}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[#4b5563] sm:text-lg">
          {resolvedIntro}
        </p>

        <div className="mt-10 space-y-8">
          {resolvedSections.map((section) => (
            <article
              key={section.heading}
              className="rounded-[24px] border border-[#e7eef7] bg-[#f8fbfe] p-6 sm:p-7"
            >
              <h2 className="text-2xl font-semibold tracking-tight text-[#2D3182]">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4 text-[15px] leading-7 text-[#4b5563] sm:text-base">
                {section.content}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
