"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import AuthShell from "@/components/auth/auth-shell";

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    phone: "",
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
      <h1 className="text-4xl font-semibold text-[#242424]">Sign up</h1>
      <p className="mt-3 text-sm leading-6 text-[#616161]">
        Fill in your details and we&apos;ll send a verification code to continue.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="full-name"
            className="mb-2 block text-sm font-medium text-[#313131]"
          >
            Full name
          </label>
          <input
            id="full-name"
            type="text"
            value={formData.fullName}
            onChange={(event) => handleChange("fullName", event.target.value)}
            placeholder="Your full name"
            className="h-12 w-full rounded-lg border border-[#e4e7ec] bg-[#f3f6fa] px-4 text-sm text-[#222] outline-none transition focus:border-[#18a8df] focus:bg-white"
            required
          />
        </div>

        <div>
          <label
            htmlFor="signup-email"
            className="mb-2 block text-sm font-medium text-[#313131]"
          >
            Email address
          </label>
          <input
            id="signup-email"
            type="email"
            value={formData.email}
            onChange={(event) => handleChange("email", event.target.value)}
            placeholder="Your email address"
            className="h-12 w-full rounded-lg border border-[#e4e7ec] bg-[#f3f6fa] px-4 text-sm text-[#222] outline-none transition focus:border-[#18a8df] focus:bg-white"
            required
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-medium text-[#313131]"
          >
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(event) => handleChange("phone", event.target.value)}
            placeholder="Your phone number"
            className="h-12 w-full rounded-lg border border-[#e4e7ec] bg-[#f3f6fa] px-4 text-sm text-[#222] outline-none transition focus:border-[#18a8df] focus:bg-white"
            required
          />
        </div>

        <div>
          <label
            htmlFor="signup-password"
            className="mb-2 block text-sm font-medium text-[#313131]"
          >
            Create password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(event) => handleChange("password", event.target.value)}
              placeholder="Create password"
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

        <button
          type="submit"
          className="h-12 w-full rounded-md bg-black text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Continue
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#606060]">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-black">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
