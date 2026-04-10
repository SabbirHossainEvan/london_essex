import Image from "next/image";

const highlights = [
  {
    value: "20K+",
    label: "Students trained",
  },
  {
    value: "18+",
    label: "Years experience",
  },
  {
    value: "98%",
    label: "Pass rate support",
  },
];


export default function AboutSection() {
  return (
    <section className="bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#eef7ff_56%,_#e8f3ff_100%)] px-4 py-12 sm:px-6 lg:px-10 xl:px-16">
      <div className="mx-auto max-w-[1480px]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.85fr)] lg:items-center">
          <div>
            <span className="rounded-full border border-[#d7ecfb] bg-[#edf7ff] px-4 py-2 text-xs font-semibold tracking-[0.16em] text-[#19a2dd]">
              ABOUT US
            </span>
            <h1 className="mt-6 max-w-[760px] text-[2.6rem] font-semibold leading-[0.96] tracking-[-0.04em] text-[#38439e] sm:text-[3.2rem] lg:text-[4.2rem]">
              Built to help future tradespeople train with confidence
            </h1>
            <p className="mt-6 max-w-[720px] text-[1.02rem] leading-8 text-[#67708a] sm:text-[1.08rem]">
              London & Essex Electrical Training delivers practical, career-focused
              programmes across electrical, gas, plumbing, and renewables. We help
              learners move from interest to certification through supportive tutors,
              structured training, and real workshop experience.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[18px] border border-[#d8e7f5] bg-white p-5 shadow-[0_12px_30px_rgba(90,121,166,0.08)]"
                >
                  <p className="text-[2rem] font-semibold leading-none text-[#38439e]">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[#93a0be]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px] bg-white p-4 shadow-[0_20px_50px_rgba(76,112,170,0.12)] sm:p-5">
            <div className="relative aspect-[4/4.2] overflow-hidden rounded-[22px] bg-[#eef7ff]">
              <Image
                src="/hero-1.png"
                alt="Students in training"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 700px"
              />
            </div>

            <div className="absolute bottom-8 left-8 right-8 rounded-[18px] border border-white/20 bg-[#2f378f]/88 p-5 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9ee7ff]">
                Our mission
              </p>
              <p className="mt-3 text-lg leading-7 text-white">
                To make skilled-trade training more approachable, practical, and
                professionally relevant for every learner.
              </p>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}
