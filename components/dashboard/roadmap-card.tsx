import PanelCard from "@/components/dashboard/panel-card";

type RoadmapCardProps = {
  steps: string[];
};

export default function RoadmapCard({ steps }: RoadmapCardProps) {
  return (
    <PanelCard>
      <h3 className="text-xl font-semibold text-[#1f2a44]">
        Completion roadmap
      </h3>
      <div className="mt-6 space-y-4">
        {steps.map((step, index) => (
          <div key={step} className="flex gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#123d77] text-sm font-semibold text-white">
              {index + 1}
            </div>
            <p className="pt-1 text-sm text-[#516176]">{step}</p>
          </div>
        ))}
      </div>
    </PanelCard>
  );
}
