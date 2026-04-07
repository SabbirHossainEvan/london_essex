"use client";

import React from "react";
import { supportTickets } from "@/app/(dashboard)/dashboard/support/support-data";
import SupportHeaderCard from "@/components/dashboard/support-header-card";
import SupportTicketDrawer from "@/components/dashboard/support-ticket-drawer";
import SupportTicketsPanel from "@/components/dashboard/support-tickets-panel";

export default function DashboardSupportPage() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <SupportHeaderCard />
      <SupportTicketsPanel
        tickets={supportTickets}
        onNewTicket={() => setDrawerOpen(true)}
      />
      <SupportTicketDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
