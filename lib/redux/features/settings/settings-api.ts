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

export interface SecuritySettingsResponse {
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
      section: {
        title: string;
        subtitle: string;
        form: {
          submitAction: {
            label: string;
            method: string;
            apiUrl: string;
          };
          fields: {
            id: string;
            label: string;
            type: string;
            value: string;
            required: boolean;
          }[];
        };
      };
    };
  };
}

export interface ChangePasswordRequest {
  [key: string]: string;
}

export interface UpdateNotificationSettingsRequest {
  [key: string]: boolean;
}

export interface ProfileSettingsResponse {
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
          submitAction: {
            label: string;
            method: string;
            apiUrl: string;
          };
          fields: {
            id: string;
            label: string;
            type: string;
            value: string;
            required: boolean;
          }[];
        };
      };
    };
  };
}

export const settingsApi = baseApi.injectEndpoints({
  overrideExisting: true,
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
    getSecuritySettings: builder.query<SecuritySettingsResponse, void>({
      query: () => ({
        url: "/settings/security",
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),
    changePassword: builder.mutation<any, ChangePasswordRequest>({
      query: (body) => ({
        url: "/settings/security/password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
    getProfileSettings: builder.query<ProfileSettingsResponse, void>({
      query: () => ({
        url: "/settings/profile",
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),
    updateProfileSettings: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "/settings/profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
    deleteProfilePhoto: builder.mutation<any, void>({
      query: () => ({
        url: "/settings/profile/photo",
        method: "DELETE",
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
  useGetNotificationsQuery,
  useGetSecuritySettingsQuery,
  useChangePasswordMutation,
  useGetProfileSettingsQuery,
  useUpdateProfileSettingsMutation,
  useDeleteProfilePhotoMutation,
} = settingsApi;
