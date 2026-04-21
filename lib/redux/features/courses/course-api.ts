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

export const courseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourseCatalogScreen: builder.query<CourseCatalogScreenResponse, void>({
      query: () => ({
        url: "/courses/screen/catalog",
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
  }),
});

export const { useGetCourseCatalogScreenQuery } = courseApi;
