export type SupportTicketStatus = "new" | "in-progress" | "resolved";

export type SupportMessage = {
  id: string;
  author: string;
  sentAt: string;
  body: string;
};

export type SupportTicket = {
  id: string;
  code: string;
  title: string;
  priority: "High";
  status: SupportTicketStatus;
  category: string;
  date: string;
  replyCount: string;
  expanded: boolean;
  messages: SupportMessage[];
};

export const supportTickets: SupportTicket[] = [
  {
    id: "ticket-new",
    code: "T-001",
    title: "Auto-Approve Bookings",
    priority: "High",
    status: "new",
    category: "Category",
    date: "15 May 2020 8:00 pm",
    replyCount: "1 reply",
    expanded: false,
    messages: [],
  },
  {
    id: "ticket-progress",
    code: "T-001",
    title: "Auto-Approve Bookings",
    priority: "High",
    status: "in-progress",
    category: "Category",
    date: "15 May 2020 8:00 pm",
    replyCount: "2 replies",
    expanded: true,
    messages: [
      {
        id: "msg-1",
        author: "Deja Brady",
        sentAt: "15 May 2020 8:00 pm",
        body: "I filled in Section 2 of the AM2 checklist yesterday but when I logged in today it was all blank again. I have tried on Chrome and Firefox.",
      },
      {
        id: "msg-2",
        author: "Deja Brady",
        sentAt: "15 May 2020 8:00 pm",
        body: "Hi James, we are looking into this. Could you try clearing your browser cache and trying again?",
      },
    ],
  },
  {
    id: "ticket-resolved",
    code: "T-001",
    title: "Auto-Approve Bookings",
    priority: "High",
    status: "resolved",
    category: "Category",
    date: "15 May 2020 8:00 pm",
    replyCount: "2 replies",
    expanded: true,
    messages: [
      {
        id: "msg-3",
        author: "Deja Brady",
        sentAt: "15 May 2020 8:00 pm",
        body: "I filled in Section 2 of the AM2 checklist yesterday but when I logged in today it was all blank again. I have tried on Chrome and Firefox.",
      },
      {
        id: "msg-4",
        author: "Deja Brady",
        sentAt: "15 May 2020 8:00 pm",
        body: "Hi James, we are looking into this. Could you try clearing your browser cache and trying again?",
      },
    ],
  },
];
