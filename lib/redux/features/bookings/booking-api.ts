import { baseApi } from "@/lib/redux/api/base-api";

export type CreateNormalBookingRequest = {
  courseSlug: string;
  personalDetails: {
    title: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    niNumber: string;
    email: string;
    mobileNumber: string;
    addressLine1: string;
    addressLine2: string;
    town: string;
    postcode: string;
    trainingCenter: string;
  };
};

export type CreateNormalBookingResponse = {
  success: boolean;
  message: string;
  data: {
    booking: {
      id: string;
      bookingNumber: string;
      status: string;
      paymentStatus: string;
      payment?: {
        displayAmount?: string;
        amount?: number;
        currency?: string;
      };
      course?: {
        title?: string;
        slug?: string;
        displayPrice?: string;
      };
      personalDetails?: {
        fullName?: string;
        email?: string;
        phoneNumber?: string;
        dateOfBirth?: string;
        address?: string;
        trainingCenter?: string;
        city?: string;
        postcode?: string;
      };
    };
  };
};

export type BookingTabKey = "upcoming" | "past" | "cancelled";

export type GetBookingsResponse = {
  success: boolean;
  message: string;
  data: {
    bookings: Array<{
      id: string;
      bookingNumber: string;
      status: string;
      paymentStatus: string;
      tab: BookingTabKey;
      statusBadge?: {
        label: string;
        tone: string;
      };
      createdAt?: string;
      updatedAt?: string;
      session?: {
        displayDate?: string;
        displayTime?: string;
        displayDateTime?: string;
        location?: string;
      };
      course?: {
        title?: string;
        slug?: string;
        thumbnailUrl?: string;
        detailsUrl?: string;
      };
      actions?: {
        detailsLabel?: string;
        detailsUrl?: string;
      };
    }>;
    tabs?: {
      active?: BookingTabKey;
      counts?: Partial<Record<BookingTabKey, number>>;
    };
    emptyState?: {
      title?: string;
      description?: string;
    } | null;
  };
};

export const bookingApi = baseApi.injectEndpoints({
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    createNormalBooking: builder.mutation<
      CreateNormalBookingResponse,
      CreateNormalBookingRequest
    >({
      query: (body) => ({
        url: "/bookings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Booking"],
    }),
    getBookings: builder.query<GetBookingsResponse, void>({
      query: () => ({
        url: "/bookings",
        method: "GET",
      }),
      providesTags: ["Booking"],
    }),
  }),
});

export const { useCreateNormalBookingMutation, useGetBookingsQuery } = bookingApi;
