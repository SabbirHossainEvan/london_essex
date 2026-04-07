import type { SupportMessage } from "@/app/(dashboard)/dashboard/support/support-data";

type SupportTicketMessageProps = {
  message: SupportMessage;
};

export default function SupportTicketMessage({
  message,
}: SupportTicketMessageProps) {
  return (
    <div className="rounded-[10px] border border-[#e5edf8] bg-[#f8fbff] p-4">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1ea6df] text-xs font-semibold text-white">
          D
        </span>
        <p className="text-sm font-medium text-[#4251aa]">{message.author}</p>
        <p className="text-xs text-[#9ba8bd]">{message.sentAt}</p>
      </div>
      <p className="mt-3 text-sm leading-6 text-[#6c7b97]">{message.body}</p>
    </div>
  );
}
