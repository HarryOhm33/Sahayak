import type { ReactNode } from "react";

interface FlatBadgeProps {
  active?: boolean;
  outline?: boolean;
  children: ReactNode;
}

export const FlatBadge = ({ active, outline, children }: FlatBadgeProps) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider ${active
      ? "bg-emerald-100 text-emerald-700"
      : outline
        ? "border border-zinc-300 text-zinc-700"
        : "bg-red-100 text-red-700"
      }`}
  >
    {children}
  </span>
);
