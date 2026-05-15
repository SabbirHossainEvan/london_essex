type DashboardWelcomeBannerProps = {
  title: string;
  subtitle: string;
  summary?: {
    totalBookings?: number;
    activeBookings?: number;
    completedBookings?: number;
    cancelledBookings?: number;
  };
};

const summaryCards = [
  { key: "totalBookings", label: "Total bookings" },
  { key: "activeBookings", label: "Active bookings" },
  { key: "completedBookings", label: "Completed" },
  { key: "cancelledBookings", label: "Cancelled" },
] as const;

export default function DashboardWelcomeBanner({
  title,
  subtitle,
  summary,
}: DashboardWelcomeBannerProps) {
  return (
    <section className="rounded-[14px] border border-[#d9e7f7] bg-white px-5 py-5 shadow-[0_10px_24px_rgba(67,111,173,0.05)]">
      <h2 className="text-[1.85rem] font-medium tracking-tight text-[#3746a6]">
        {title}
      </h2>
      <p className="mt-2 text-[15px] text-[#7182a1]">{subtitle}</p>

      {summary ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((item) => (
            <div
              key={item.key}
              className="rounded-[12px] border border-[#e7eef8] bg-[#fbfdff] px-4 py-3"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b99b4]">
                {item.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-[#3746a6]">
                {summary[item.key] ?? 0}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
