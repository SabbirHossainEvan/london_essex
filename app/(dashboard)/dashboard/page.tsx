"use client";

import React from "react";
import DashboardWelcomeBanner from "@/components/dashboard/dashboard-welcome-banner";
import RecentActivityFeed from "@/components/dashboard/recent-activity-feed";
import RunningCourseCard from "@/components/dashboard/running-course-card";
import UpcomingCourseEmptyCard from "@/components/dashboard/upcoming-course-empty-card";
import { useGetBookingDashboardQuery } from "@/lib/redux/features/bookings/booking-api";

function resolveErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  return "We could not load your dashboard right now.";
}

function normalizeDashboardUrl(value?: string) {
  if (!value) {
    return undefined;
  }

  if (value.startsWith("/bookings/")) {
    return `/dashboard${value}`;
  }

  return value;
}

function normalizeRunningBookingProgressTitle(
  booking: NonNullable<
    NonNullable<
      ReturnType<typeof useGetBookingDashboardQuery>["data"]
    >["data"]["dashboard"]["runningCourse"]
  >["booking"]
) {
  if (!booking) {
    return booking;
  }

  const courseTitle = booking.course?.title?.trim();
  const currentProgressTitle = booking.progress?.title?.trim();
  const isAm2AssessmentPreparation = courseTitle === "AM2 Assessment Preparation";

  if (!isAm2AssessmentPreparation) {
    return booking;
  }

  const expectedProgressTitle = `${courseTitle} Readiness Progress`;

  if (currentProgressTitle === expectedProgressTitle) {
    return booking;
  }

  return {
    ...booking,
    progress: {
      ...booking.progress,
      title: expectedProgressTitle,
    },
  };
}

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useGetBookingDashboardQuery();
  const dashboard = data?.data.dashboard;

  const runningBooking = dashboard?.runningCourse?.booking
    ? {
        ...normalizeRunningBookingProgressTitle(dashboard.runningCourse.booking),
        action: dashboard.runningCourse.booking.action
          ? {
              ...dashboard.runningCourse.booking.action,
              url: normalizeDashboardUrl(dashboard.runningCourse.booking.action.url),
            }
          : undefined,
        cards: {
          documents: dashboard.runningCourse.booking.cards?.documents
            ? {
                ...dashboard.runningCourse.booking.cards.documents,
                action: dashboard.runningCourse.booking.cards.documents.action
                  ? {
                      ...dashboard.runningCourse.booking.cards.documents.action,
                      url: normalizeDashboardUrl(
                        dashboard.runningCourse.booking.cards.documents.action.url
                      ),
                    }
                  : undefined,
              }
            : undefined,
          signatures: dashboard.runningCourse.booking.cards?.signatures
            ? {
                ...dashboard.runningCourse.booking.cards.signatures,
                action: dashboard.runningCourse.booking.cards.signatures.action
                  ? {
                      ...dashboard.runningCourse.booking.cards.signatures.action,
                      url: normalizeDashboardUrl(
                        dashboard.runningCourse.booking.cards.signatures.action.url
                      ),
                    }
                  : undefined,
              }
            : undefined,
        },
      }
    : null;

  const upcomingBooking = dashboard?.upcomingCourse?.booking
    ? {
        ...dashboard.upcomingCourse.booking,
        action: dashboard.upcomingCourse.booking.action
          ? {
              ...dashboard.upcomingCourse.booking.action,
              url: normalizeDashboardUrl(dashboard.upcomingCourse.booking.action.url),
            }
          : undefined,
      }
    : null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <section className="animate-pulse rounded-[14px] border border-[#d9e7f7] bg-white px-5 py-5 shadow-[0_10px_24px_rgba(67,111,173,0.05)]">
          <div className="h-8 w-72 rounded bg-[#e7eef8]" />
          <div className="mt-3 h-5 w-[32rem] max-w-full rounded bg-[#eef4fb]" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-[12px] border border-[#e7eef8] bg-[#fbfdff] px-4 py-3">
                <div className="h-4 w-24 rounded bg-[#e7eef8]" />
                <div className="mt-3 h-7 w-12 rounded bg-[#eef4fb]" />
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.55fr)]">
          <div className="animate-pulse rounded-2xl border border-[#dce8f3] bg-white p-6 shadow-[0_12px_30px_rgba(103,130,170,0.08)]">
            <div className="h-6 w-40 rounded bg-[#e7eef8]" />
            <div className="mt-5 h-64 rounded bg-[#eef4fb]" />
          </div>
          <div className="animate-pulse rounded-2xl border border-[#dce8f3] bg-white p-6 shadow-[0_12px_30px_rgba(103,130,170,0.08)]">
            <div className="h-6 w-40 rounded bg-[#e7eef8]" />
            <div className="mt-5 space-y-4">
              <div className="h-20 rounded bg-[#eef4fb]" />
              <div className="h-20 rounded bg-[#eef4fb]" />
              <div className="h-20 rounded bg-[#eef4fb]" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="rounded-2xl border border-[#fecaca] bg-[#fff3f3] px-5 py-4 text-sm text-[#dc2626]">
        {resolveErrorMessage(error)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardWelcomeBanner
        title={dashboard.welcome.title}
        subtitle={dashboard.welcome.subtitle}
        summary={dashboard.summary}
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.55fr)]">
        <RunningCourseCard
          title={dashboard.runningCourse?.title || "Running Course"}
          booking={runningBooking}
          emptyState={dashboard.runningCourse?.emptyState}
        />
        <RecentActivityFeed
          title={dashboard.recentActivity?.title || "Recent Activity"}
          items={dashboard.recentActivity?.items || []}
          emptyState={dashboard.recentActivity?.emptyState}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.55fr)]">
        <UpcomingCourseEmptyCard
          title={dashboard.upcomingCourse?.title || "Upcoming Course"}
          booking={upcomingBooking}
          emptyState={dashboard.upcomingCourse?.emptyState}
        />
      </section>
    </div>
  );
}
