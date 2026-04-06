import Hero from "@/components/website/hero";
import PartnersMarquee from "@/components/website/partners-marquee";
import TrendingCoursesMarquee from "@/components/website/trending-courses-marquee";
import { homePartners } from "./partners-data";
import { trendingCourses } from "./trending-courses-data";
import ProgressTrackingSection from "@/components/website/progress-tracking-section";
import Testimonials from "@/components/website/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PartnersMarquee partners={homePartners} />
      <TrendingCoursesMarquee courses={trendingCourses} />
      <ProgressTrackingSection />
      <Testimonials />
    </>
  );
}
