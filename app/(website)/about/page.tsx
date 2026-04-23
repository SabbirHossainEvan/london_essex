import AboutSection from "@/components/website/about-section";
import MissionSection from "@/components/website/mission-section";
import TeamSection, {
  type TeamScreenContent,
} from "@/components/website/team-section";
import { faqItems } from "../(home)/faq-data";
import FaqSection from "@/components/website/faq-section";
import { apiBaseUrl } from "@/lib/redux/api/base-api";

type TeamScreenResponse = {
  success: boolean;
  message: string;
  data: {
    screen: TeamScreenContent;
  };
};

async function getTeamScreen() {
  try {
    const response = await fetch(`${apiBaseUrl}/team/screen`, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as TeamScreenResponse;
    return data.data.screen;
  } catch {
    return null;
  }
}

export default async function AboutPage() {
  const teamScreen = await getTeamScreen();

  return (
    <>
      <AboutSection />
      <TeamSection screen={teamScreen ?? undefined} />
      <MissionSection />
      <FaqSection items={faqItems} />
    </>
  );
}
