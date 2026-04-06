import Hero from "@/components/website/hero";
import PartnersMarquee from "@/components/website/partners-marquee";
import TrendingCoursesMarquee from "@/components/website/trending-courses-marquee";
import { homePartners } from "./partners-data";
import { trendingCourses } from "./trending-courses-data";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PartnersMarquee partners={homePartners} />
      <TrendingCoursesMarquee courses={trendingCourses} />
    </>
  );
}
