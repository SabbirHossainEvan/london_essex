"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, Mail, Sparkles, User } from "lucide-react";
import AuthShell from "@/components/auth/auth-shell";

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (Object.values(formData).some((value) => !value.trim())) {
      return;
    }

    router.push(
      `/otp-verification?flow=signup&email=${encodeURIComponent(formData.email)}`
    );
  };

  return (
    <AuthShell
      title="Create your London & Essex student account"
      description="Sign up to book courses faster, follow your training progress, and access your dashboard anytime."
    >
      <div className="inline-flex items-center gap-2 rounded-full bg-[#edf9ff] px-4 py-2 text-sm font-medium text-[#168fc7]">
        <Sparkles className="h-4 w-4" />
        Create your account
      </div>
      <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#1b2758]">Sign up</h1>
      <p className="mt-3 text-sm leading-7 text-[#6b7892]">
        Fill in your details and we&apos;ll send a verification code to continue.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="full-name"
            className="mb-2 block text-sm font-medium text-[#31406c]"
          >
            Full name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8ba0bf]" />
            <input
              id="full-name"
              type="text"
              value={formData.fullName}
              onChange={(event) => handleChange("fullName", event.target.value)}
              placeholder="Your full name"
              className="h-13 w-full rounded-2xl border border-[#d8e4f1] bg-[#f7fbff] pl-11 pr-4 text-sm text-[#22305a] outline-none transition focus:border-[#18a8df] focus:bg-white focus:shadow-[0_0_0_4px_rgba(24,168,223,0.12)]"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="signup-email"
            className="mb-2 block text-sm font-medium text-[#31406c]"
          >
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8ba0bf]" />
            <input
              id="signup-email"
              type="email"
              value={formData.email}
              onChange={(event) => handleChange("email", event.target.value)}
              placeholder="name@example.com"
              className="h-13 w-full rounded-2xl border border-[#d8e4f1] bg-[#f7fbff] pl-11 pr-4 text-sm text-[#22305a] outline-none transition focus:border-[#18a8df] focus:bg-white focus:shadow-[0_0_0_4px_rgba(24,168,223,0.12)]"
              required
            />
          </div>
        </div>



        <div>
          <label
            htmlFor="signup-password"
            className="mb-2 block text-sm font-medium text-[#31406c]"
          >
            Create password
          </label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8ba0bf]" />
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(event) => handleChange("password", event.target.value)}
              placeholder="Create password"
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

        <p className="text-xs leading-6 text-[#7c8aa2]">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>

        <button
          type="submit"
          className="h-13 w-full rounded-2xl bg-[linear-gradient(135deg,#0f1c53_0%,#1a6ac8_55%,#1dc2f3_100%)] text-sm font-semibold text-white shadow-[0_18px_34px_rgba(24,108,196,0.28)] transition hover:-translate-y-0.5"
        >
          Continue
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-[#6a7891]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[#18245a]">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
