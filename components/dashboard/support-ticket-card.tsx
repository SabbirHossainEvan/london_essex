"use client";

import React from "react";
import { ChevronDown, ChevronUp, CircleHelp, Clock3, SendHorizontal, Tag } from "lucide-react";
import { useGetTicketByIdQuery, type SupportTicket } from "@/lib/redux/features/support/support-api";
import SupportTicketMessage from "@/components/dashboard/support-ticket-message";

type SupportTicketCardProps = {
  ticket: SupportTicket;
};

const statusClassMap: Record<string, string> = {
  new: "bg-[#dff6ff] text-[#1ea6df]",
  in_progress: "bg-[#fff1d9] text-[#f3a316]",
  resolved: "bg-[#ddf8e2] text-[#4dbb66]",
};

const statusLabelMap: Record<string, string> = {
  new: "New",
  in_progress: "In Progress",
  resolved: "Resolved",
};

const priorityClassMap: Record<string, string> = {
  low: "bg-[#f4f7fc] text-[#8392aa]",
  medium: "bg-[#fff1d9] text-[#f3a316]",
  high: "bg-[#ffe7e7] text-[#ff6b72]",
};

export default function SupportTicketCard({
  ticket: initialTicket,
}: SupportTicketCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { data: ticketData, isLoading } = useGetTicketByIdQuery(initialTicket.id, {
    skip: !isOpen,
  });

  const ticket = ticketData?.data.ticket || initialTicket;

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
              {ticket.ticketNumber}
            </span>
            <span className={`rounded-[6px] px-2 py-1 ${priorityClassMap[ticket.priority.value.toLowerCase()] || "bg-[#f4f7fc] text-[#8392aa]"}`}>
              {ticket.priority.label}
            </span>
            <span className={`rounded-[6px] px-2 py-1 ${statusClassMap[ticket.status.value.toLowerCase()] || "bg-[#f4f7fc] text-[#8392aa]"}`}>
              {ticket.status.label}
            </span>
          </div>

          <h3 className="mt-4 text-[1.08rem] font-medium text-[#3646a5]">
            {ticket.subject}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#8d99b0]">
            <div className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-[#5f6fd0]" />
              <span className="capitalize">{ticket.category.label}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-[#5f6fd0]" />
              <span>{ticket.createdAtLabel}</span>
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
          {isLoading ? (
            <div className="py-10 text-center text-sm text-[#94a3b8]">
              Loading ticket details...
            </div>
          ) : (
            <div className="space-y-4">
              {ticket.replies && ticket.replies.length > 0 ? (
              <div className="space-y-4">
                {ticket.replies.map((reply) => (
                  <div key={reply.id} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-[#3646a5]">{reply.authorName}</span>
                      <span className="text-[11px] text-[#93a2ba]">{reply.createdAtLabel}</span>
                    </div>
                    <div className="rounded-xl bg-[#f8fbff] p-4 text-sm text-[#1e293b]">
                      {reply.message}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              ticket.previewMessage && (
                <div className="rounded-xl bg-[#f8fbff] p-4 text-sm text-[#1e293b]">
                  {ticket.previewMessage}
                </div>
              )
            )}

            {ticket.status.value === "resolved" ? (
              <div className="flex items-center gap-2 rounded-[10px] bg-[#def8e2] px-4 py-3 text-sm font-medium text-[#44b663]">
                <CircleHelp className="h-4 w-4" />
                This ticket has been resolved
              </div>
            ) : (
              <>
                <textarea
                  placeholder={ticket.composer?.placeholder || "Type your reply..."}
                  rows={4}
                  className="w-full rounded-[10px] border border-[#e5edf8] bg-[#edf7ff] px-4 py-3 text-sm text-[#3345a6] outline-none placeholder:text-[#92a1b8]"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-[8px] bg-[#1ea6df] px-5 py-2.5 text-sm font-medium text-white shadow-[0_8px_18px_rgba(30,166,223,0.2)]"
                  >
                    <SendHorizontal className="h-4 w-4" />
                    {ticket.composer?.submitAction.label || "Send Reply"}
                  </button>
                </div>
              </>
            )}
          </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
