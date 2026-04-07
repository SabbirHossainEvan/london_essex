import PanelCard from "@/components/dashboard/panel-card";

type Milestone = {
  title: string;
  value: string;
  detail: string;
};

type MilestoneGridProps = {
  milestones: Milestone[];
};

export default function MilestoneGrid({
  milestones,
}: MilestoneGridProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {milestones.map((item) => (
        <PanelCard key={item.title}>
          <p className="text-sm font-medium text-[#66758b]">{item.title}</p>
          <p className="mt-3 text-4xl font-semibold text-[#1f2a44]">
            {item.value}
          </p>
          <p className="mt-4 text-sm leading-7 text-[#516176]">{item.detail}</p>
        </PanelCard>
      ))}
    </div>
  );
}
