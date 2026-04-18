"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react";
import AuthShell from "@/components/auth/auth-shell";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useLoginMutation } from "@/lib/redux/features/auth/auth-api";
import { setCredentials } from "@/lib/redux/features/auth/auth-slice";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setFormError("Please enter your email and password.");
      return;
    }

    try {
      const response = await login({
        email: email.trim(),
        password,
      }).unwrap();

      dispatch(
        setCredentials({
          accessToken: response.data.token,
          user: {
            id: response.data.user.id,
            fullName: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role,
          },
        })
      );

      router.push("/dashboard");
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "We could not sign you in right now. Please try again.";

      setFormError(message);
    }
  };

  const handleGoogleSignIn = () => {
    setFormError("Google sign-in is not connected yet.");
  };

  return (
    <AuthShell
      title="Welcome back to London & Essex Electrical Training"
      description="Log in to manage your courses, discover new opportunities, and track your training in real-time."
    >
      <div className="inline-flex items-center gap-2 rounded-full bg-[#edf9ff] px-4 py-2 text-sm font-medium text-[#168fc7]">
        <Sparkles className="h-4 w-4" />
        Sign in to your learner space
      </div>
      <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#1b2758]">
        Sign in
      </h1>
      <p className="mt-3 text-sm leading-7 text-[#6b7892]">
        Pick up where you left off, review your upcoming courses, and continue your training journey.
      </p>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-[#d5e4f3] bg-white px-6 text-sm font-medium text-[#21315e] shadow-[0_10px_24px_rgba(34,70,120,0.08)] transition hover:-translate-y-0.5 hover:border-[#b7d9ec] hover:bg-[#fbfeff]"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f4f7fb] text-lg leading-none text-[#4285F4]">
          G
        </span>
        Continue with Google
      </button>

      <div className="mt-8 flex items-center gap-4 text-sm text-[#95a1b5]">
        <div className="h-px flex-1 bg-[#dde8f3]" />
        <span className="font-medium uppercase tracking-[0.22em]">OR</span>
        <div className="h-px flex-1 bg-[#dde8f3]" />
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-[#31406c]"
          >
            Your email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8ba0bf]" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => {
                setFormError("");
                setEmail(event.target.value);
              }}
              placeholder="name@example.com"
              className="h-13 w-full rounded-2xl border border-[#d8e4f1] bg-[#f7fbff] pl-11 pr-4 text-sm text-[#22305a] outline-none transition focus:border-[#18a8df] focus:bg-white focus:shadow-[0_0_0_4px_rgba(24,168,223,0.12)]"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-[#31406c]"
          >
            Your password
          </label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8ba0bf]" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => {
                setFormError("");
                setPassword(event.target.value);
              }}
              placeholder="Enter your password"
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

        <div className="flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-sm text-[#66758e]">
            <input type="checkbox" className="h-4 w-4 rounded border-[#c8d5e6]" />
            Keep me signed in
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-[#3258a3] underline decoration-[#a5c7ea] underline-offset-4"
          >
            Forgot your password
          </Link>
        </div>

        {formError ? (
          <p className="rounded-2xl border border-[#fecaca] bg-[#fff3f3] px-4 py-3 text-sm text-[#dc2626]">
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isLoading}
          className="h-13 w-full rounded-2xl bg-[linear-gradient(135deg,#0f1c53_0%,#1a6ac8_55%,#1dc2f3_100%)] text-sm font-semibold text-white shadow-[0_18px_34px_rgba(24,108,196,0.28)] transition hover:-translate-y-0.5"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-[#6a7891]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-[#18245a]">
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
}
