// import Image from "next/image";

// const team = [
//   {
//     name: "Sophia Garcia",
//     role: "CEO & Co-Founder",
//     image: "/team/team_1.webp",
//   },
//   {
//     name: "Chloe Ramirez",
//     role: "Senior Web Developer",
//     image: "/team/team_2.webp",
//   },
//   {
//     name: "Chloe Ramirez",
//     role: "Senior Web Developer",
//     image: "/team/team_3.webp",
//   },
//   {
//     name: "Sophia Garcia",
//     role: "CEO & Co-Founder",
//     image: "/team/team_4.webp",
//   },
//   {
//     name: "Lila Thompson",
//     role: "Senior Web Developer",
//     image: "/team/team_5.webp",
//   },
//   {
//     name: "Chloe Ramirez",
//     role: "Creative Director",
//     image: "/team/team_6.webp",
//   },
// ];

// export default function TeamSection() {
//   return (
//     <section className="bg-[#eef7ff] px-4 py-16 sm:px-6 lg:px-10 xl:px-16" id="team-section">
//       <div className="mx-auto max-w-[1200px] text-center">
//         <span className="inline-block rounded-full border border-[#d7ecfb] bg-[#edf7ff] px-4 py-2 text-xs font-semibold tracking-[0.16em] text-[#19a2dd]">
//           Our Team
//         </span>
//         <h2 className="mt-6 text-[2.4rem] font-semibold tracking-tight text-[#38439e] sm:text-[3rem]">
//           Meet Our Team
//         </h2>
//         <p className="mx-auto mt-4 max-w-[600px] text-[1.05rem] leading-7 text-[#67708a]">
//           A dedicated team of professionals committed to improving the electrical
//           training experience.
//         </p>

//         <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//           {team.map((member, i) => (
//             <div
//               key={i}
//               className="group relative aspect-[4/5] overflow-hidden rounded-[24px] bg-white shadow-[0_12px_30px_rgba(90,121,166,0.08)]"
//             >
//               <Image
//                 src={member.image}
//                 alt={member.name}
//                 fill
//                 className="object-cover transition-transform duration-500 group-hover:scale-105"
//                 sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-[#10142bcc] via-[#10142b]/40 to-transparent opacity-90" />
//               <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
//                 <p className="text-[1.1rem] font-semibold text-white">{member.name}</p>
//                 <p className="mt-1 text-xs text-[#a4b2c9]">{member.role}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }


import Image from "next/image";

// Dummy images added from Unsplash
const team = [
  {
    name: "Sophia Garcia",
    role: "CEO & Co-Founder",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Chloe Ramirez",
    role: "Senior Web Developer",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "James Wilson",
    role: "Senior Web Developer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Aria Chen",
    role: "UI/UX Designer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Lila Thompson",
    role: "Project Manager",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Marcus Wright",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
  },
];

export default function TeamSection() {
  return (
    <section className="bg-[#eef7ff] px-4 py-16 sm:px-6 lg:px-10 xl:px-16" id="team-section">
      <div className="mx-auto max-w-[1200px] text-center">
        {/* Badge */}
        <span className="inline-block rounded-full border border-[#d7ecfb] bg-[#edf7ff] px-4 py-2 text-xs font-semibold tracking-[0.16em] text-[#19a2dd]">
          OUR TEAM
        </span>

        {/* Heading */}
        <h2 className="mt-6 text-[2.4rem] font-semibold tracking-tight text-[#38439e] sm:text-[3rem]">
          Meet Our Team
        </h2>
        
        {/* Description */}
        <p className="mx-auto mt-4 max-w-[600px] text-[1.05rem] leading-7 text-[#67708a]">
          A dedicated team of professionals committed to improving the electrical
          training experience.
        </p>

        {/* Responsive Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, i) => (
            <div
              key={i}
              className="group relative aspect-[4/5] overflow-hidden rounded-[24px] bg-white shadow-[0_12px_30px_rgba(90,121,166,0.08)]"
            >
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#10142bcc] via-[#10142b]/40 to-transparent opacity-90" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-left">
                <p className="text-[1.2rem] font-bold text-white tracking-wide">
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