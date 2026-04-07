"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
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
      <h1 className="text-4xl font-semibold text-[#242424]">Reset password</h1>
      <p className="mt-3 text-sm leading-6 text-[#616161]">
        You are resetting the password for{" "}
        <span className="font-medium text-black">{email}</span>.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="new-password"
            className="mb-2 block text-sm font-medium text-[#313131]"
          >
            New password
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter new password"
              className="h-12 w-full rounded-lg border border-[#e4e7ec] bg-[#f3f6fa] px-4 pr-12 text-sm text-[#222] outline-none transition focus:border-[#18a8df] focus:bg-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#a1a8b3]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="mb-2 block text-sm font-medium text-[#313131]"
          >
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm new password"
              className="h-12 w-full rounded-lg border border-[#e4e7ec] bg-[#f3f6fa] px-4 pr-12 text-sm text-[#222] outline-none transition focus:border-[#18a8df] focus:bg-white"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((value) => !value)}
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#a1a8b3]"
              aria-label={
                showConfirmPassword ? "Hide confirm password" : "Show confirm password"
              }
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error ? <p className="text-sm text-[#dc2626]">{error}</p> : null}

        <button
          type="submit"
          className="h-12 w-full rounded-md bg-black text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Update password
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#606060]">
        Remembered it already?{" "}
        <Link href="/login" className="font-medium text-black">
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
