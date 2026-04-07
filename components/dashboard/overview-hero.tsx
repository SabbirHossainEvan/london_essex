export default function OverviewHero() {
  return (
    <section className="rounded-[28px] bg-[linear-gradient(135deg,_#123d77_0%,_#18a8df_100%)] px-6 py-8 text-white shadow-[0_24px_60px_rgba(18,61,119,0.18)] sm:px-8">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-white/75">
        Dashboard Overview
      </p>
      <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
        Keep your training on track.
      </h2>
      <p className="mt-4 max-w-[640px] text-sm leading-7 text-white/85 sm:text-base">
        Review your course progress, upcoming sessions, and learning milestones
        from one place.
      </p>
    </section>
  );
}
