import { baseApi } from "@/lib/redux/api/base-api";

export interface SettingsBreadcrumb {
  label: string;
  href: string;
}

export interface SettingsTab {
  id: string;
  label: string;
  active: boolean;
  apiUrl: string;
}

export interface NotificationToggle {
  id: string;
  label: string;
  description: string;
  value: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type?: "course" | "support" | "booking" | "system";
}

export interface NotificationListResponse {
  success: boolean;
  message: string;
  data: {
    notifications: NotificationItem[];
  };
}

export interface NotificationSection {
  title: string;
  subtitle: string;
  submitAction: {
    label: string;
    method: string;
    apiUrl: string;
  };
  toggles: NotificationToggle[];
}

export interface NotificationSettingsResponse {
  success: boolean;
  message: string;
  data: {
    screen: {
      breadcrumb: SettingsBreadcrumb[];
      title: string;
      tabs: SettingsTab[];
      sidebarProfile: {
        name: string;
        email: string;
        avatar: {
          imageUrl: string;
          initials: string;
          tone: string;
        };
      };
      section: NotificationSection;
    };
  };
}

export interface UpdateNotificationSettingsRequest {
  [key: string]: boolean;
}

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationSettings: builder.query<NotificationSettingsResponse, void>({
      query: () => ({
        url: "/settings/notifications",
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),
    updateNotificationSettings: builder.mutation<any, UpdateNotificationSettingsRequest>({
      query: (body) => ({
        url: "/settings/notifications",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
    getNotifications: builder.query<NotificationListResponse, void>({
      query: () => ({
        url: "/notifications",
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
  useGetNotificationsQuery,
} = settingsApi;
