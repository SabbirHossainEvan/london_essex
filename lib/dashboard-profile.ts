"use client";

import React from "react";

export type StoredDashboardProfile = {
  name: string;
  email: string;
};

export const DASHBOARD_PROFILE_STORAGE_KEY = "london-essex-dashboard-profile";
const DASHBOARD_PROFILE_EVENT = "london-essex-dashboard-profile-change";

export function readStoredDashboardProfile(): StoredDashboardProfile | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(DASHBOARD_PROFILE_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as StoredDashboardProfile;
  } catch {
    return null;
  }
}

export function writeStoredDashboardProfile(value: StoredDashboardProfile | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (value) {
    window.localStorage.setItem(
      DASHBOARD_PROFILE_STORAGE_KEY,
      JSON.stringify(value)
    );
  } else {
    window.localStorage.removeItem(DASHBOARD_PROFILE_STORAGE_KEY);
  }

  window.dispatchEvent(new CustomEvent(DASHBOARD_PROFILE_EVENT, { detail: value }));
}

export function useDashboardProfile(fallback: StoredDashboardProfile) {
  const [profile, setProfile] = React.useState<StoredDashboardProfile>(fallback);
  const fallbackName = fallback.name;
  const fallbackEmail = fallback.email;

  React.useEffect(() => {
    const syncProfile = () => {
      setProfile(
        readStoredDashboardProfile() || {
          name: fallbackName,
          email: fallbackEmail,
        }
      );
    };

    syncProfile();
    window.addEventListener("storage", syncProfile);
    window.addEventListener(DASHBOARD_PROFILE_EVENT, syncProfile as EventListener);

    return () => {
      window.removeEventListener("storage", syncProfile);
      window.removeEventListener(
        DASHBOARD_PROFILE_EVENT,
        syncProfile as EventListener
      );
    };
  }, [fallbackEmail, fallbackName]);

  return profile;
}
