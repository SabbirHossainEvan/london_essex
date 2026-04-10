import Image from "next/image";

export default function MissionSection() {
  return (
    <section className="bg-[#fafbfc] px-4 py-16 sm:px-6 lg:px-10 xl:px-16" id="mission-section">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          <div className="max-w-[560px]">
            <span className="inline-block rounded-full bg-[#ecf6fa] px-3.5 py-1.5 text-[0.7rem] font-bold tracking-[0.08em] uppercase text-[#12a1d7]">
              Our Mission
            </span>
            <h2 className="mt-6 text-[2.3rem] font-medium leading-[1.1] tracking-tight text-[#38338f] sm:text-[2.8rem]">
              Building Skilled Electrical Professionals for the Future
            </h2>
            <p className="mt-6 text-[1.05rem] leading-7 text-[#737a8c]">
              We simplify the journey from course application to certification by
              guiding candidates through assessments, approvals, and hands-on
              training.
            </p>

            <div className="mt-8">
              <button className="rounded-xl bg-[#00a3e0] px-6 py-3 font-medium text-white shadow-[0_4px_0_#333333] transition-all hover:-translate-y-[2px] hover:shadow-[0_6px_0_#333333] active:translate-y-[2px] active:shadow-[0_0px_0_#333333]">
                Join Our Team
              </button>
            </div>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2.5rem]">
            <Image
              src="/mission_office_team.png"
              alt="Team collaborating"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
