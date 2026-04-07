"use client";

import Image from "next/image";
import React from "react";
import { Camera } from "lucide-react";

export default function ProfileSettingsForm() {
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setPhotoPreview((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }

      return URL.createObjectURL(file);
    });
  };

  const handleDeletePhoto = () => {
    setPhotoPreview((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }

      return null;
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-[#edf2f9] pb-5 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#1ea6df] text-white"
        >
          {photoPreview ? (
            <Image
              src={photoPreview}
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
        <div>
          <label className="mb-2 block text-sm text-[#6d7d98]">Your Name</label>
          <input
            defaultValue="Jenny Wilson"
            className="h-12 w-full rounded-[8px] border border-[#e5edf8] bg-[#f8fbff] px-4 text-sm text-[#3345a6] outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-[#6d7d98]">Admin Email</label>
          <input
            defaultValue="admin@londonessex.co.uk"
            className="h-12 w-full rounded-[8px] border border-[#e5edf8] bg-[#f8fbff] px-4 text-sm text-[#3345a6] outline-none"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-[#6d7d98]">
              Contact Phone
            </label>
            <input
              defaultValue="+44 20 7946 0958"
              className="h-12 w-full rounded-[8px] border border-[#e5edf8] bg-[#f8fbff] px-4 text-sm text-[#3345a6] outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-[#6d7d98]">NI Number</label>
            <input
              defaultValue="44 20 7946 0958"
              className="h-12 w-full rounded-[8px] border border-[#e5edf8] bg-[#f8fbff] px-4 text-sm text-[#3345a6] outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
