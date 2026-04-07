import PanelCard from "@/components/dashboard/panel-card";

const quickActions = [
  {
    title: "Checklist Saved",
    description: "Your progress on Section B has been saved automatically.",
    date: "3/9/2020",
    dot: "bg-[#23b6f2]",
  },
  {
    title: "Document Verified",
    description: "Your 18th Edition certificate has been verified automatically.",
    date: "3/9/2020",
    dot: "bg-[#27b35a]",
  },
  {
    title: "Checklist Saved",
    description: "Your 18th Edition Wiring Regulations section was updated.",
    date: "3/9/2020",
    dot: "bg-[#e48a14]",
  },
];

export default function QuickActionsCard() {
  return (
    <PanelCard className="p-0">
      <div className="border-b border-[#e8eff8] px-5 py-4">
        <h3 className="text-[1.2rem] font-medium text-[#3a49aa]">
          Quick Actions
        </h3>
      </div>

      <div className="space-y-4 p-5">
        {quickActions.map((item) => (
          <div
            key={`${item.title}-${item.date}`}
            className="rounded-[14px] border border-[#e7eef8] bg-[#fcfeff] p-4"
          >
            <div className="flex gap-3">
              <span className={`mt-2 h-2.5 w-2.5 rounded-full ${item.dot}`} />
              <div>
                <p className="font-medium text-[#3646a5]">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#6e7f9d]">
                  {item.description}
                </p>
                <p className="mt-2 text-xs text-[#a0aec1]">{item.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PanelCard>
  );
}
