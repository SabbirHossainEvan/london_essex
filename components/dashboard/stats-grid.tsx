type StatItem = {
  label: string;
  value: string;
};

type StatsGridProps = {
  stats: StatItem[];
};

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className="rounded-2xl border border-[#dce8f3] bg-white p-5 shadow-[0_12px_30px_rgba(103,130,170,0.08)]"
        >
          <p className="text-sm font-medium text-[#6c7b91]">{stat.label}</p>
          <p className="mt-3 text-3xl font-semibold text-[#1f2a44]">
            {stat.value}
          </p>
        </article>
      ))}
    </section>
  );
}
