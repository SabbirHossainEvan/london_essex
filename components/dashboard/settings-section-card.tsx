import PanelCard from "@/components/dashboard/panel-card";

type SettingsSectionCardProps = {
  title: string;
  description: string;
  actionLabel?: string;
  children: React.ReactNode;
};

export default function SettingsSectionCard({
  title,
  description,
  actionLabel = "Save Changes",
  children,
}: SettingsSectionCardProps) {
  return (
    <PanelCard className="rounded-[14px] p-4 sm:p-5">
      <div className="flex flex-col gap-4 border-b border-[#edf2f9] pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-[1.3rem] font-medium text-[#3345a6]">{title}</h2>
          <p className="mt-2 text-[14px] text-[#7383a0]">{description}</p>
        </div>

        <button
          type="button"
          className="rounded-[10px] bg-[#1ea6df] px-6 py-3 text-sm font-medium text-white shadow-[0_8px_18px_rgba(30,166,223,0.2)]"
        >
          {actionLabel}
        </button>
      </div>

      <div className="mt-5 rounded-[12px] border border-[#e4ecf8] bg-white p-4">
        {children}
      </div>
    </PanelCard>
  );
}
