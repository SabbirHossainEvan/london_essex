import CoursesHero from "@/components/website/courses-hero";
import FooterSection from "@/components/website/footer-section";
import { footerContacts, footerLegalLinks, footerSocials } from "../(home)/footer-data";
import CourseHelpCta from "@/components/website/course-help-cta";

export default function CoursesPage() {
  return (
    <>
      <CoursesHero />
      <CourseHelpCta />

    </>
  );
}
