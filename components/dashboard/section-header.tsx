type SectionHeaderProps = {
  title: string;
  description: string;
};

export default function SectionHeader({
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div>
      <h2 className="text-3xl font-semibold text-[#1f2a44]">{title}</h2>
      <p className="mt-2 text-sm text-[#66758b]">{description}</p>
    </div>
  );
}
