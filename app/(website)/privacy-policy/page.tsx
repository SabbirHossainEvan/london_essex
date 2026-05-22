import type { Metadata } from "next";
import LegalPage from "@/components/website/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy | London & Essex Electrical Training",
  description:
    "Privacy policy for how London & Essex Electrical Training collects and uses personal information.",
};

const sections = [
  {
    heading: "Information We Collect",
    content: (
      <>
        <p>
          We may collect information you provide directly, such as your name,
          email address, phone number, booking details, and any messages sent
          through our forms or support channels.
        </p>
        <p>
          Basic technical information may also be collected when you use the
          site, including browser or device details that help us operate and
          improve the service.
        </p>
      </>
    ),
  },
  {
    heading: "How We Use Your Information",
    content: (
      <>
        <p>
          We use your information to respond to enquiries, manage bookings,
          provide learner support, send service-related updates, and improve our
          training experience.
        </p>
        <p>
          We do not use your personal information for purposes that are
          unrelated to the services you requested without an appropriate legal
          basis.
        </p>
      </>
    ),
  },
  {
    heading: "Sharing Your Data",
    content: (
      <>
        <p>
          We may share information with trusted service providers or partners
          when necessary to deliver training, process bookings, maintain
          systems, or comply with legal obligations.
        </p>
        <p>
          We only share the information that is reasonably required for those
          purposes.
        </p>
      </>
    ),
  },
  {
    heading: "Data Security And Retention",
    content: (
      <>
        <p>
          We take reasonable steps to protect personal information from
          unauthorised access, loss, misuse, or disclosure.
        </p>
        <p>
          Information is retained only for as long as needed for operational,
          legal, or regulatory reasons.
        </p>
      </>
    ),
  },
] satisfies Parameters<typeof LegalPage>[0]["sections"];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      pageSlug="privacy-policy"
      eyebrow="Privacy"
      title="Privacy Policy"
      intro="This page outlines the general ways we collect, use, and protect personal information when you interact with London & Essex Electrical Training."
      sections={sections}
    />
  );
}
