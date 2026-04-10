"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import AuthShell from "@/components/auth/auth-shell";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "your account";
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password.trim() || !confirmPassword.trim()) {
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    router.push("/login");
  };

  return (
    <AuthShell
      title="Set your new password"
      description="Create a secure new password for your London & Essex account and then sign back in."
    >
      <div className="inline-flex items-center gap-2 rounded-full bg-[#edf9ff] px-4 py-2 text-sm font-medium text-[#168fc7]">
        <ShieldCheck className="h-4 w-4" />
        Secure your account
      </div>
      <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#1b2758]">
        Reset password
      </h1>
      <p className="mt-3 text-sm leading-7 text-[#6b7892]">
        You are resetting the password for{" "}
        <span className="font-semibold text-[#1b2758]">{email}</span>.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="new-password"
            className="mb-2 block text-sm font-medium text-[#31406c]"
          >
            New password
          </label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8ba0bf]" />
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter new password"
              className="h-13 w-full rounded-2xl border border-[#d8e4f1] bg-[#f7fbff] pl-11 pr-12 text-sm text-[#22305a] outline-none transition focus:border-[#18a8df] focus:bg-white focus:shadow-[0_0_0_4px_rgba(24,168,223,0.12)]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#8fa0b9]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="mb-2 block text-sm font-medium text-[#31406c]"
          >
            Confirm password
          </label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8ba0bf]" />
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm new password"
              className="h-13 w-full rounded-2xl border border-[#d8e4f1] bg-[#f7fbff] pl-11 pr-12 text-sm text-[#22305a] outline-none transition focus:border-[#18a8df] focus:bg-white focus:shadow-[0_0_0_4px_rgba(24,168,223,0.12)]"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((value) => !value)}
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#8fa0b9]"
              aria-label={
                showConfirmPassword ? "Hide confirm password" : "Show confirm password"
              }
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error ? (
          <p className="rounded-2xl border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="h-13 w-full rounded-2xl bg-[linear-gradient(135deg,#0f1c53_0%,#1a6ac8_55%,#1dc2f3_100%)] text-sm font-semibold text-white shadow-[0_18px_34px_rgba(24,108,196,0.28)] transition hover:-translate-y-0.5"
        >
          Update password
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-[#6a7891]">
        Remembered it already?{" "}
        <Link href="/login" className="font-semibold text-[#18245a]">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
