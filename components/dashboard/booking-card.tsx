import Image from "next/image";
import Link from "next/link";
import { Clock3, MapPin } from "lucide-react";
import type { BookingItem, BookingStatus } from "@/app/(dashboard)/dashboard/bookings/bookings-data";

type BookingCardProps = {
  booking: BookingItem;
};

const statusClasses: Record<BookingStatus, string> = {
  upcoming: "bg-[#e7fbeb] text-[#32b55b]",
  past: "bg-[#e8fbff] text-[#20a8d8]",
  cancelled: "bg-[#ffe9ea] text-[#ff5d68]",
};

export default function BookingCard({ booking }: BookingCardProps) {
  return (
    <div className="rounded-[12px] border border-[#39adff] bg-[#fefeff] p-3">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-3">
          <Image
            src="/hero-collage.png"
            alt={booking.title}
            width={92}
            height={92}
            className="h-[92px] w-[92px] rounded-[10px] object-cover"
          />

          <div className="pt-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-[1.1rem] font-medium text-[#3646a5]">
                {booking.title}
              </h3>
              <span
                className={`rounded-[8px] px-3 py-1 text-sm font-medium ${statusClasses[booking.status]}`}
              >
                {booking.label}
              </span>
            </div>

            <div className="mt-3 space-y-2 text-sm text-[#7d8ca7]">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-[#5065c4]" />
                <span>{booking.datetime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#5065c4]" />
                <span>{booking.location}</span>
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/courses/am2-assessment-preparation"
          className="rounded-[10px] border border-[#d9e6f8] bg-[#f4f8ff] px-5 py-3 text-sm font-medium text-[#4556ad] shadow-[0_6px_16px_rgba(56,91,169,0.06)]"
        >
          Course Details
        </Link>
      </div>
    </div>
  );
}
