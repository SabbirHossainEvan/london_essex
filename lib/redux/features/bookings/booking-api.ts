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

export type GetBookingByIdResponse = {
  success: boolean;
  message: string;
  data: {
    booking: {
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
      confirmedAt?: string | null;
      cancelledAt?: string | null;
      session?: {
        startDateTime?: string | null;
        endDateTime?: string | null;
        displayDate?: string;
        displayTime?: string;
        displayDateTime?: string;
        location?: string;
      };
      course?: {
        id?: string;
        title?: string;
        slug?: string;
        schedule?: string;
        duration?: string;
        location?: string;
        qualification?: string;
        thumbnailUrl?: string;
        price?: number;
        currency?: string;
        displayPrice?: string;
        detailsUrl?: string;
      };
      actions?: {
        detailsLabel?: string;
        detailsUrl?: string;
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
      payment?: {
        status?: string;
        amount?: number;
        currency?: string;
        displayAmount?: string;
        agreedToTerms?: boolean;
        method?: string;
        transactionId?: string;
        cardBrand?: string;
        cardLast4?: string;
        paidAt?: string | null;
        failureReason?: string;
      };
      progress?: {
        details?: string;
        payment?: string;
        confirmation?: string;
      };
      notes?: string;
    };
  };
};

export type BookingCheckoutStep = {
  id: "details" | "payment" | "confirm" | string;
  label: string;
  status: "completed" | "current" | "upcoming" | string;
};

export type GetBookingCheckoutDetailsResponse = {
  success: boolean;
  message: string;
  data: {
    screen: {
      steps: BookingCheckoutStep[];
      title: string;
      description: string;
      booking: {
        id: string;
        bookingNumber: string;
        status: string;
      };
      course: {
        id: string;
        title: string;
        slug: string;
        price: number;
        currency: string;
        displayPrice: string;
      };
      sections: Array<{
        id: string;
        title: string;
        fields: Array<{
          id: string;
          label: string;
          type: "text" | "email" | "tel" | "date" | string;
          value: string;
          required: boolean;
        }>;
      }>;
      actions?: {
        cancel?: {
          label?: string;
          url?: string;
        };
        continue?: {
          label?: string;
          method?: string;
          apiUrl?: string;
          nextApiUrl?: string;
        };
      };
    };
  };
};

export type GetBookingCheckoutPaymentResponse = {
  success: boolean;
  message: string;
  data: {
    screen: {
      steps: BookingCheckoutStep[];
      title: string;
      description: string;
      alerts?: Array<{
        id: string;
        tone: "success" | "warning" | "info" | string;
        message: string;
      }>;
      booking: {
        id: string;
        bookingNumber: string;
        status: string;
        paymentStatus: string;
      };
      summary: {
        title: string;
        subtitle: string;
        amount: number;
        currency: string;
        displayAmount: string;
      };
      terms?: {
        required: boolean;
        checkboxLabel: string;
        accepted: boolean;
      };
      stripe?: {
        enabled: boolean;
        publishableKey?: string;
        paymentIntentId?: string;
        paymentIntentStatus?: string;
        createIntentApiUrl?: string;
        syncPaymentApiUrl?: string;
        statusApiUrl?: string;
        mode?: string;
      };
      actions?: {
        back?: {
          label?: string;
          apiUrl?: string;
        };
        pay?: {
          label?: string;
          enabled?: boolean;
        };
      };
    };
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
    getBookingById: builder.query<GetBookingByIdResponse, string>({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}`,
        method: "GET",
      }),
      providesTags: ["Booking"],
    }),
    getBookingCheckoutDetails: builder.query<GetBookingCheckoutDetailsResponse, string>({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}/checkout/details`,
        method: "GET",
      }),
      providesTags: ["Booking"],
    }),
    getBookingCheckoutPayment: builder.query<GetBookingCheckoutPaymentResponse, string>({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}/checkout/payment`,
        method: "GET",
      }),
      providesTags: ["Booking"],
    }),
  }),
});

export const {
  useCreateNormalBookingMutation,
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useGetBookingCheckoutDetailsQuery,
  useGetBookingCheckoutPaymentQuery,
} = bookingApi;
