import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const fallbackBaseUrl = "http://localhost:3001";

function normalizeApiBaseUrl(value: string) {
  const trimmed = value.trim().replace(/\/+$/, "");

  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

export const apiBaseUrl =
  normalizeApiBaseUrl(
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || fallbackBaseUrl
  );

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as { auth?: { accessToken?: string | null } }).auth
        ?.accessToken;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      headers.set("accept", "application/json");

      return headers;
    },
  }),
  tagTypes: ["Auth", "Profile", "Course", "Booking", "SupportTicket"],
  endpoints: () => ({}),
});
