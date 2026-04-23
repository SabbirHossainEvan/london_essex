import Hero from "@/components/website/hero";
import CourseHelpCta from "@/components/website/course-help-cta";

import PartnersMarquee from "@/components/website/partners-marquee";
import HomeTrendingCoursesSection from "@/components/website/home-trending-courses-section";

import { homePartners } from "./partners-data";
import ProgressTrackingSection from "@/components/website/progress-tracking-section";
import Testimonials from "@/components/website/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PartnersMarquee partners={homePartners} />
      <HomeTrendingCoursesSection />
      <ProgressTrackingSection />
      <Testimonials />
      <CourseHelpCta />

    </>
  );
}
