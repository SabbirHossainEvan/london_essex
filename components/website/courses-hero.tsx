import Image from "next/image";

type CoursesHeroProps = {
  title?: string;
  description?: string;
};

export default function CoursesHero({
  title = "Industry-Leading Courses for Professionals",
  description = "Join over 20,000 successful students who have trained with London & Essex. Select a course below to view full details, entry requirements, and upcoming start dates",
}: CoursesHeroProps) {
  return (
    <section className="bg-[#373792] px-4 pb-10 pt-6 sm:px-6 sm:pb-12 lg:px-10 lg:pt-8 xl:px-16">
      <div className="mx-auto max-w-[1480px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,880px)_minmax(360px,520px)] lg:items-start lg:gap-10">
          <div>
            <h1 className="max-w-[760px] text-[2.35rem] font-medium leading-[0.98] tracking-[-0.04em] text-white sm:text-[3rem] lg:text-[3.55rem] xl:text-[3.8rem]">
              {title}
            </h1>
          </div>

          <div className="max-w-[520px] lg:justify-self-end lg:pt-2">
            <p className="text-lg leading-[1.45] text-[#d7d3ff] sm:text-[1.05rem]">
              {description}
            </p>
          </div>
        </div>

        <div className="relative mt-10 overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-[0_20px_80px_rgba(13,18,89,0.22)] min-h-[420px] sm:min-h-[500px] lg:mt-12 lg:min-h-[580px]">
          <div className="relative z-10 grid min-h-[420px] grid-cols-1 gap-6 p-5 sm:min-h-[500px] sm:p-8 lg:min-h-[580px] lg:grid-cols-[minmax(0,420px)_1fr] lg:items-end lg:gap-8 lg:p-10">
            <div className="order-2 max-w-[440px] rounded-[24px] bg-[#2d2f85] p-6 shadow-[0_16px_50px_rgba(45,47,133,0.22)] lg:order-1 lg:mb-3">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#9ee7ff]">
                Courses Overview
              </p>
              <h2 className="mt-3 text-2xl font-semibold leading-tight text-white sm:text-[2rem]">
                Explore accredited training pathways with flexible start dates
              </h2>
              <p className="mt-4 text-sm leading-6 text-[#d8ddff] sm:text-base">
                Browse hands-on programmes in gas, electrical, plumbing, and renewables
                designed for new entrants and experienced professionals.
              </p>
            </div>

            <div className="relative order-1 min-h-[320px] overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,_#f8fcff_0%,_#eef7ff_100%)] lg:order-2 lg:min-h-[560px]">
              <Image
                src="/hero-2.png"
                alt="Construction training session"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 900px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1f2770]/18 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
