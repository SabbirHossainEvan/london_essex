import { baseApi } from "@/lib/redux/api/base-api";

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignUpRequest = {
  name: string;
  email: string;
  password: string;
  role: "user";
};

export type ForgotPasswordRequest = {
  email: string;
};

export type VerifyOtpRequest = {
  email: string;
  otp: string;
  flow: "signup" | "reset";
};

export type ResetPasswordRequest = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type AuthUserResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthSuccessResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: AuthUserResponse;
  };
};

export type AuthMessageResponse = {
  success?: boolean;
  message: string;
};

export type GetMeResponse = {
  success: boolean;
  message: string;
  data: {
    user: AuthUserResponse;
  };
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthSuccessResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth", "Profile"],
    }),
    signUp: builder.mutation<AuthSuccessResponse, SignUpRequest>({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    forgotPassword: builder.mutation<AuthMessageResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    verifyOtp: builder.mutation<AuthMessageResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    resetPassword: builder.mutation<AuthMessageResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    getMe: builder.query<GetMeResponse, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth", "Profile"],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignUpMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useGetMeQuery,
} = authApi;
