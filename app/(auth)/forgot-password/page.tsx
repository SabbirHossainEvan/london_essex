"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
      <h1 className="text-4xl font-semibold text-[#242424]">Forgot password</h1>
      <p className="mt-3 text-sm leading-6 text-[#616161]">
        We&apos;ll email you a 6-digit OTP to verify your account.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="forgot-email"
            className="mb-2 block text-sm font-medium text-[#313131]"
          >
            Email address
          </label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Your email address"
            className="h-12 w-full rounded-lg border border-[#e4e7ec] bg-[#f3f6fa] px-4 text-sm text-[#222] outline-none transition focus:border-[#18a8df] focus:bg-white"
            required
          />
        </div>

        <button
          type="submit"
          className="h-12 w-full rounded-md bg-black text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Send OTP
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#606060]">
        Remember your password?{" "}
        <Link href="/login" className="font-medium text-black">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
