import type { CourseSummary } from "@/app/(website)/courses/courses-data";
import type {
  CourseCatalogCard,
  CourseDetailCourse,
  CourseDetailRelatedCourse,
} from "@/lib/redux/features/courses/course-api";

function normalizeCurrency(value: string) {
  return value.replace(/\u00c2\u00a3/g, "\u00a3");
}

function normalizeImageUrl(value: string) {
  if (!value) {
    return value;
  }

  if (!value.startsWith("https://placehold.co/")) {
    return value;
  }

  const url = new URL(value);

  if (!url.pathname.endsWith(".png")) {
    url.pathname = `${url.pathname}.png`;
  }

  return url.toString();
}

function isNonEmptyString(value: string | undefined): value is string {
  return typeof value === "string" && value.length > 0;
}

function buildRelatedSchedule(course: CourseDetailRelatedCourse) {
  if (course.session) {
    return [course.session.date, course.session.time, course.session.location]
      .filter(Boolean)
      .join(" | ");
  }

  return "";
}

function mapSectionsToAccordionContent(sections: CourseDetailCourse["sections"]) {
  return {
    learning: sections?.[0]?.content ?? "",
    delivery: sections?.[1]?.content ?? "",
    additionalInfo: sections?.[2]?.content ?? "",
  };
}

export function mapDetailCourseToSummary(course: CourseDetailCourse): CourseSummary {
  const accordion = mapSectionsToAccordionContent(course.sections ?? []);
  const gallery = course.media?.galleryImages?.length
    ? course.media.galleryImages.map(normalizeImageUrl)
    : [course.media?.thumbnailUrl || course.thumbnailUrl]
        .filter(isNonEmptyString)
        .map(normalizeImageUrl) as string[];
  const heroImage = normalizeImageUrl(
    course.media?.thumbnailUrl || course.thumbnailUrl || ""
  );

  return {
    id: course.id,
    slug: course.slug,
    bookingFlow:
      course.slug === "am2-assessment-preparation" ? "am2" : "standard",
    category: course.badge?.label ?? course.status ?? "Course",
    title: course.title,
    schedule: course.schedule,
    description: course.description || course.shortDescription,
    qualification: course.qualification || "",
    location: course.location || "",
    entryRequirements: course.entryRequirements || "",
    duration: course.duration || "",
    price: normalizeCurrency(course.pricing?.displayPrice || ""),
    vatLabel: course.pricing?.note || "",
    heroImage,
    gallery,
    learning: accordion.learning,
    delivery: accordion.delivery,
    additionalInfo: accordion.additionalInfo,
  };
}

export function mapRelatedCourseToSummary(
  course: CourseDetailRelatedCourse | CourseCatalogCard
): CourseSummary {
  const badgeLabel = "badge" in course ? course.badge?.label : undefined;
  const isCatalogCard = "price" in course && "currency" in course;
  const priceDisplay =
    "pricing" in course
      ? course.pricing?.displayPrice
      : isCatalogCard && typeof course.price === "number" && course.currency
        ? new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: course.currency,
          }).format(course.price)
        : "";
  const heroImage =
    normalizeImageUrl(
      ("image" in course ? course.image?.url : undefined) ||
        ("thumbnailUrl" in course ? course.thumbnailUrl : undefined) ||
        ""
    );

  return {
    id: course.id,
    slug: course.slug,
    bookingFlow:
      course.slug === "am2-assessment-preparation" ? "am2" : "standard",
    category: badgeLabel ?? ("status" in course ? course.status : "Course"),
    title: course.title,
    schedule:
      "session" in course
        ? buildRelatedSchedule(course)
        : isCatalogCard
          ? course.subtitle || course.schedule || ""
          : "",
    description:
      course.description ||
      ("shortDescription" in course ? course.shortDescription : ""),
    qualification: "",
    location: "session" in course ? course.session?.location || "" : "",
    entryRequirements: "",
    duration:
      "duration" in course && typeof course.duration === "string"
        ? course.duration
        : "",
    price: normalizeCurrency(priceDisplay || ""),
    vatLabel: "",
    heroImage,
    gallery: heroImage ? [heroImage] : [],
    learning: "",
    delivery: "",
    additionalInfo: "",
  };
}
