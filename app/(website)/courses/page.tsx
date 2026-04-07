import CoursesHero from "@/components/website/courses-hero";
import CoursesGridSection from "@/components/website/courses-grid-section";
import { coursesData } from "./courses-data";


export default function CoursesPage() {
  return (
    <>
      <CoursesHero />
      <CoursesGridSection courses={coursesData} />


    </>
  );
}
