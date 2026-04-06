"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import airbnbLogo from "../../public/image/Airbnb.png";
import bookingLogo from "../../public/image/Booking.png";
import londonEssexLogo from "../../public/image/Logo (1) 1.png";
import tiketLogo from "../../public/image/tiket.com.png";
import travelokaLogo from "../../public/image/Traveloka.png";
import tripadvisorLogo from "../../public/image/Tripadvisor.png";

type Partner = {
  name: string;
  src?: StaticImageData;
};

type PartnersMarqueeProps = {
  title?: string;
  partners?: Partner[];
};

const defaultPartners: Partner[] = [
  { name: "Traveloka", src: travelokaLogo },
  { name: "tiket.com", src: tiketLogo },
  { name: "Booking.com", src: bookingLogo },
  { name: "Airbnb", src: airbnbLogo },
  { name: "Tripadvisor", src: tripadvisorLogo },
  { name: "London & Essex", src: londonEssexLogo },
];

const partnerLogoMap: Record<string, StaticImageData> = {
  traveloka: travelokaLogo,
  "tiket.com": tiketLogo,
  "booking.com": bookingLogo,
  airbnb: airbnbLogo,
  tripadvisor: tripadvisorLogo,
  "london & essex": londonEssexLogo,
  "london and essex": londonEssexLogo,
};

function PartnerBadge({ name, src }: Partner) {
  const resolvedSrc = src ?? partnerLogoMap[name.trim().toLowerCase()];

  if (!resolvedSrc) {
    return null;
  }

  return (
    <div className="flex h-20 min-w-[160px] items-center justify-center rounded-2xl px-6 py-4 shadow-[0_10px_30px_rgba(45,49,130,0.06)] sm:min-w-[210px]">
      <Image
        src={resolvedSrc}
        alt={name}
        width={resolvedSrc.width}
        height={resolvedSrc.height}
        className="h-8 w-[60%] object-contain sm:h-10"
      />
    </div>
  );
}

export default function PartnersMarquee({
  title = "Proudly associated with",
  partners = defaultPartners,
}: PartnersMarqueeProps) {
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className=" py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
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
                src={partner.src}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
