"use client";

import TrendingCoursesMarquee, {
  type TrendingCourse,
} from "@/components/website/trending-courses-marquee";
import { useGetCourseCatalogScreenQuery } from "@/lib/redux/features/courses/course-api";

const fallbackCourses: TrendingCourse[] = [
  {
    category: "Gas Engineer",
    title: "How To Become A Gas Engineer (New Entrants)",
    schedule: "Weekdays or Weekends",
    description:
      "Great if you are looking to become a Gas Safe registered Engineer and have no previous experience",
    ctaLabel: "View Details",
    href: "/courses",
  },
  {
    category: "Gas Engineer",
    title: "How To Become A Gas Engineer (Fast Track)",
    schedule: "Weekdays or Evenings",
    description:
      "Ideal if you want a structured route into the industry with flexible study options and practical support",
    ctaLabel: "View Details",
    href: "/courses",
  },
  {
    category: "Gas Engineer",
    title: "Gas Managed Learning Programme",
    schedule: "Weekend Friendly",
    description:
      "Designed for career changers who need tutor support, workshop sessions, and a clear path to certification",
    ctaLabel: "View Details",
    href: "/courses",
  },
];

function mapCatalogCardToTrendingCourse(card: {
  status?: string;
  badge?: { label?: string };
  title: string;
  subtitle?: string;
  schedule?: string;
  description?: string;
  shortDescription?: string;
  actions?: { primary?: { label?: string; url?: string } };
  slug: string;
}): TrendingCourse {
  return {
    category: card.badge?.label || card.status || "Course",
    title: card.title,
    schedule: card.subtitle || card.schedule || "",
    description: card.description || card.shortDescription || "",
    ctaLabel: card.actions?.primary?.label || "View Details",
    href: card.actions?.primary?.url || `/courses/${card.slug}`,
  };
}

export default function HomeTrendingCoursesSection() {
  const { data } = useGetCourseCatalogScreenQuery();

  const catalogCourses =
    data?.data.screen.cards?.map(mapCatalogCardToTrendingCourse) ?? [];
  const courses = catalogCourses.length > 0 ? catalogCourses : fallbackCourses;

  return (
    <TrendingCoursesMarquee
      courses={courses}
      eyebrow="EXPLORE"
      title={data?.data.screen.title || "Top trending courses"}
    />
  );
}
