"use client";

import React from "react";

export const DASHBOARD_AVATAR_STORAGE_KEY = "london-essex-dashboard-avatar";
const DASHBOARD_AVATAR_EVENT = "london-essex-dashboard-avatar-change";

export function readStoredDashboardAvatar() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(DASHBOARD_AVATAR_STORAGE_KEY);
}

export function writeStoredDashboardAvatar(value: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (value) {
    window.localStorage.setItem(DASHBOARD_AVATAR_STORAGE_KEY, value);
  } else {
    window.localStorage.removeItem(DASHBOARD_AVATAR_STORAGE_KEY);
  }

  window.dispatchEvent(new CustomEvent(DASHBOARD_AVATAR_EVENT, { detail: value }));
}

export function useDashboardAvatar(defaultAvatar = "/hero-1.png") {
  const [avatarSrc, setAvatarSrc] = React.useState(defaultAvatar);

  React.useEffect(() => {
    const syncAvatar = () => {
      setAvatarSrc(readStoredDashboardAvatar() || defaultAvatar);
    };

    syncAvatar();
    window.addEventListener("storage", syncAvatar);
    window.addEventListener(DASHBOARD_AVATAR_EVENT, syncAvatar as EventListener);

    return () => {
      window.removeEventListener("storage", syncAvatar);
      window.removeEventListener(
        DASHBOARD_AVATAR_EVENT,
        syncAvatar as EventListener
      );
    };
  }, [defaultAvatar]);

  return avatarSrc;
}
