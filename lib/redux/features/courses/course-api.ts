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
  }),
});

export const {
  useGetCourseCatalogScreenQuery,
  useGetCourseDetailScreenQuery,
} = courseApi;
