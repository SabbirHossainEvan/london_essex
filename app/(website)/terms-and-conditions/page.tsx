import type { Metadata } from "next";
import LegalPage from "@/components/website/legal-page";

export const metadata: Metadata = {
  title: "Terms & Conditions | London & Essex Electrical Training",
  description:
    "Terms and conditions for using the London & Essex Electrical Training website and services.",
};

const sections = [
  {
    heading: "Using Our Website",
    content: (
      <>
        <p>
          By using the London & Essex Electrical Training website, you agree to
          use it lawfully and in a way that does not harm our business, systems,
          or other visitors.
        </p>
        <p>
          We may update, remove, or improve content, course details, and
          service information at any time without prior notice.
        </p>
      </>
    ),
  },
  {
    heading: "Bookings And Payments",
    content: (
      <>
        <p>
          Course places are subject to availability. A booking is only
          confirmed once payment arrangements have been accepted by our team.
        </p>
        <p>
          Prices, schedules, and course availability may change. If a course
          needs to be rescheduled or cancelled, we will contact you using the
          details you provided.
        </p>
      </>
    ),
  },
  {
    heading: "Course Information",
    content: (
      <>
        <p>
          We work to keep all training information accurate, but course
          requirements, awarding body guidance, and practical arrangements may
          change from time to time.
        </p>
        <p>
          It is your responsibility to make sure the course you choose is
          suitable for your experience level, certification goals, and any
          relevant entry requirements.
        </p>
      </>
    ),
  },
  {
    heading: "Liability",
    content: (
      <>
        <p>
          To the extent permitted by law, we are not responsible for indirect
          or consequential loss arising from use of this website or reliance on
          general information published here.
        </p>
        <p>
          Nothing in these terms limits liability where it cannot legally be
          excluded.
        </p>
      </>
    ),
  },
  {
    heading: "Contact Us",
    content: (
      <>
        <p>
          If you have questions about these terms, please contact our team at
          <a
            href="mailto:info@londonessexelectrical.co.uk"
            className="ml-1 font-medium text-[#2D3182] underline underline-offset-4"
          >
            info@londonessexelectrical.co.uk
          </a>
          .
        </p>
      </>
    ),
  },
] satisfies Parameters<typeof LegalPage>[0]["sections"];

export default function TermsAndConditionsPage() {
  return (
    <LegalPage
      pageSlug="terms-and-conditions"
      eyebrow="Legal"
      title="Terms & Conditions"
      intro="These terms explain how our website and training services may be used. They are intended to provide a clear summary for visitors, learners, and customers."
      sections={sections}
    />
  );
}
