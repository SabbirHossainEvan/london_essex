import Image from "next/image";

export type TeamScreenCard = {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio?: string;
  isPublished?: boolean;
  order?: number;
  alt?: string;
  overlay?: {
    align?: string;
    theme?: string;
  };
};

export type TeamScreenContent = {
  badge?: string;
  title?: string;
  subtitle?: string;
  cards?: TeamScreenCard[];
};

type TeamSectionProps = {
  screen?: TeamScreenContent;
};

const fallbackScreen: TeamScreenContent = {
  badge: "Our Team",
  title: "Meet Our Team",
  subtitle:
    "A dedicated team of professionals committed to improving the electrical training experience.",
  cards: [
    {
      id: "sophia-garcia-cofounder",
      name: "Sophia Garcia",
      role: "CEO & Co-Founder",
      imageUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
      alt: "Sophia Garcia - CEO & Co-Founder",
    },
    {
      id: "chloe-ramirez-senior-web-developer",
      name: "Chloe Ramirez",
      role: "Senior Web Developer",
      imageUrl:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
      alt: "Chloe Ramirez - Senior Web Developer",
    },
    {
      id: "ethan-parker-senior-web-developer",
      name: "Ethan Parker",
      role: "Senior Web Developer",
      imageUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
      alt: "Ethan Parker - Senior Web Developer",
    },
    {
      id: "mia-kim-cofounder",
      name: "Mia Kim",
      role: "CEO & Co-Founder",
      imageUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
      alt: "Mia Kim - CEO & Co-Founder",
    },
    {
      id: "lila-thompson-senior-web-developer",
      name: "Lila Thompson",
      role: "Senior Web Developer",
      imageUrl:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
      alt: "Lila Thompson - Senior Web Developer",
    },
    {
      id: "ava-bennett-creative-director",
      name: "Ava Bennett",
      role: "Creative Director",
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop",
      alt: "Ava Bennett - Creative Director",
    },
  ],
};

export default function TeamSection({ screen = fallbackScreen }: TeamSectionProps) {
  const badge = screen.badge || fallbackScreen.badge;
  const title = screen.title || fallbackScreen.title;
  const subtitle = screen.subtitle || fallbackScreen.subtitle;
  const cards =
    screen.cards?.filter((member) => member.isPublished !== false) ||
    fallbackScreen.cards ||
    [];

  return (
    <section
      className="bg-[#eef7ff] px-4 py-16 sm:px-6 lg:px-10 xl:px-16"
      id="team-section"
    >
      <div className="mx-auto max-w-[1200px] text-center">
        <span className="inline-block rounded-full border border-[#d7ecfb] bg-[#edf7ff] px-4 py-2 text-xs font-semibold tracking-[0.16em] text-[#19a2dd]">
          {badge}
        </span>

        <h2 className="mt-6 text-[2.4rem] font-semibold tracking-tight text-[#38439e] sm:text-[3rem]">
          {title}
        </h2>

        <p className="mx-auto mt-4 max-w-[600px] text-[1.05rem] leading-7 text-[#67708a]">
          {subtitle}
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((member) => (
            <div
              key={member.id}
              className="group relative aspect-[4/5] overflow-hidden rounded-[24px] bg-white shadow-[0_12px_30px_rgba(90,121,166,0.08)]"
            >
              <Image
                src={member.imageUrl}
                alt={member.alt || `${member.name} - ${member.role}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#10142bcc] via-[#10142b]/40 to-transparent opacity-90" />

              <div className="absolute bottom-0 left-0 right-0 p-8 text-left">
                <p className="text-[1.2rem] font-bold tracking-wide text-white">
                  {member.name}
                </p>
                <p className="mt-1 text-sm font-medium text-[#c0ccde]">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
