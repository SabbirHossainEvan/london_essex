export default function DashboardCourseBookingLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="h-3 w-56 rounded-full bg-[#e8eff8]" />
        <div className="h-10 w-80 rounded-full bg-[#e8eff8]" />
        <div className="h-4 w-72 rounded-full bg-[#eef4fb]" />
      </div>

      <div className="rounded-[20px] border border-[#dce8f3] bg-white p-6 shadow-[0_12px_30px_rgba(103,130,170,0.08)]">
        <div className="h-8 w-full rounded-full bg-[#eef4fb]" />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-24 rounded-full bg-[#eef4fb]" />
              <div className="h-12 rounded-xl bg-[#f5f9fd]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
