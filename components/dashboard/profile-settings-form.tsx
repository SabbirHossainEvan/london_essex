"use client";
import Image from "next/image";
import React, { useRef } from "react";
import { Camera } from "lucide-react";

interface ProfileSettingsFormProps {
  section: {
    title: string;
    subtitle: string;
    avatar: {
      imageUrl: string;
      initials: string;
      tone: string;
      actions: {
        upload: {
          label: string;
          method: string;
          apiUrl: string;
          fieldName: string;
        };
        delete: {
          label: string;
          method: string;
          apiUrl: string;
          enabled: boolean;
        };
      };
    };
    form: {
      fields: {
        id: string;
        label: string;
        type: string;
        value: string;
        required: boolean;
      }[];
    };
  };
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
  onPhotoUpload: (file: File) => void;
  onPhotoDelete: () => void;
}

export default function ProfileSettingsForm({
  section,
  values,
  onChange,
  onPhotoUpload,
  onPhotoDelete
}: ProfileSettingsFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatar = section.avatar;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoUpload(file);
    }
    // reset input
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-[#edf2f9] pb-5 sm:flex-row sm:items-center">
        <div className="relative group">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-[#3851bb]/10 bg-[#f8fbff] transition-all group-hover:border-[#3851bb]/30"
          >
            {avatar.imageUrl ? (
              <Image
                src={avatar.imageUrl}
                alt="Profile"
                width={64}
                height={64}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#3851bb] text-xl font-bold text-white">
                {avatar.initials}
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-5 w-5 text-white" />
            </div>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-[10px] border border-[#d8e4f6] bg-white px-5 py-2 text-sm font-semibold text-[#26355f] transition-all hover:bg-[#f8fbff] hover:border-[#3851bb]/30"
          >
            {avatar.actions.upload.label}
          </button>
          {avatar.actions.delete.enabled && (
            <button
              type="button"
              onClick={onPhotoDelete}
              className="text-sm font-semibold text-[#ff5a63] transition-colors hover:text-red-700"
            >
              {avatar.actions.delete.label}
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="mt-6 grid gap-5">
        {section.form.fields
          .filter((field) => field.id !== "phoneNumber" && field.id !== "ntiNumber")
          .map((field) => (
            <div key={field.id}>
              <label className="mb-2 block text-sm font-medium text-[#64748b]">
                {field.label}
              </label>
              <input
                type={field.type}
                value={values[field.id] || ""}
                onChange={(e) => onChange(field.id, e.target.value)}
                required={field.required}
                className="h-12 w-full rounded-xl border border-[#e2eaf5] bg-[#f8fbff] px-4 text-sm text-[#1e293b] outline-none transition-all focus:border-[#3851bb]/50 focus:ring-4 focus:ring-[#3851bb]/5"
              />
            </div>
          ))}
      </div>
    </div>
  );
}
