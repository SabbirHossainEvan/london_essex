"use client";

import React from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordFieldProps = {
  label: string;
  placeholder: string;
};

function PasswordField({ label, placeholder }: PasswordFieldProps) {
  const [show, setShow] = React.useState(false);

  return (
    <div>
      <label className="mb-2 block text-sm text-[#6d7d98]">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="h-12 w-full rounded-[8px] border border-[#e5edf8] bg-[#f8fbff] px-4 pr-12 text-sm text-[#3345a6] outline-none placeholder:text-[#9aa7bb]"
        />
        <button
          type="button"
          onClick={() => setShow((value) => !value)}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#7f8db0]"
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}

export default function SecuritySettingsForm() {
  return (
    <div>
      <h3 className="text-[1.1rem] font-medium text-[#3646a5]">
        Change Password
      </h3>

      <div className="mt-5 grid gap-4">
        <PasswordField
          label="Current Password"
          placeholder="Current Password"
        />
        <PasswordField label="New Password" placeholder="New Password" />
        <PasswordField
          label="Confirm New Password"
          placeholder="Confirm New Password"
        />
      </div>
    </div>
  );
}
