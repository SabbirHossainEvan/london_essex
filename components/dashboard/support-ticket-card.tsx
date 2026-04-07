"use client";

import React from "react";
import { ChevronDown, ChevronUp, CircleHelp, Clock3, SendHorizontal, Tag } from "lucide-react";
import type { SupportTicket, SupportTicketStatus } from "@/app/(dashboard)/dashboard/support/support-data";
import SupportTicketMessage from "@/components/dashboard/support-ticket-message";

type SupportTicketCardProps = {
  ticket: SupportTicket;
};

const statusClassMap: Record<SupportTicketStatus, string> = {
  new: "bg-[#dff6ff] text-[#1ea6df]",
  "in-progress": "bg-[#fff1d9] text-[#f3a316]",
  resolved: "bg-[#ddf8e2] text-[#4dbb66]",
};

const statusLabelMap: Record<SupportTicketStatus, string> = {
  new: "New",
  "in-progress": "In Progress",
  resolved: "Resolved",
};

export default function SupportTicketCard({
  ticket,
}: SupportTicketCardProps) {
  const [isOpen, setIsOpen] = React.useState(ticket.expanded);

  return (
    <div className="rounded-[12px] border border-[#3ab1ff] bg-white">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-start justify-between gap-4 p-4 text-left"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            <span className="rounded-[6px] bg-[#f4f7fc] px-2 py-1 text-[#8392aa]">
              {ticket.code}
            </span>
            <span className="rounded-[6px] bg-[#ffe7e7] px-2 py-1 text-[#ff6b72]">
              {ticket.priority}
            </span>
            <span className={`rounded-[6px] px-2 py-1 ${statusClassMap[ticket.status]}`}>
              {statusLabelMap[ticket.status]}
            </span>
          </div>

          <h3 className="mt-4 text-[1.08rem] font-medium text-[#3646a5]">
            {ticket.title}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#8d99b0]">
            <div className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-[#5f6fd0]" />
              <span>{ticket.category}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-[#5f6fd0]" />
              <span>{ticket.date}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-medium text-[#6d80d8]">
            {ticket.replyCount}
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-[#6d80d8]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[#6d80d8]" />
          )}
        </div>
      </button>

      {isOpen ? (
        <div className="border-t border-[#e8eff8] p-4 pt-5">
          <div className="space-y-3">
            {ticket.messages.map((message) => (
              <SupportTicketMessage key={message.id} message={message} />
            ))}

            {ticket.status === "resolved" ? (
              <div className="flex items-center gap-2 rounded-[10px] bg-[#def8e2] px-4 py-3 text-sm font-medium text-[#44b663]">
                <CircleHelp className="h-4 w-4" />
                This ticket has been resolved
              </div>
            ) : (
              <>
                <textarea
                  placeholder="Type your reply..."
                  rows={4}
                  className="w-full rounded-[10px] border border-[#e5edf8] bg-[#edf7ff] px-4 py-3 text-sm text-[#3345a6] outline-none placeholder:text-[#92a1b8]"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-[8px] bg-[#1ea6df] px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_18px_rgba(30,166,223,0.2)]"
                  >
                    <SendHorizontal className="h-4 w-4" />
                    Send Reply
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
