"use client";

import React from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/redux/store";
import {
  AUTH_STORAGE_KEY,
  hydrateAuth,
  type AuthState,
} from "@/lib/redux/features/auth/auth-slice";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [store] = React.useState(makeStore);

  React.useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

      if (!storedValue) {
        store.dispatch(hydrateAuth(null));
        return;
      }

      const parsedValue = JSON.parse(storedValue) as Partial<AuthState>;

      store.dispatch(
        hydrateAuth({
          accessToken: parsedValue.accessToken ?? null,
          refreshToken: parsedValue.refreshToken ?? null,
          user: parsedValue.user ?? null,
        })
      );
    } catch {
      store.dispatch(hydrateAuth(null));
    }
  }, [store]);

  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const auth = state.auth;

      if (!auth.hydrated) {
        return;
      }

      if (!auth.accessToken || !auth.user) {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        return;
      }

      window.localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken,
          user: auth.user,
        })
      );
    });

    return unsubscribe;
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
