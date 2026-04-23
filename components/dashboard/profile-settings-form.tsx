"use client";

import Image from "next/image";
import React from "react";
import { Camera } from "lucide-react";
import {
  useDashboardAvatar,
  writeStoredDashboardAvatar,
} from "@/lib/dashboard-avatar";
import { writeStoredDashboardProfile } from "@/lib/dashboard-profile";

export type ProfileSettingsFormValues = {
  name: string;
  email: string;
};

type ProfileSettingsFormProps = {
  initialValues?: ProfileSettingsFormValues;
  onDirtyChange?: (dirty: boolean) => void;
  onSubmitReady?: (submit: () => void) => void;
};

const defaultInitialValues: ProfileSettingsFormValues = {
  name: "Jenny Wilson",
  email: "admin@londonessex.co.uk",
};

export default function ProfileSettingsForm({
  initialValues = defaultInitialValues,
  onDirtyChange,
  onSubmitReady,
}: ProfileSettingsFormProps) {
  const savedAvatarSrc = useDashboardAvatar();
  const [pendingAvatarSrc, setPendingAvatarSrc] = React.useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = React.useState(false);
  const [formValues, setFormValues] =
    React.useState<ProfileSettingsFormValues>(initialValues);
  const [savedValues, setSavedValues] =
    React.useState<ProfileSettingsFormValues>(initialValues);
  const [isSaved, setIsSaved] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const displayAvatarSrc = removeAvatar
    ? null
    : pendingAvatarSrc || savedAvatarSrc || null;

  const isDirty =
    pendingAvatarSrc !== null ||
    removeAvatar ||
    formValues.name !== savedValues.name ||
    formValues.email !== savedValues.email;

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPendingAvatarSrc(reader.result);
        setRemoveAvatar(false);
        setIsSaved(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = () => {
    setPendingAvatarSrc(null);
    setRemoveAvatar(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setIsSaved(false);
  };

  React.useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  React.useEffect(() => {
    setFormValues(initialValues);
    setSavedValues(initialValues);
    setIsSaved(false);
  }, [initialValues]);

  const handleFieldChange = (
    field: keyof ProfileSettingsFormValues,
    value: string
  ) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
    setIsSaved(false);
  };

  const handleSubmit = React.useCallback(() => {
    if (removeAvatar) {
      writeStoredDashboardAvatar(null);
      setRemoveAvatar(false);
    } else if (pendingAvatarSrc) {
      writeStoredDashboardAvatar(pendingAvatarSrc);
      setPendingAvatarSrc(null);
    }

    writeStoredDashboardProfile({
      name: formValues.name,
      email: formValues.email,
    });
    setSavedValues(formValues);
    setIsSaved(true);
  }, [formValues, pendingAvatarSrc, removeAvatar]);

  React.useEffect(() => {
    onSubmitReady?.(handleSubmit);
  }, [handleSubmit, onSubmitReady]);

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-[#edf2f9] pb-5 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#1ea6df] text-white"
        >
          {displayAvatarSrc ? (
            <Image
              src={displayAvatarSrc}
              alt="Profile preview"
              width={56}
              height={56}
              unoptimized
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <Camera className="h-6 w-6" />
          )}
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-[10px] border border-[#d8e4f6] bg-white px-5 py-3 text-sm font-medium text-[#26355f]"
          >
            Change Photo
          </button>
          <button
            type="button"
            onClick={handleDeletePhoto}
            className="text-sm font-medium text-[#ff5a63]"
          >
            Delete
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="hidden"
        />
      </div>

      <div className="mt-5 grid gap-4">
        {isSaved ? (
          <div className="rounded-[10px] border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-sm text-[#15803d]">
            Profile changes saved successfully.
          </div>
        ) : null}

        <div>
          <label className="mb-2 block text-sm text-[#6d7d98]">Your Name</label>
          <input
            value={formValues.name}
            onChange={(event) => handleFieldChange("name", event.target.value)}
            className="h-12 w-full rounded-[8px] border border-[#e5edf8] bg-[#f8fbff] px-4 text-sm text-[#3345a6] outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-[#6d7d98]">Admin Email</label>
          <input
            value={formValues.email}
            onChange={(event) => handleFieldChange("email", event.target.value)}
            className="h-12 w-full rounded-[8px] border border-[#e5edf8] bg-[#f8fbff] px-4 text-sm text-[#3345a6] outline-none"
          />
        </div>
      </div>
    </div>
  );
}
