"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
      <h1 className="text-4xl font-semibold text-[#242424]">OTP verification</h1>
      <p className="mt-3 text-sm leading-6 text-[#616161]">
        We sent a 6-digit code to <span className="font-medium text-black">{email}</span>.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="flex justify-between gap-3">
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
              className="h-14 w-14 rounded-xl border border-[#dce2ea] bg-[#f3f6fa] text-center text-xl font-semibold text-[#222] outline-none transition focus:border-[#18a8df] focus:bg-white sm:h-16 sm:w-16"
              aria-label={`OTP digit ${index + 1}`}
              required
            />
          ))}
        </div>

        <button
          type="submit"
          className="h-12 w-full rounded-md bg-black text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Verify OTP
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between text-sm text-[#606060]">
        <Link
          href={flow === "signup" ? "/signup" : "/forgot-password"}
          className="font-medium text-black"
        >
          Go back
        </Link>
        <button
          type="button"
          onClick={() => inputRefs.current[0]?.focus()}
          className="font-medium text-black underline underline-offset-2"
        >
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
