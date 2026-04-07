import PanelCard from "@/components/dashboard/panel-card";

export default function SupportHeaderCard() {
  return (
    <PanelCard className="rounded-[14px] px-5 py-4">
      <h2 className="text-[1.95rem] font-medium tracking-tight text-[#3345a6]">
        Support
      </h2>
      <p className="mt-2 text-[15px] text-[#7383a0]">
        Need help? Submit a ticket and we&apos;ll get back to you.
      </p>
    </PanelCard>
  );
}
