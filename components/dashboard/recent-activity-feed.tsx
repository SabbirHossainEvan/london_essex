import PanelCard from "@/components/dashboard/panel-card";

const activities = [
  {
    title: "New user registration",
    subtitle: "Sarah Johnson",
    time: "2 minutes ago",
    dot: "bg-[#f3f6ff] text-[#4e66df]",
  },
  {
    title: "Payment received",
    subtitle: "Invoice #INV-001",
    time: "2 hours ago",
    dot: "bg-[#eefcf2] text-[#2aa35b]",
  },
];

export default function RecentActivityFeed() {
  return (
    <PanelCard className="p-0">
      <div className="border-b border-[#e8eff8] px-5 py-4">
        <h3 className="text-[1.2rem] font-medium text-[#3a49aa]">
          Recent Activity
        </h3>
      </div>

      <div className="space-y-4 p-5">
        {activities.map((item) => (
          <div
            key={`${item.title}-${item.time}`}
            className="rounded-[14px] border border-[#e7eef8] bg-[#fcfeff] p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${item.dot}`}
                >
                  •
                </span>
                <div>
                  <p className="font-medium text-[#3646a5]">{item.title}</p>
                  <p className="mt-1 text-sm text-[#6e7f9d]">{item.subtitle}</p>
                </div>
              </div>
              <span className="text-xs text-[#9eabc0]">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </PanelCard>
  );
}
