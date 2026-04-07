import MilestoneGrid from "@/components/dashboard/milestone-grid";
import RoadmapCard from "@/components/dashboard/roadmap-card";
import SectionHeader from "@/components/dashboard/section-header";
import { milestones, roadmapSteps } from "../dashboard-data";

export default function DashboardProgressPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Progress"
        description="Track the learning milestones that move you toward certification."
      />
      <MilestoneGrid milestones={milestones} />
      <RoadmapCard steps={roadmapSteps} />
    </div>
  );
}
