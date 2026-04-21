import { baseApi } from "@/lib/redux/api/base-api";

export type CourseCatalogBadgeTone =
  | "available"
  | "upcoming"
  | "closed"
  | "draft"
  | string;

export type CourseCatalogCard = {
  id: string;
  title: string;
  slug: string;
  status: string;
  schedule: string;
  shortDescription: string;
  audience?: string;
  duration?: string;
  price: number;
  currency: string;
  thumbnailUrl?: string;
  tags?: string[];
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
  badge?: {
    label: string;
    tone: CourseCatalogBadgeTone;
  };
  image?: {
    url: string;
    alt: string;
  };
  subtitle?: string;
  description?: string;
  actions?: {
    primary?: {
      label: string;
      apiUrl?: string;
      url?: string;
    };
  };
};

export type CourseCatalogScreenResponse = {
  success: boolean;
  message: string;
  data: {
    screen: {
      title: string;
      subtitle: string;
      filters: {
        search: string;
        status: string | null;
      };
      cards: CourseCatalogCard[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };
  };
};

export type CourseDetailBreadcrumb = {
  label: string;
  url: string;
};

export type CourseDetailBookingModalOption = {
  id: string;
  label: string;
  nextStepId?: string;
};

export type CourseDetailBookingModalStep = {
  id: string;
  title: string;
  question: string;
  selectionMode: "single" | "multiple" | string;
  confirmLabel: string;
  options: CourseDetailBookingModalOption[];
};

export type CourseDetailCourse = {
  id: string;
  title: string;
  slug: string;
  status: string;
  schedule: string;
  shortDescription: string;
  audience?: string;
  duration?: string;
  price: number;
  currency: string;
  thumbnailUrl?: string;
  tags?: string[];
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
  overview?: string;
  description: string;
  qualification?: string;
  location?: string;
  entryRequirements?: string;
  media?: {
    thumbnailUrl?: string;
    galleryImages?: string[];
  };
  pricing?: {
    amount: number;
    currency: string;
    displayPrice: string;
    vatIncluded?: boolean;
    note?: string;
  };
  cta?: {
    label: string;
    url: string;
  };
  badge?: {
    label: string;
    tone: string;
  };
  bookNowModal?: {
    type: string;
    title: string;
    question: string;
    selectionMode: "single" | "multiple" | string;
    cancelLabel?: string;
    confirmLabel?: string;
    options: CourseDetailBookingModalOption[];
    initialStepId?: string;
    steps?: CourseDetailBookingModalStep[];
  };
  sections?: Array<{
    title: string;
    content: string;
  }>;
  order?: number;
};

export type CourseDetailRelatedCourse = {
  id: string;
  title: string;
  slug: string;
  badge?: {
    label: string;
    tone: string;
  };
  pricing?: {
    amount: number;
    currency: string;
    displayPrice: string;
  };
  session?: {
    date: string;
    time: string;
    location: string;
  };
  description: string;
  image?: {
    url: string;
    alt: string;
  };
  actions?: {
    primary?: {
      label: string;
      apiUrl?: string;
      url?: string;
    };
  };
};

export type CourseDetailScreenResponse = {
  success: boolean;
  message: string;
  data: {
    screen: {
      breadcrumbs: CourseDetailBreadcrumb[];
      course: CourseDetailCourse;
      relatedCourses: CourseDetailRelatedCourse[];
    };
  };
};

export type CourseBookNowResponse = {
  success: boolean;
  message: string;
  data: {
    course: {
      id: string;
      title: string;
      slug: string;
    };
    modal: {
      type: string;
      title: string;
      question: string;
      selectionMode: "single" | "multiple" | string;
      cancelLabel?: string;
      confirmLabel?: string;
      options: CourseDetailBookingModalOption[];
      initialStepId?: string;
      steps?: CourseDetailBookingModalStep[];
    };
  };
};

export type CourseRegistrationStep = {
  id: string;
  label: string;
  status: "completed" | "current" | "upcoming" | string;
};

export type CourseRegistrationField = {
  id: string;
  label: string;
  type:
    | "text"
    | "date"
    | "email"
    | "tel"
    | "radio"
    | "choice-grid"
    | "checkbox"
    | string;
  required: boolean;
  placeholder?: string;
  helperText?: string;
  group?: string;
  options?: Array<{
    id: string;
    label: string;
  }>;
};

export type CourseRegistrationSection = {
  id: string;
  title: string;
  description?: string;
  content?: string[];
  fields: CourseRegistrationField[];
};

export type CourseRegistrationFormResponse = {
  success: boolean;
  message: string;
  data: {
    screen: {
      courseContext: {
        id: string;
        title: string;
        slug: string;
        qualification?: string;
        location?: string;
        schedule?: string;
      };
      steps: CourseRegistrationStep[];
      title: string;
      description: string;
      assistanceText?: string;
      sections: CourseRegistrationSection[];
      navigation?: {
        previous?: {
          label?: string;
          apiUrl?: string;
        } | null;
        next?: {
          label?: string;
          apiUrl?: string;
        } | null;
      };
      submission?: {
        apiUrl?: string;
        method?: string;
        payloadTemplate?: {
          courseSlug?: string;
          personalDetails?: Record<string, string>;
          assessmentDetails?: Record<string, string>;
          employerDetails?: Record<string, string>;
          trainingProviderDetails?: Record<string, string>;
          privacyConfirmation?: boolean;
        };
        continueLabel?: string;
      };
    };
  };
};

export type CourseAssessmentRegistrationFormResponse = CourseRegistrationFormResponse;
export type CourseEmployerRegistrationFormResponse = CourseRegistrationFormResponse;
export type CourseTrainingRegistrationFormResponse = CourseRegistrationFormResponse;
export type CoursePrivacyRegistrationFormResponse = CourseRegistrationFormResponse;

export const courseApi = baseApi.injectEndpoints({
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    getCourseCatalogScreen: builder.query<CourseCatalogScreenResponse, void>({
      query: () => ({
        url: "/courses/screen/catalog",
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    getCourseDetailScreen: builder.query<CourseDetailScreenResponse, string>({
      query: (courseSlug) => ({
        url: `/courses/${courseSlug}/screen`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    getCourseBookNow: builder.query<CourseBookNowResponse, string>({
      query: (courseSlug) => ({
        url: `/courses/${courseSlug}/book-now`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    getCourseRegistrationForm: builder.query<CourseRegistrationFormResponse, string>({
      query: (courseSlug) => ({
        url: `/courses/${courseSlug}/registration-form`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    getCourseAssessmentRegistrationForm: builder.query<
      CourseAssessmentRegistrationFormResponse,
      string
    >({
      query: (courseSlug) => ({
        url: `/courses/${courseSlug}/registration-form/assessment`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    getCourseEmployerRegistrationForm: builder.query<
      CourseEmployerRegistrationFormResponse,
      string
    >({
      query: (courseSlug) => ({
        url: `/courses/${courseSlug}/registration-form/employer`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    getCourseTrainingRegistrationForm: builder.query<
      CourseTrainingRegistrationFormResponse,
      string
    >({
      query: (courseSlug) => ({
        url: `/courses/${courseSlug}/registration-form/training`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    getCoursePrivacyRegistrationForm: builder.query<
      CoursePrivacyRegistrationFormResponse,
      string
    >({
      query: (courseSlug) => ({
        url: `/courses/${courseSlug}/registration-form/privacy`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
  }),
});

export const {
  useGetCourseCatalogScreenQuery,
  useGetCourseDetailScreenQuery,
  useLazyGetCourseBookNowQuery,
  useGetCourseRegistrationFormQuery,
  useGetCourseAssessmentRegistrationFormQuery,
  useGetCourseEmployerRegistrationFormQuery,
  useGetCourseTrainingRegistrationFormQuery,
  useGetCoursePrivacyRegistrationFormQuery,
} = courseApi;
