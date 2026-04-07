import React from "react";

type AuthShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function AuthShell({
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(420px,1fr)]">
        <section className="flex items-center bg-[#18a8df] px-8 py-16 text-white sm:px-12 lg:px-16 xl:px-20">
          <div className="max-w-[440px]">
            <p className="text-4xl font-semibold leading-[1.25] sm:text-5xl">
              {title}
            </p>
            <p className="mt-6 text-lg leading-8 text-white/92">
              {description}
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-[420px]">{children}</div>
        </section>
      </div>
    </main>
  );
}
