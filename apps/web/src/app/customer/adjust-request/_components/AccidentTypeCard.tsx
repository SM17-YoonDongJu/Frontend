import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { Check } from "@/shared/ui/icons/Check";
import { Lock } from "@/shared/ui/icons/Lock";

interface AccidentTypeCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

/** 사고유형 선택 카드(라디오). 아이콘 박스 + 타이틀·설명 + 라디오. disabled 시 비활성 + 잠금 아이콘. */
export function AccidentTypeCard({
  icon,
  title,
  description,
  selected,
  disabled,
  onSelect,
}: AccidentTypeCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3.5 rounded-card border p-4 text-left transition",
        selected ? "border-navy bg-navy" : "border-line bg-card",
        // pointer-events-none: disabled 버튼은 포인터 이벤트를 삼켜 부모(툴팁 래퍼)가 hover/tap을 못 받음
        disabled ? "pointer-events-none opacity-[.45]" : "hover:border-ink/40",
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-input text-[1.375rem]",
          selected ? "bg-white/[.12] text-gold-2" : "bg-gold-soft text-gold-ink",
        )}
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className={cn("block text-[0.9375rem] font-bold", selected ? "text-white" : "text-ink")}>
          {title}
        </span>
        <span className={cn("mt-0.5 block text-[0.75rem]", selected ? "text-white/60" : "text-ink-3")}>
          {description}
        </span>
      </span>

      {disabled ? (
        <span className="flex h-[1.375rem] w-[1.375rem] shrink-0 items-center justify-center text-ink-3">
          <Lock className="text-[1rem]" />
        </span>
      ) : (
        <span
          className={cn(
            "flex h-[1.375rem] w-[1.375rem] shrink-0 items-center justify-center rounded-full border",
            selected ? "border-gold-2 bg-gold-2 text-white" : "border-line",
          )}
        >
          {selected && <Check className="text-[0.8125rem]" />}
        </span>
      )}
    </button>
  );
}
