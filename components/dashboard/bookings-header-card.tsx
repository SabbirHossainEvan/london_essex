import PanelCard from "@/components/dashboard/panel-card";

export default function BookingsHeaderCard() {
  return (
    <PanelCard className="rounded-[14px] px-5 py-4">
      <h2 className="text-[1.95rem] font-medium tracking-tight text-[#3345a6]">
        My Bookings
      </h2>
      <p className="mt-2 text-[15px] text-[#7383a0]">
        Manage your upcoming courses and view past assessments.
      </p>
    </PanelCard>
  );
}
