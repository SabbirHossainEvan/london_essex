"use client";

import { SendHorizontal, X } from "lucide-react";

type SupportTicketDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function SupportTicketDrawer({
  open,
  onClose,
}: SupportTicketDrawerProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-[#12214d]/35 transition ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed right-0 top-0 z-40 h-screen w-full max-w-[420px] border-l border-[#dce8f7] bg-white shadow-[0_18px_50px_rgba(18,33,77,0.16)] transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-5">
          <div className="flex items-center justify-between gap-4 border-b border-[#edf3fb] pb-4">
            <h3 className="text-[1.05rem] font-semibold text-[#3646a5]">
              Submit a New Ticket
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#d8e6f8] p-2 text-[#5164bf]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto py-5">
            <div>
              <label className="mb-2 block text-sm text-[#6c7b97]">Subject</label>
              <input
                type="text"
                placeholder="Brief summary of your issue"
                className="h-11 w-full rounded-[8px] border border-[#e5edf8] bg-[#edf7ff] px-4 text-sm text-[#3345a6] outline-none placeholder:text-[#92a1b8]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-[#6c7b97]">Category</label>
              <select className="h-11 w-full rounded-[8px] border border-[#e5edf8] bg-[#edf7ff] px-4 text-sm text-[#75849d] outline-none">
                <option>Select Category</option>
                <option>Course issue</option>
                <option>Booking issue</option>
                <option>Technical issue</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-[#6c7b97]">Priority</label>
              <select className="h-11 w-full rounded-[8px] border border-[#e5edf8] bg-[#edf7ff] px-4 text-sm text-[#75849d] outline-none">
                <option>Select Priority</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-[#6c7b97]">Message</label>
              <textarea
                rows={8}
                placeholder="Please describe your issue in detail..."
                className="w-full rounded-[8px] border border-[#e5edf8] bg-[#edf7ff] px-4 py-3 text-sm text-[#3345a6] outline-none placeholder:text-[#92a1b8]"
              />
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#1ea6df] px-5 py-3 text-sm font-medium text-white shadow-[0_8px_18px_rgba(30,166,223,0.2)]"
          >
            <SendHorizontal className="h-4 w-4" />
            Submit Ticket
          </button>
        </div>
      </aside>
    </>
  );
}
