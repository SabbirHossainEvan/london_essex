import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const AUTH_STORAGE_KEY = "london-essex-auth";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role?: string;
};

export type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  hydrated: boolean;
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken?: string | null;
        user: AuthUser;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken ?? null;
      state.user = action.payload.user;
      state.hydrated = true;
    },
    clearCredentials: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.hydrated = true;
    },
    hydrateAuth: (
      state,
      action: PayloadAction<{
        accessToken?: string | null;
        refreshToken?: string | null;
        user?: AuthUser | null;
      } | null>
    ) => {
      state.accessToken = action.payload?.accessToken ?? null;
      state.refreshToken = action.payload?.refreshToken ?? null;
      state.user = action.payload?.user ?? null;
      state.hydrated = true;
    },
  },
});

export const { setCredentials, clearCredentials, hydrateAuth } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
