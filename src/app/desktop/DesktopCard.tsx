import type { ReactNode } from "react";

export function DesktopCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-xl shadow-black/5">
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      <div className="mt-3 space-y-4 text-sm text-[#16140f]/70">{children}</div>
    </div>
  );
}

export const primaryButtonClass =
  "flex w-full items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition hover:bg-brand-dark";
