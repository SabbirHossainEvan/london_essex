"use client";

import React, { useState } from "react";
import { SendHorizontal, X } from "lucide-react";
import { useCreateTicketMutation, type SupportFormField } from "@/lib/redux/features/support/support-api";

type SupportTicketDrawerProps = {
  open: boolean;
  onClose: () => void;
  fields: SupportFormField[];
  title: string;
};

export default function SupportTicketDrawer({
  open,
  onClose,
  fields,
  title,
}: SupportTicketDrawerProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [createTicket, { isLoading }] = useCreateTicketMutation();

  const handleInputChange = (id: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!fields) return;
    
    for (const field of fields) {
      if (field.required && !formValues[field.id]) {
        alert(`${field.label} is required.`);
        return;
      }
    }

    try {
      await createTicket(formValues).unwrap();
      alert("Ticket submitted successfully!");
      setFormValues({});
      onClose();
    } catch (err: any) {
      console.error("Failed to submit ticket", err);
      alert(err?.data?.message || "Failed to submit ticket. Please try again.");
    }
  };

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
              {title}
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
            {fields.map((field) => (
              <div key={field.id}>
                <label className="mb-2 block text-sm text-[#6c7b97]">{field.label}</label>
                {field.type === "select" ? (
                  <select
                    value={formValues[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="h-11 w-full rounded-[8px] border border-[#e5edf8] bg-[#edf7ff] px-4 text-sm text-[#3345a6] outline-none"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    rows={6}
                    value={formValues[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={`Enter your ${field.label.toLowerCase()}...`}
                    className="w-full rounded-[8px] border border-[#e5edf8] bg-[#edf7ff] px-4 py-3 text-sm text-[#3345a6] outline-none placeholder:text-[#92a1b8]"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={formValues[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    className="h-11 w-full rounded-[8px] border border-[#e5edf8] bg-[#edf7ff] px-4 text-sm text-[#3345a6] outline-none placeholder:text-[#92a1b8]"
                  />
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#1ea6df] px-5 py-3 text-sm font-medium text-white shadow-[0_8px_18px_rgba(30,166,223,0.2)] disabled:opacity-50"
          >
            {isLoading ? (
              "Submitting..."
            ) : (
              <>
                <SendHorizontal className="h-4 w-4" />
                Submit Ticket
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
