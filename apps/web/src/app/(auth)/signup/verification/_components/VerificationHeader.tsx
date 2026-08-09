import { cn } from "@/shared/lib/utils";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import { Scale } from "@/shared/ui/icons/Scale";

export interface BreadcrumbItem {
  label: string;
  state: "done" | "active" | "todo";
}

interface VerificationHeaderProps {
  breadcrumb: BreadcrumbItem[];
}

const CRUMB_STYLE = {
  done: "font-semibold text-ink",
  active: "font-bold text-gold-ink",
  todo: "font-medium text-ink-3",
} as const;

/** 데스크톱 전용 상단 바: 바른보상 로고 + 진행 브레드크럼. */
export function VerificationHeader({ breadcrumb }: VerificationHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line-2 bg-card px-6 py-4 md:px-14">
      <div className="flex items-center gap-2.5">
        <span className="flex size-[1.875rem] items-center justify-center rounded-tag bg-gold text-[1.125rem] text-white">
          <Scale />
        </span>
        <span className="font-serif text-[1.25rem] font-bold text-ink">바른보상</span>
      </div>

      <nav aria-label="진행 단계" className="flex items-center gap-2">
        {breadcrumb.map((item, index) => (
          <div key={item.label} className="flex items-center gap-2">
            {index > 0 && <ChevronRight className="text-[0.875rem] text-ink-3" />}
            <span className={cn("text-[0.84375rem]", CRUMB_STYLE[item.state])}>{item.label}</span>
          </div>
        ))}
      </nav>
    </header>
  );
}
