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

export type UpdateBookingCheckoutDetailsRequest = {
  bookingId: string;
  personalDetails: {
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
    trainingCenter: string;
    city: string;
    postcode: string;
  };
};

export type CreateBookingPaymentIntentRequest = {
  bookingId: string;
  agreedToTerms: boolean;
};

export type SaveRegistrationEligibilityRequest = {
  bookingId: string;
  qualificationId: string;
  qualificationLabel: string;
  nvqRegistrationDate?: string;
};

export type SaveRegistrationEligibilityResponse = {
  success: boolean;
  message: string;
  data: {
    booking: GetBookingByIdResponse["data"]["booking"];
  };
};

export type SaveRegistrationAssessmentRequest = {
  bookingId: string;
  assessmentDetails: {
    apprentice: string;
    uln: string;
    funding: string;
    awardingBody: string;
    reasonableAdjustments: string;
    recognitionOfPriorLearning: string;
    assessmentType: string;
  };
};

export type SaveRegistrationAssessmentResponse = {
  success: boolean;
  message: string;
  data: {
    booking: GetBookingByIdResponse["data"]["booking"];
  };
};

export type SaveRegistrationEmployerRequest = {
  bookingId: string;
  employerDetails: {
    companyName: string;
    email: string;
    contactName: string;
    contactNumber: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    town: string;
    postcode: string;
  };
};

export type SaveRegistrationEmployerResponse = {
  success: boolean;
  message: string;
  data: {
    booking: GetBookingByIdResponse["data"]["booking"];
  };
};

export type SaveRegistrationTrainingRequest = {
  bookingId: string;
  trainingProviderDetails: {
    companyName: string;
    email: string;
    contactName: string;
    contactNumber: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    town: string;
    postcode: string;
  };
};

export type SaveRegistrationTrainingResponse = {
  success: boolean;
  message: string;
  data: {
    booking: GetBookingByIdResponse["data"]["booking"];
  };
};

export type SaveRegistrationPrivacyRequest = {
  bookingId: string;
  privacyConfirmation: boolean;
};

export type SaveRegistrationPrivacyResponse = {
  success: boolean;
  message: string;
  data: {
    booking: GetBookingByIdResponse["data"]["booking"];
  };
};

export type Am2eChecklistFlowVariant = "am2e" | "am2e-v1";

export type GetAm2eChecklistFlowByCourseRequest = {
  variant: Am2eChecklistFlowVariant;
  courseId: string;
  questionId: "nvq-registration-date";
  answerId: "before-3rd-september-2023" | "after-september-2023";
};

export type GetAm2eChecklistFlowByCourseResponse = {
  success: boolean;
  message: string;
  data: {
    checklistVariant: Am2eChecklistFlowVariant;
    resolvedFrom?: {
      routeVariant?: string;
      selectedQuestionId?: string;
      selectedAnswerId?: string;
      selectedAnswerLabel?: string;
      routeSource?: string;
    };
    flow: {
      steps: Array<{
        id: string;
        label: string;
        order: number;
      }>;
      documents?: {
        title: string;
        subtitle?: string;
        importantInformation?: string;
        requirements: Array<{
          id: string;
          title: string;
          description: string;
          acceptedFileTypes?: string[];
        }>;
      };
      checklistSummary?: {
        title: string;
        subtitle?: string;
        overallCompletion: number;
        importantInformation?: string;
        notice?: string;
      };
      checklistSections?: Array<{
        id: string;
        key: string;
        label: string;
        title: string;
        duration?: string;
        summary?: string;
        totalItems: number;
        items: Array<{
          id: string;
          no: number;
          criterion: string;
          options: {
            knowledge: Array<{ id: string; label: string }>;
            experience: Array<{ id: string; label: string }>;
          };
        }>;
      }>;
    };
  };
};

export type BookingFlowStep = {
  id: "documents" | "checklist" | "signatures" | "submit" | "review" | "payment" | "confirmed" | string;
  label: string;
  status: "completed" | "current" | "upcoming" | string;
};

export type GetBookingFlowDocumentsResponse = {
  success: boolean;
  message: string;
  data: {
    screen: {
      steps: BookingFlowStep[];
      title: string;
      subtitle?: string;
      importantInformation?: string;
      course: {
        id: string;
        title: string;
        slug: string;
      };
      requirements: Array<{
        id: string;
        title: string;
        description: string;
        uploaded: boolean;
        document: {
          fileName?: string;
          fileUrl?: string;
          uploadedAt?: string;
        } | null;
        action?: {
          label?: string;
          method?: string;
          apiUrl?: string;
        } | null;
      }>;
      completion: {
        uploadedCount: number;
        totalRequired: number;
        percentage: number;
      };
      actions?: {
        continue?: {
          label?: string;
          enabled?: boolean;
          apiUrl?: string;
        } | null;
      };
    };
  };
};

export type UploadBookingDocumentRequest = {
  bookingId: string;
  flow?: string;
  documentType: string;
  documentLabel: string;
  file: File;
};

export type UploadBookingDocumentResponse = GetBookingFlowDocumentsResponse;

export type GetBookingFlowChecklistSummaryResponse = {
  success: boolean;
  message: string;
  data: {
    screen: {
      steps: BookingFlowStep[];
      card: {
        title: string;
        subtitle?: string;
      };
      importantInformation?: string;
      overallCompletion: number;
      notice?: string;
      actions?: {
        openFullChecklist?: {
          label?: string;
          apiUrl?: string;
        } | null;
        continue?: {
          label?: string;
          enabled?: boolean;
          apiUrl?: string;
        } | null;
      };
    };
  };
};

export type GetBookingFlowChecklistFullResponse = {
  success: boolean;
  message: string;
  data: {
    screen: {
      steps: BookingFlowStep[];
      title: string;
      subtitle?: string;
      overallCompletion: number;
      actions?: {
        saveDraft?: {
          label?: string;
          method?: string;
          apiUrl?: string;
        } | null;
        nextSection?: {
          label?: string;
          apiUrl?: string;
        } | null;
      };
      sections: Array<{
        id: string;
        key: string;
        label: string;
        completedItems: number;
        totalItems: number;
        active: boolean;
        apiUrl?: string;
      }>;
      activeSection: {
        id: string;
        key: string;
        title: string;
        summary?: string;
        duration?: string;
        completedItems: number;
        totalItems: number;
        items: Array<{
          id: string;
          no: number;
          criterion: string;
          knowledgeLevel?: string;
          experienceLevel?: string;
          completed: boolean;
          options: {
            knowledge: Array<{
              id: string;
              label: string;
            }>;
            experience: Array<{
              id: string;
              label: string;
            }>;
          };
        }>;
      };
    };
  };
};

export type SaveBookingChecklistDraftRequest = {
  bookingId: string;
  section: string;
  responses: Array<{
    itemId: string;
    knowledgeLevel: string;
    experienceLevel: string;
  }>;
};

export type SaveBookingChecklistDraftResponse = GetBookingFlowChecklistFullResponse;

export type GetBookingFlowSignaturesResponse = {
  success: boolean;
  message: string;
  data: {
    screen: {
      steps: BookingFlowStep[];
      card: {
        title: string;
        subtitle?: string;
      };
      importantInformation?: string;
      progressLabel?: string;
      items: Array<{
        id: string;
        label: string;
        status: "signed" | "not_signed" | string;
        action?: {
          label?: string;
          method?: string;
          apiUrl?: string;
        } | null;
        modal?: {
          title?: string;
          fields?: Array<{
            id: string;
            label: string;
            type: string;
            required?: boolean;
            options?: string[];
          }>;
        } | null;
        request?: {
          email?: string;
          name?: string;
          subject?: string;
          message?: string;
          link?: string;
          expiresAt?: string | null;
        } | null;
      }>;
      actions?: {
        continue?: {
          label?: string;
          enabled?: boolean;
          apiUrl?: string;
        } | null;
      };
    };
  };
};

export type SubmitCandidateSignatureRequest = {
  bookingId: string;
  signatureType: "draw" | "upload";
  signature: File;
  fileName?: string;
  signerName?: string;
  signerEmail?: string;
};

export type SubmitCandidateSignatureResponse = GetBookingFlowSignaturesResponse;

export type RequestTrainingProviderSignatureRequest = {
  bookingId: string;
  trainingProviderEmail: string;
  trainingProviderName?: string;
  subject: string;
  message: string;
};

export type RequestTrainingProviderSignatureResponse = {
  success: boolean;
  message: string;
  data: {
    requested: boolean;
    email: string;
    link?: string;
    expiresAt?: string | null;
    screen: GetBookingFlowSignaturesResponse["data"]["screen"];
  };
};

export type GetBookingFlowSubmitResponse = {
  success: boolean;
  message: string;
  data: {
    screen: {
      steps: BookingFlowStep[];
      title: string;
      subtitle?: string;
      notice?: string;
      sections: Array<{
        id: string;
        label: string;
        status: "pending" | "completed" | "signed" | string;
      }>;
      actions?: {
        back?: {
          label?: string;
          apiUrl?: string;
        } | null;
        submit?: {
          label?: string;
          method?: string;
          enabled?: boolean;
          apiUrl?: string;
        } | null;
      };
    };
  };
};

export type SubmitBookingForReviewResponse = {
  success: boolean;
  message: string;
  data: {
    screen: {
      steps: BookingFlowStep[];
      title: string;
      subtitle?: string;
      notice?: string;
      status?: {
        key: string;
        label: string;
      };
      submittedAt?: string | null;
      reviewedAt?: string | null;
      notes?: string;
      stateCard?: {
        title?: string;
        description?: string;
        badge?: string;
      };
      actions?: {
        back?: {
          label?: string;
          apiUrl?: string;
        } | null;
        continue?: {
          label?: string;
          enabled?: boolean;
          apiUrl?: string;
        } | null;
      };
    };
    booking: GetBookingByIdResponse["data"]["booking"];
  };
};

export type GetBookingFlowReviewResponse = {
  success: boolean;
  message: string;
  data: {
    screen: SubmitBookingForReviewResponse["data"]["screen"];
  };
};

export type CreateBookingPaymentIntentResponse = {
  success: boolean;
  message: string;
  data: {
    paymentIntent: {
      id: string;
      clientSecret: string;
      status: string;
      amount: number;
      currency: string;
    };
    stripe: {
      publishableKey: string;
    };
    booking: GetBookingByIdResponse["data"]["booking"];
  };
};

export type CompleteBookingPaymentRequest = {
  bookingId: string;
  agreedToTerms: boolean;
  paymentIntentId: string;
  paymentMethodId?: string;
};

export type CompleteBookingPaymentResponse = {
  success: boolean;
  message: string;
  data: {
    booking: GetBookingByIdResponse["data"]["booking"];
    paymentIntent?: {
      id: string;
      status: string;
    };
  };
};

export type BookingCheckoutConfirmationScreen = {
  steps: BookingCheckoutStep[];
  title: string;
  description: string;
  booking: {
    id: string;
    bookingNumber: string;
    status: string;
    paymentStatus: string;
    confirmedAt?: string | null;
  };
  receipt?: {
    transactionId?: string;
    amount?: number;
    currency?: string;
    displayAmount?: string;
    cardBrand?: string;
    cardLast4?: string;
    paidAt?: string | null;
  };
  actions?: {
    primary?: {
      label?: string;
      apiUrl?: string;
    };
  };
};

export type GetBookingCheckoutConfirmationResponse = {
  success: boolean;
  message: string;
  data: {
    screen: BookingCheckoutConfirmationScreen;
  };
};

export type GetBookingPaymentStatusResponse = {
  success: boolean;
  message: string;
  data: {
    booking: GetBookingByIdResponse["data"]["booking"];
    confirmation: BookingCheckoutConfirmationScreen;
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
    getBookingFlowDocuments: builder.query<GetBookingFlowDocumentsResponse, string>({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}/flow/documents`,
        method: "GET",
      }),
      providesTags: ["Booking"],
    }),
    uploadBookingDocument: builder.mutation<
      UploadBookingDocumentResponse,
      UploadBookingDocumentRequest
    >({
      query: ({ bookingId, flow, documentType, documentLabel, file }) => {
        const body = new FormData();
        body.append("documentType", documentType);
        body.append("documentLabel", documentLabel);
        body.append("file", file);

        const params = flow ? { flow } : undefined;
        return {
          url: `/bookings/${bookingId}/flow/documents/upload`,
          params,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Booking"],
    }),
    getBookingFlowChecklistSummary: builder.query<
      GetBookingFlowChecklistSummaryResponse,
      string
    >({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}/flow/checklist`,
        method: "GET",
      }),
      providesTags: ["Booking"],
    }),
    getBookingFlowChecklistFull: builder.query<
      GetBookingFlowChecklistFullResponse,
      { bookingId: string; section?: string }
    >({
      query: ({ bookingId, section }) => ({
        url: `/bookings/${bookingId}/flow/checklist/full`,
        method: "GET",
        params: section ? { section } : undefined,
      }),
      providesTags: ["Booking"],
    }),
    saveBookingChecklistDraft: builder.mutation<
      SaveBookingChecklistDraftResponse,
      SaveBookingChecklistDraftRequest
    >({
      query: ({ bookingId, section, responses }) => ({
        url: `/bookings/${bookingId}/flow/checklist`,
        method: "PATCH",
        body: {
          section,
          responses,
        },
      }),
      invalidatesTags: ["Booking"],
    }),
    getBookingFlowSignatures: builder.query<
      GetBookingFlowSignaturesResponse,
      string
    >({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}/flow/signatures`,
        method: "GET",
      }),
      providesTags: ["Booking"],
    }),
    submitCandidateSignature: builder.mutation<
      SubmitCandidateSignatureResponse,
      SubmitCandidateSignatureRequest
    >({
      query: ({
        bookingId,
        signatureType,
        signature,
        fileName,
        signerName,
        signerEmail,
      }) => {
        const body = new FormData();
        body.append("signature", signature);
        body.append("signatureType", signatureType);

        if (fileName) {
          body.append("fileName", fileName);
        }

        if (signerName) {
          body.append("signerName", signerName);
        }

        if (signerEmail) {
          body.append("signerEmail", signerEmail);
        }

        return {
          url: `/bookings/${bookingId}/flow/signatures/candidate`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Booking"],
    }),
    requestTrainingProviderSignature: builder.mutation<
      RequestTrainingProviderSignatureResponse,
      RequestTrainingProviderSignatureRequest
    >({
      query: ({
        bookingId,
        trainingProviderEmail,
        trainingProviderName,
        subject,
        message,
      }) => ({
        url: `/bookings/${bookingId}/flow/signatures/training-provider/request`,
        method: "POST",
        body: {
          trainingProviderEmail,
          trainingProviderName,
          subject,
          message,
        },
      }),
      invalidatesTags: ["Booking"],
    }),
    getBookingFlowSubmit: builder.query<GetBookingFlowSubmitResponse, string>({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}/flow/submit`,
        method: "GET",
      }),
      providesTags: ["Booking"],
    }),
    submitBookingForReview: builder.mutation<
      SubmitBookingForReviewResponse,
      { bookingId: string }
    >({
      query: ({ bookingId }) => ({
        url: `/bookings/${bookingId}/flow/submit`,
        method: "POST",
      }),
      invalidatesTags: ["Booking"],
    }),
    getBookingFlowReview: builder.query<GetBookingFlowReviewResponse, string>({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}/flow/review`,
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
    getBookingCheckoutConfirmation: builder.query<
      GetBookingCheckoutConfirmationResponse,
      string
    >({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}/checkout/confirmation`,
        method: "GET",
      }),
      providesTags: ["Booking"],
    }),
    updateBookingCheckoutDetails: builder.mutation<
      GetBookingByIdResponse,
      UpdateBookingCheckoutDetailsRequest
    >({
      query: ({ bookingId, personalDetails }) => ({
        url: `/bookings/${bookingId}/details`,
        method: "PATCH",
        body: { personalDetails },
      }),
      invalidatesTags: ["Booking"],
    }),
    saveRegistrationEligibility: builder.mutation<
      SaveRegistrationEligibilityResponse,
      SaveRegistrationEligibilityRequest
    >({
      query: ({ bookingId, ...body }) => ({
        url: `/bookings/${bookingId}/registration/eligibility`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Booking"],
    }),
    saveRegistrationAssessment: builder.mutation<
      SaveRegistrationAssessmentResponse,
      SaveRegistrationAssessmentRequest
    >({
      query: ({ bookingId, assessmentDetails }) => ({
        url: `/bookings/${bookingId}/registration/assessment`,
        method: "POST",
        body: { assessmentDetails },
      }),
      invalidatesTags: ["Booking"],
    }),
    saveRegistrationEmployer: builder.mutation<
      SaveRegistrationEmployerResponse,
      SaveRegistrationEmployerRequest
    >({
      query: ({ bookingId, employerDetails }) => ({
        url: `/bookings/${bookingId}/registration/employer`,
        method: "POST",
        body: { employerDetails },
      }),
      invalidatesTags: ["Booking"],
    }),
    saveRegistrationTraining: builder.mutation<
      SaveRegistrationTrainingResponse,
      SaveRegistrationTrainingRequest
    >({
      query: ({ bookingId, trainingProviderDetails }) => ({
        url: `/bookings/${bookingId}/registration/training`,
        method: "POST",
        body: { trainingProviderDetails },
      }),
      invalidatesTags: ["Booking"],
    }),
    saveRegistrationPrivacy: builder.mutation<
      SaveRegistrationPrivacyResponse,
      SaveRegistrationPrivacyRequest
    >({
      query: ({ bookingId, privacyConfirmation }) => ({
        url: `/bookings/${bookingId}/registration/privacy`,
        method: "POST",
        body: { privacyConfirmation },
      }),
      invalidatesTags: ["Booking"],
    }),
    getAm2eChecklistFlowByCourse: builder.query<
      GetAm2eChecklistFlowByCourseResponse,
      GetAm2eChecklistFlowByCourseRequest
    >({
      query: ({ variant, courseId, questionId, answerId }) => ({
        url: `/bookings/${variant}-checklist-flow`,
        method: "GET",
        params: {
          courseId,
          questionId,
          answerId,
        },
      }),
      providesTags: ["Booking"],
    }),
    createBookingPaymentIntent: builder.mutation<
      CreateBookingPaymentIntentResponse,
      CreateBookingPaymentIntentRequest
    >({
      query: ({ bookingId, agreedToTerms }) => ({
        url: `/bookings/${bookingId}/payment/intent`,
        method: "POST",
        body: { agreedToTerms },
      }),
      invalidatesTags: ["Booking"],
    }),
    completeBookingPayment: builder.mutation<
      CompleteBookingPaymentResponse,
      CompleteBookingPaymentRequest
    >({
      query: ({ bookingId, ...body }) => ({
        url: `/bookings/${bookingId}/payment`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Booking"],
    }),
    getBookingPaymentStatus: builder.query<GetBookingPaymentStatusResponse, string>({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}/payment/status`,
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
  useGetBookingFlowDocumentsQuery,
  useGetBookingFlowChecklistSummaryQuery,
  useGetBookingFlowChecklistFullQuery,
  useGetBookingFlowSignaturesQuery,
  useGetBookingFlowSubmitQuery,
  useGetBookingFlowReviewQuery,
  useSubmitBookingForReviewMutation,
  useRequestTrainingProviderSignatureMutation,
  useSubmitCandidateSignatureMutation,
  useSaveBookingChecklistDraftMutation,
  useUploadBookingDocumentMutation,
  useGetBookingCheckoutDetailsQuery,
  useGetBookingCheckoutPaymentQuery,
  useGetBookingCheckoutConfirmationQuery,
  useUpdateBookingCheckoutDetailsMutation,
  useSaveRegistrationEligibilityMutation,
  useSaveRegistrationAssessmentMutation,
  useSaveRegistrationEmployerMutation,
  useSaveRegistrationTrainingMutation,
  useSaveRegistrationPrivacyMutation,
  useLazyGetAm2eChecklistFlowByCourseQuery,
  useCreateBookingPaymentIntentMutation,
  useCompleteBookingPaymentMutation,
  useGetBookingPaymentStatusQuery,
  useLazyGetBookingPaymentStatusQuery,
} = bookingApi;
