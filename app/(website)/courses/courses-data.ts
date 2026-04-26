export type CourseSummary = {
  id?: string;
  slug: string;
  bookingFlow: "standard" | "am2";
  category: string;
  title: string;
  schedule: string;
  description: string;
  qualification: string;
  location: string;
  entryRequirements: string;
  duration: string;
  price: string;
  vatLabel: string;
  heroImage: string;
  gallery: string[];
  learning: string;
  delivery: string;
  additionalInfo: string;
};

export const coursesData: CourseSummary[] = [
  {
    slug: "am2-assessment-preparation",
    bookingFlow: "am2",
    category: "Gas Engineer",
    title: "AM2 Assessment Preparation",
    schedule: "Weekdays or Weekends",
    description:
      "Comprehensive preparation course for the final AM2 assessment. Covers all sections including safe isolation, composite installation, and fault diagnosis.",
    qualification: "City & Guilds 2356-02",
    location: "Los Angeles",
    entryRequirements: "None",
    duration: "7 Weeks (Mon - Fri) or 18 Weekends",
    price: "£3,195.00",
    vatLabel: "inc VAT",
    heroImage: "/hero-2.png",
    gallery: ["/hero-2.png", "/hero-1.png", "/hero-collage.png", "/hero-2.png"],
    learning:
      "In this course, you'll gain comprehensive preparation for the AM2 assessment, covering safe isolation procedures, composite installations, and effective fault diagnosis techniques.",
    delivery:
      "You will learn through guided practical sessions, tutor-led theory refreshers, mock assessments, and one-to-one feedback to build confidence before your final exam.",
    additionalInfo:
      "Training takes place in modern workshop facilities with small group support. Flexible scheduling options are available for weekday and weekend learners.",
  },
  {
    slug: "how-to-become-a-gas-engineer-new-entrants",
    bookingFlow: "standard",
    category: "Gas Engineer",
    title: "How To Become A Gas Engineer (New Entrants)",
    schedule: "Weekdays or Weekends",
    description:
      "Great if you are looking to become a Gas Safe registered Engineer and have no previous experience",
    qualification: "Managed Learning Programme",
    location: "London Campus",
    entryRequirements: "No prior experience required",
    duration: "24 Weeks Flexible",
    price: "£4,295.00",
    vatLabel: "inc VAT",
    heroImage: "/hero-1.png",
    gallery: ["/hero-1.png", "/hero-2.png", "/hero-collage.png", "/hero-1.png"],
    learning:
      "Start from the fundamentals and build practical competence across installation, maintenance, testing, and safety procedures for domestic gas work.",
    delivery:
      "The programme combines workshop practice, theory sessions, portfolio guidance, and tutor support designed for complete beginners entering the industry.",
    additionalInfo:
      "Ideal for career changers seeking a structured route into the gas industry with flexible study plans and practical milestones.",
  },
  {
    slug: "how-to-become-a-gas-engineer-fast-track",
    bookingFlow: "standard",
    category: "Gas Engineer",
    title: "How To Become A Gas Engineer (Fast Track)",
    schedule: "Weekdays or Evenings",
    description:
      "Ideal if you want a structured route into the industry with flexible study options and practical support",
    qualification: "Fast Track Pathway",
    location: "Essex Campus",
    entryRequirements: "Basic technical aptitude recommended",
    duration: "16 Weeks",
    price: "£3,895.00",
    vatLabel: "inc VAT",
    heroImage: "/hero-collage.png",
    gallery: ["/hero-collage.png", "/hero-2.png", "/hero-1.png", "/hero-collage.png"],
    learning:
      "This pathway focuses on accelerated progress through hands-on practice, core gas safety concepts, installation standards, and assessment preparation.",
    delivery:
      "Students move through an intensive schedule of practical workshop sessions, theory refreshers, and targeted tutor feedback.",
    additionalInfo:
      "A strong option for motivated learners who want to qualify faster while still receiving structured practical guidance.",
  },
  {
    slug: "gas-managed-learning-programme",
    bookingFlow: "standard",
    category: "Gas Engineer",
    title: "Gas Managed Learning Programme",
    schedule: "Weekend Friendly",
    description:
      "Designed for career changers who need tutor support, workshop sessions, and a clear path to certification",
    qualification: "Managed Learning Programme",
    location: "Hybrid Delivery",
    entryRequirements: "Interview and enrolment review",
    duration: "28 Weeks",
    price: "£4,650.00",
    vatLabel: "inc VAT",
    heroImage: "/hero-1.png",
    gallery: ["/hero-1.png", "/hero-collage.png", "/hero-2.png", "/hero-1.png"],
    learning:
      "The programme supports long-form skill development through guided practice, safety-first teaching, and staged preparation for industry certification.",
    delivery:
      "Weekend-friendly delivery includes tutor mentoring, practical workshop attendance, online theory elements, and progress reviews.",
    additionalInfo:
      "Best suited for learners balancing training with work or family commitments who still want structured tutor support.",
  },
  {
    slug: "electrical-inspection-and-testing",
    bookingFlow: "standard",
    category: "Electrical",
    title: "Electrical Inspection & Testing",
    schedule: "Evenings or Weekends",
    description:
      "Build confidence in inspection procedures, testing methods, certification, and fault finding for domestic and commercial systems",
    qualification: "City & Guilds 2391",
    location: "London Campus",
    entryRequirements: "Electrical background recommended",
    duration: "6 Weeks",
    price: "£1,795.00",
    vatLabel: "inc VAT",
    heroImage: "/hero-2.png",
    gallery: ["/hero-2.png", "/hero-1.png", "/hero-collage.png", "/hero-2.png"],
    learning:
      "Gain strong grounding in inspection routines, testing sequences, certification, and practical interpretation of electrical standards.",
    delivery:
      "Delivered through practical assessment drills, classroom review, and guided feedback on reporting and compliance.",
    additionalInfo:
      "Suitable for electricians looking to strengthen their testing knowledge and certification workflow.",
  },
  {
    slug: "domestic-plumbing-foundation",
    bookingFlow: "standard",
    category: "Plumbing",
    title: "Domestic Plumbing Foundation",
    schedule: "Weekday Intensive",
    description:
      "A hands-on introduction to domestic plumbing systems, pipework, fittings, maintenance, and practical installation skills",
    qualification: "Foundation Certificate",
    location: "Essex Campus",
    entryRequirements: "No previous experience required",
    duration: "10 Weeks",
    price: "£2,250.00",
    vatLabel: "inc VAT",
    heroImage: "/hero-collage.png",
    gallery: ["/hero-collage.png", "/hero-1.png", "/hero-2.png", "/hero-collage.png"],
    learning:
      "Learn the plumbing essentials including pipe installation, maintenance routines, fittings, water regulations, and practical workshop techniques.",
    delivery:
      "Training is workshop-first with tutor demonstrations, structured practice, and progressive assessments.",
    additionalInfo:
      "A strong entry point for new learners who want practical plumbing experience before moving into advanced qualifications.",
  },
];

export function getCourseBySlug(slug: string) {
  return coursesData.find((course) => course.slug === slug);
}
