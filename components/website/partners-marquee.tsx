"use client";

import React from "react";

type Partner = {
  name: string;
  label?: string;
};

type PartnersMarqueeProps = {
  title?: string;
  partners?: Partner[];
};

const defaultPartners: Partner[] = [
  { name: "traveloka" },
  { name: "tiket.com" },
  { name: "Booking.com" },
  { name: "airbnb" },
  { name: "tripadvisor" },
  { name: "airbnb" },
];

function PartnerBadge({ name, label }: Partner) {
  return (
    <div className="flex min-w-[150px] items-center justify-center px-6 py-3 text-center text-xl font-semibold tracking-tight text-slate-400 sm:min-w-[190px] sm:text-2xl">
      <span className="whitespace-nowrap">
        {name}
        {label ? <span className="ml-1 text-base align-top">{label}</span> : null}
      </span>
    </div>
  );
}

export default function PartnersMarquee({
  title = "Proudly associated with",
  partners = defaultPartners,
}: PartnersMarqueeProps) {
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="bg-[#f6f6fc] py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold tracking-tight text-[#2D3182] sm:text-3xl">
          {title}
        </h2>

        <div className="relative mt-8 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#f6f6fc] to-transparent sm:w-28" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#f6f6fc] to-transparent sm:w-28" />

          <div className="marquee-track flex w-max items-center gap-2 sm:gap-6">
            {duplicatedPartners.map((partner, index) => (
              <PartnerBadge
                key={`${partner.name}-${index}`}
                name={partner.name}
                label={partner.label}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
