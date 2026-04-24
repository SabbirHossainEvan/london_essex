"use client";

import CoursesGridSection from "@/components/website/courses-grid-section";
import { coursesData } from "@/app/(website)/courses/courses-data";
import { useGetCourseCatalogScreenQuery } from "@/lib/redux/features/courses/course-api";
import { mapRelatedCourseToSummary } from "@/lib/redux/features/courses/course-mappers";

export default function WebsiteCoursesCatalogSection() {
  const { data } = useGetCourseCatalogScreenQuery();

  const apiCourses =
    data?.data.screen.cards?.map((card) => mapRelatedCourseToSummary(card)) ?? [];

  return (
    <CoursesGridSection
      title={data?.data.screen.title || "Course Catalog"}
      courses={apiCourses.length > 0 ? apiCourses : coursesData}
    />
  );
}
