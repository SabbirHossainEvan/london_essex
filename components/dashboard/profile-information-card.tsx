import PanelCard from "@/components/dashboard/panel-card";

type ProfileField = {
  label: string;
  value: string;
};

type ProfileInformationCardProps = {
  fields: ProfileField[];
};

export default function ProfileInformationCard({
  fields,
}: ProfileInformationCardProps) {
  return (
    <PanelCard>
      <h3 className="text-xl font-semibold text-[#1f2a44]">
        Profile Information
      </h3>
      <div className="mt-6 grid gap-4">
        {fields.map((field) => (
          <div key={field.label} className="rounded-xl bg-[#f4f8fc] p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#7a8aa1]">
              {field.label}
            </p>
            <p className="mt-2 text-sm font-medium text-[#1f2a44]">
              {field.value}
            </p>
          </div>
        ))}
      </div>
    </PanelCard>
  );
}
