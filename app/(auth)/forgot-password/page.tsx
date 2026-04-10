"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ShieldCheck } from "lucide-react";
import AuthShell from "@/components/auth/auth-shell";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    router.push(
      `/otp-verification?flow=reset&email=${encodeURIComponent(email)}`
    );
  };

  return (
    <AuthShell
      title="Forgot your password?"
      description="Enter your email address and we will send you a one-time verification code to reset your password."
    >
      <div className="inline-flex items-center gap-2 rounded-full bg-[#edf9ff] px-4 py-2 text-sm font-medium text-[#168fc7]">
        <ShieldCheck className="h-4 w-4" />
        Account recovery
      </div>
      <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#1b2758]">
        Forgot password
      </h1>
      <p className="mt-3 text-sm leading-7 text-[#6b7892]">
        We&apos;ll email you a 6-digit OTP to verify your account.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="forgot-email"
            className="mb-2 block text-sm font-medium text-[#31406c]"
          >
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8ba0bf]" />
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              className="h-13 w-full rounded-2xl border border-[#d8e4f1] bg-[#f7fbff] pl-11 pr-4 text-sm text-[#22305a] outline-none transition focus:border-[#18a8df] focus:bg-white focus:shadow-[0_0_0_4px_rgba(24,168,223,0.12)]"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="h-13 w-full rounded-2xl bg-[linear-gradient(135deg,#0f1c53_0%,#1a6ac8_55%,#1dc2f3_100%)] text-sm font-semibold text-white shadow-[0_18px_34px_rgba(24,108,196,0.28)] transition hover:-translate-y-0.5"
        >
          Send OTP
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-[#6a7891]">
        Remember your password?{" "}
        <Link href="/login" className="font-semibold text-[#18245a]">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
