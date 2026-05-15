import PanelCard from "@/components/dashboard/panel-card";

type RecentActivityFeedProps = {
  title: string;
  items: Array<{
    id: string;
    title: string;
    description?: string;
    relativeTime?: string;
    tone?: string;
  }>;
  emptyState?: {
    title?: string;
    description?: string;
  } | null;
};

function resolveToneClasses(tone?: string) {
  switch (tone) {
    case "success":
      return "bg-[#eefcf2] text-[#2aa35b]";
    case "warning":
      return "bg-[#fff5ea] text-[#ff9e2c]";
    case "danger":
      return "bg-[#fff1f1] text-[#dc2626]";
    default:
      return "bg-[#f3f6ff] text-[#4e66df]";
  }
}

export default function RecentActivityFeed({
  title,
  items,
  emptyState,
}: RecentActivityFeedProps) {
  return (
    <PanelCard className="p-0">
      <div className="border-b border-[#e8eff8] px-5 py-4">
        <h3 className="text-[1.2rem] font-medium text-[#3a49aa]">{title}</h3>
      </div>

      <div className="space-y-4 p-5">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-[14px] border border-[#e7eef8] bg-[#fcfeff] p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${resolveToneClasses(item.tone)}`}
                  >
                    •
                  </span>
                  <div>
                    <p className="font-medium text-[#3646a5]">{item.title}</p>
                    <p className="mt-1 text-sm text-[#6e7f9d]">
                      {item.description || "Dashboard activity"}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-[#9eabc0]">
                  {item.relativeTime || ""}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[14px] border border-[#e7eef8] bg-[#fcfeff] p-5 text-center">
            <p className="text-lg font-medium text-[#3646a5]">
              {emptyState?.title || "No recent activity"}
            </p>
            <p className="mt-2 text-sm text-[#6e7f9d]">
              {emptyState?.description || "Your latest dashboard updates will appear here."}
            </p>
          </div>
        )}
      </div>
    </PanelCard>
  );
}
