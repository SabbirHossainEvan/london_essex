import FaqSection from "@/components/website/faq-section";
import ContactSection from "@/components/website/contact-section";
import { faqItems } from "../(home)/faq-data";

export default function ContactPage() {
  return (
    <>
      <ContactSection />
      <FaqSection items={faqItems} />
    </>
  );
}
