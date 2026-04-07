"use client";

import { Headset, Plus } from "lucide-react";
import PanelCard from "@/components/dashboard/panel-card";
import SupportTicketCard from "@/components/dashboard/support-ticket-card";
import type { SupportTicket } from "@/app/(dashboard)/dashboard/support/support-data";

type SupportTicketsPanelProps = {
  tickets: SupportTicket[];
  onNewTicket: () => void;
};

export default function SupportTicketsPanel({
  tickets,
  onNewTicket,
}: SupportTicketsPanelProps) {
  return (
    <PanelCard className="rounded-[14px] bg-[#edf6ff] p-4 sm:p-5">
      <div className="rounded-[14px] border border-[#dce8f7] bg-white/55 p-3 sm:p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-[1rem] font-medium text-[#3646a5]">
            <Headset className="h-4 w-4" />
            My Tickets
          </div>

          <button
            type="button"
            onClick={onNewTicket}
            className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#1ea6df] px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_18px_rgba(30,166,223,0.2)]"
          >
            <Plus className="h-4 w-4" />
            New Ticket
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {tickets.map((ticket) => (
            <SupportTicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </div>
    </PanelCard>
  );
}
