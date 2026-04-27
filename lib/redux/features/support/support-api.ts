import { baseApi } from "@/lib/redux/api/base-api";

export interface SupportFilterOption {
  value: string;
  label: string;
}

export interface SupportFormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  options?: SupportFilterOption[];
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: {
    value: string;
    label: string;
  };
  priority: {
    value: string;
    label: string;
  };
  status: {
    value: string;
    label: string;
  };
  previewMessage: string;
  latestReplyPreview: string;
  replyCount: number;
  createdAt: string;
  createdAtLabel: string;
  updatedAt: string;
  updatedAtLabel: string;
  lastReplyAt: string;
  lastReplyAtLabel: string;
  resolvedAt: string | null;
  resolvedAtLabel: string;
  replies?: {
    id: string;
    authorType: string;
    authorName: string;
    message: string;
    createdAt: string;
    createdAtLabel: string;
  }[];
  actions?: {
    view: { label: string; apiUrl: string };
    reply: { label: string; method: string; apiUrl: string; enabled: boolean };
  };
  composer?: {
    placeholder: string;
    submitAction: { label: string; method: string; apiUrl: string };
  };
  message?: string; // Fallback for list view if needed
}

export interface SupportScreenResponse {
  success: boolean;
  message: string;
  data: {
    screen: {
      title: string;
      subtitle: string;
      filters: {
        categories: SupportFilterOption[];
        priorities: SupportFilterOption[];
        statuses: SupportFilterOption[];
      };
      actions: {
        newTicket: {
          label: string;
          method: string;
          apiUrl: string;
        };
      };
      form: {
        title: string;
        fields: SupportFormField[];
      };
      sections: {
        myTickets: {
          title: string;
          tickets: SupportTicket[];
        };
      };
    };
  };
}

export const supportApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getSupportScreen: builder.query<SupportScreenResponse, void>({
      query: () => ({
        url: "/support",
        method: "GET",
      }),
      providesTags: ["Support"],
    }),
    getTickets: builder.query<{ success: boolean; data: { tickets: SupportTicket[] } }, void>({
      query: () => ({
        url: "/support/tickets",
        method: "GET",
      }),
      providesTags: ["Support"],
    }),
    getTicketById: builder.query<{ success: boolean; data: { ticket: SupportTicket } }, string>({
      query: (id) => ({
        url: `/support/tickets/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Support", id }],
    }),
    createTicket: builder.mutation<any, Record<string, string>>({
      query: (body) => ({
        url: "/support/tickets",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Support"],
    }),
  }),
});

export const { 
  useGetSupportScreenQuery, 
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation 
} = supportApi;
