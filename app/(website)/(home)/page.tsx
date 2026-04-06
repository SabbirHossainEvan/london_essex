import Hero from "@/components/website/hero";
import PartnersMarquee from "@/components/website/partners-marquee";
import { homePartners } from "./partners-data";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PartnersMarquee partners={homePartners} />
    </>
  );
}
