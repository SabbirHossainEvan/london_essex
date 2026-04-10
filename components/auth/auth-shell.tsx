import React from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";

type AuthShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

const trustPoints = [
  "Flexible practical and theory-led training programmes",
  "Fast access to bookings, AM2 prep, and learner progress",
  "Secure sign-in flow for your training dashboard",
];

export default function AuthShell({
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#dff6ff_0%,#f6fbff_38%,#f7f8fc_100%)]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(520px,0.9fr)]">
        <section className="relative overflow-hidden px-6 py-10 text-white sm:px-10 lg:px-14 xl:px-20">
          <div className="absolute inset-0 bg-[linear-gradient(145deg,#0a1c54_0%,#119ed5_48%,#6ed9ff_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.16),transparent_24%),radial-gradient(circle_at_50%_85%,rgba(255,255,255,0.12),transparent_22%)]" />
          <div className="absolute -left-20 top-24 h-64 w-64 rounded-full border border-white/15 bg-white/10 blur-2xl" />
          <div className="absolute bottom-[-80px] right-[-40px] h-80 w-80 rounded-full border border-white/10 bg-[#7be1ff]/20 blur-3xl" />

          <div className="relative flex min-h-full flex-col justify-between">
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/95 backdrop-blur"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[#0b4d93]">
                  <Sparkles className="h-4 w-4" />
                </span>
                London & Essex Electrical Training
              </Link>

              <div className="hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur sm:block">
                Learner Portal
              </div>
            </div>

            <div className="py-12 lg:py-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur">
                <BadgeCheck className="h-4 w-4" />
                Trusted by learners across London and Essex
              </div>

              <div className="mt-8 max-w-[620px]">
                <h1 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl xl:text-6xl">
                  {title}
                </h1>
                <p className="mt-6 max-w-[560px] text-base leading-8 text-white/82 sm:text-lg">
                  {description}
                </p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {trustPoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur"
                  >
                    <ShieldCheck className="h-5 w-5 text-[#9ce8ff]" />
                    <p className="mt-4 text-sm leading-6 text-white/88">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-[420px]">
                  <p className="text-sm uppercase tracking-[0.24em] text-white/60">
                    Candidate Experience
                  </p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
                    Smooth access from sign in to assessment booking
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0f4582]">
                  Continue securely
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-10 xl:px-14">
          <div className="w-full max-w-[500px] rounded-[32px] border border-white/60 bg-white/78 p-5 shadow-[0_30px_80px_rgba(23,49,87,0.12)] backdrop-blur-xl sm:p-7 lg:p-8">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
