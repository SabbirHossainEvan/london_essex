import PanelCard from "@/components/dashboard/panel-card";

type SupportHeaderCardProps = {
  title?: string;
  description?: string;
};

export default function SupportHeaderCard({
  title = "Support",
  description = "Need help? Submit a ticket and we'll get back to you.",
}: SupportHeaderCardProps) {
  return (
    <PanelCard className="rounded-[14px] px-5 py-4">
      <h2 className="text-[1.95rem] font-medium tracking-tight text-[#3345a6]">
        {title}
      </h2>
      <p className="mt-2 text-[15px] text-[#7383a0]">
        {description}
      </p>
    </PanelCard>
  );
}
