import PanelCard from "@/components/dashboard/panel-card";

type RecentActivityProps = {
  items: string[];
};

export default function RecentActivity({ items }: RecentActivityProps) {
  return (
    <PanelCard>
      <h3 className="text-xl font-semibold text-[#1f2a44]">Recent activity</h3>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item} className="flex gap-3">
            <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-[#18a8df]" />
            <p className="text-sm leading-7 text-[#516176]">{item}</p>
          </div>
        ))}
      </div>
    </PanelCard>
  );
}
