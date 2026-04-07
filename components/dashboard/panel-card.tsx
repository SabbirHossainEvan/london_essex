type PanelCardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function PanelCard({
  children,
  className = "",
}: PanelCardProps) {
  return (
    <article
      className={`rounded-2xl border border-[#dce8f3] bg-white p-6 shadow-[0_12px_30px_rgba(103,130,170,0.08)] ${className}`}
    >
      {children}
    </article>
  );
}
