import PanelCard from "@/components/dashboard/panel-card";

type PreferencesCardProps = {
  items: string[];
};

export default function PreferencesCard({ items }: PreferencesCardProps) {
  return (
    <PanelCard>
      <h3 className="text-xl font-semibold text-[#1f2a44]">Preferences</h3>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <label
            key={item}
            className="flex items-center justify-between gap-4 rounded-xl bg-[#f4f8fc] p-4"
          >
            <span className="text-sm text-[#1f2a44]">{item}</span>
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </label>
        ))}
      </div>
    </PanelCard>
  );
}
