import { baseApi } from "@/lib/redux/api/base-api";

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignUpRequest = {
  fullName: string;
  email: string;
  password: string;
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

export type AuthSuccessResponse = {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
};

export type AuthMessageResponse = {
  message: string;
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
    signUp: builder.mutation<AuthMessageResponse, SignUpRequest>({
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
  }),
});

export const {
  useLoginMutation,
  useSignUpMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} = authApi;
