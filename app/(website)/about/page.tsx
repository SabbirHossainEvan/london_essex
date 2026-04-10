import AboutSection from "@/components/website/about-section";
import MissionSection from "@/components/website/mission-section";
import TeamSection from "@/components/website/team-section";
import { faqItems } from "../(home)/faq-data";
import FaqSection from "@/components/website/faq-section";

export default function AboutPage() {
  return <>
    <AboutSection />
    <TeamSection />
    <MissionSection />
    <FaqSection items={faqItems} />
  </>;
}
