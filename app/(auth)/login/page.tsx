"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import AuthShell from "@/components/auth/auth-shell";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      return;
    }

    router.push("/dashboard");
  };

  const handleGoogleSignIn = () => {
    router.push("/dashboard");
  };

  return (
    <AuthShell
      title="Welcome back to London & Essex Electrical Training"
      description="Log in to manage your courses, discover new opportunities, and track your training in real-time."
    >
      <h1 className="text-4xl font-semibold text-[#242424]">Sign in</h1>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="mt-10 flex h-14 w-full items-center justify-center gap-3 rounded-full border border-[#8c8c8c] bg-white px-6 text-sm font-medium text-[#242424] transition-colors hover:bg-[#f8f8f8]"
      >
        <span className="text-lg leading-none text-[#4285F4]">G</span>
        Continue with Google
      </button>

      <div className="mt-9 flex items-center gap-4 text-sm text-[#6f6f6f]">
        <div className="h-px flex-1 bg-[#d8d8d8]" />
        <span>OR</span>
        <div className="h-px flex-1 bg-[#d8d8d8]" />
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-[#313131]"
          >
            Your email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Your email address"
            className="h-12 w-full rounded-lg border border-[#e4e7ec] bg-[#f3f6fa] px-4 text-sm text-[#222] outline-none transition focus:border-[#18a8df] focus:bg-white"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-[#313131]"
          >
            Your password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
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

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-[#4a4a4a] underline underline-offset-2"
          >
            Forgot your password
          </Link>
        </div>

        <button
          type="submit"
          className="h-12 w-full rounded-md bg-black text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Sign In
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#606060]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-black">
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
}
