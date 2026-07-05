import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { Check } from "@/shared/ui/icons/Check";

interface RoleCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  /** 하단 강조 한 줄(선택 시 골드, 미선택 시 흐린 톤) */
  hint: string;
  /** 제목 옆 배지(예: "자격 인증 필요") */
  badge?: string;
  selected: boolean;
  onSelect: () => void;
}

/** 역할 선택 카드(라디오, 단일선택). 선택 시 딥네이비 배경·골드 체크. */
export function RoleCard({ icon, title, description, hint, badge, selected, onSelect }: RoleCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-4 rounded-input border p-5 text-left transition hover:brightness-[.98]",
        selected ? "border-navy bg-navy" : "border-line bg-card",
      )}
    >
      <span
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-input text-[1.5rem]",
          selected ? "bg-white/12 text-white" : "bg-gold-soft text-gold-ink",
        )}
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className={cn("text-base font-bold", selected ? "text-white" : "text-ink")}>
            {title}
          </span>
          {badge && (
            <span className="rounded-pill bg-gold-soft px-2 py-0.5 text-[0.6875rem] font-bold text-gold-ink">
              {badge}
            </span>
          )}
        </span>
        <span
          className={cn(
            "mt-1 block text-[0.8125rem]",
            selected ? "text-white/65" : "text-ink-3",
          )}
        >
          {description}
        </span>
        <span
          className={cn(
            "mt-1 block text-xs font-semibold",
            selected ? "text-gold-2" : "text-ink-3",
          )}
        >
          {hint}
        </span>
      </span>

      <span
        aria-hidden
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-chip border transition",
          selected ? "border-gold-2 bg-gold-2 text-white" : "border-line",
        )}
      >
        {selected && <Check className="text-[0.75rem]" />}
      </span>
    </button>
  );
}
