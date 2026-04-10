"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MailCheck, RefreshCcw, ShieldCheck } from "lucide-react";
import AuthShell from "@/components/auth/auth-shell";

const OTP_LENGTH = 6;

function OtpVerificationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flow = searchParams.get("flow") ?? "reset";
  const email = searchParams.get("email") ?? "your email";
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);
  const [otp, setOtp] = React.useState(Array.from({ length: OTP_LENGTH }, () => ""));

  const handleChange = (index: number, value: string) => {
    const nextValue = value.replace(/\D/g, "").slice(-1);

    setOtp((current) => {
      const next = [...current];
      next[index] = nextValue;
      return next;
    });

    if (nextValue && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (otp.some((digit) => !digit.trim())) {
      return;
    }

    if (flow === "signup") {
      router.push("/dashboard");
      return;
    }

    router.push(`/reset-password?email=${encodeURIComponent(email)}`);
  };

  return (
    <AuthShell
      title="Verify your one-time password"
      description="Enter the code we sent to your email to continue with your account setup or password reset."
    >
      <div className="inline-flex items-center gap-2 rounded-full bg-[#edf9ff] px-4 py-2 text-sm font-medium text-[#168fc7]">
        <ShieldCheck className="h-4 w-4" />
        Verification step
      </div>
      <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#1b2758]">
        OTP verification
      </h1>
      <p className="mt-3 text-sm leading-7 text-[#6b7892]">
        We sent a 6-digit code to <span className="font-semibold text-[#1b2758]">{email}</span>.
      </p>
      <div className="mt-6 rounded-2xl border border-[#d7e8f8] bg-[#f7fbff] p-4">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-[#18a8df] shadow-sm">
            <MailCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-[#23345f]">Check your inbox</p>
            <p className="mt-1 text-sm leading-6 text-[#73819c]">
              The code usually arrives in under a minute. Keep this page open while you check your email.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="flex justify-between gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              className="h-14 w-12 rounded-2xl border border-[#d7e3f2] bg-[#f7fbff] text-center text-xl font-semibold text-[#23345f] outline-none transition focus:border-[#18a8df] focus:bg-white focus:shadow-[0_0_0_4px_rgba(24,168,223,0.12)] sm:h-16 sm:w-16"
              aria-label={`OTP digit ${index + 1}`}
              required
            />
          ))}
        </div>

        <button
          type="submit"
          className="h-13 w-full rounded-2xl bg-[linear-gradient(135deg,#0f1c53_0%,#1a6ac8_55%,#1dc2f3_100%)] text-sm font-semibold text-white shadow-[0_18px_34px_rgba(24,108,196,0.28)] transition hover:-translate-y-0.5"
        >
          Verify OTP
        </button>
      </form>

      <div className="mt-7 flex items-center justify-between gap-4 text-sm text-[#6a7891]">
        <Link
          href={flow === "signup" ? "/signup" : "/forgot-password"}
          className="font-semibold text-[#18245a]"
        >
          Go back
        </Link>
        <button
          type="button"
          onClick={() => inputRefs.current[0]?.focus()}
          className="inline-flex items-center gap-2 font-semibold text-[#3258a3]"
        >
          <RefreshCcw className="h-4 w-4" />
          Resend code
        </button>
      </div>
    </AuthShell>
  );
}

export default function OtpVerificationPage() {
  return (
    <Suspense fallback={null}>
      <OtpVerificationContent />
    </Suspense>
  );
}
