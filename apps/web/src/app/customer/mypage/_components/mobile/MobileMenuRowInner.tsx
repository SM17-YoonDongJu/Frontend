import type { ReactNode } from "react";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";

interface MobileMenuRowInnerProps {
  icon: ReactNode;
  label: string;
  right?: ReactNode;
}

export function MobileMenuRowInner({
  icon,
  label,
  right,
}: MobileMenuRowInnerProps) {
  return (
    <>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-paper-2 text-ink-2">
        {icon}
      </span>
      <span className="flex-1 text-[0.9375rem] font-medium text-ink">{label}</span>
      {right}
      <ChevronRight className="size-4 shrink-0 text-ink-3" />
    </>
  );
}
