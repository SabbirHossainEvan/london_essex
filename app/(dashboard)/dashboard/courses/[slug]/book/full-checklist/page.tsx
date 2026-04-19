import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/app/(website)/courses/courses-data";
import Am2FullChecklistPage from "@/components/dashboard/am2-full-checklist-page";

export default async function DashboardCourseFullChecklistPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ flow?: string }>;
}) {
  const { slug } = await params;
  const { flow } = await searchParams;
  const course = getCourseBySlug(slug);

  if (!course || course.slug !== "am2-assessment-preparation") {
    notFound();
  }

  const resolvedFlow =
    flow === "am2e" || flow === "am2e-v1" ? flow : "am2";

  return <Am2FullChecklistPage course={course} flow={resolvedFlow} />;
}
