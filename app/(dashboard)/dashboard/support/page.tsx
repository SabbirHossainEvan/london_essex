"use client";

import React from "react";
import SupportHeaderCard from "@/components/dashboard/support-header-card";
import SupportTicketDrawer from "@/components/dashboard/support-ticket-drawer";
import SupportTicketsPanel from "@/components/dashboard/support-tickets-panel";
import { useGetSupportScreenQuery, useGetTicketsQuery } from "@/lib/redux/features/support/support-api";

export default function DashboardSupportPage() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  
  const { data: supportScreenData, isLoading: isScreenLoading } = useGetSupportScreenQuery();
  const { data: ticketsData, isLoading: isTicketsLoading } = useGetTicketsQuery();

  const isLoading = isScreenLoading || isTicketsLoading;
  
  if (isLoading) {
    return <div className="py-20 text-center text-[#7a88a3]">Loading support...</div>;
  }

  const screen = supportScreenData?.data.screen;
  // Combine tickets from both sources (screen data often has it, or dedicated endpoint)
  const tickets = ticketsData?.data.tickets || screen?.sections.myTickets.tickets || [];

  return (
    <div className="space-y-6">
      <SupportHeaderCard 
        title={screen?.title}
        description={screen?.subtitle}
      />
      <SupportTicketsPanel
        title={screen?.sections.myTickets.title}
        tickets={tickets}
        onNewTicket={() => setDrawerOpen(true)}
      />
      <SupportTicketDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        fields={screen?.form.fields || []}
        title={screen?.form.title || "Submit a New Ticket"}
      />
    </div>
  );
}
