"use client";

import { cn } from "@/shared/lib/utils";
import { ChevronDown } from "@/shared/ui/icons/ChevronDown";
import { MapPin } from "@/shared/ui/icons/MapPin";
import { X } from "@/shared/ui/icons/X";

interface RegionSelectTriggerProps {
  /** 선택된 지역 라벨. null이면 미선택. */
  label: string | null;
  open: boolean;
  placeholder?: string;
  onToggle: () => void;
  onClear: () => void;
}

/**
 * 지역 드롭다운을 여는 pill 버튼. 선택되면 골드 보더 + 해제 버튼.
 * 해제 버튼은 트리거와 형제로 둔다(인터랙티브 중첩 금지).
 */
export function RegionSelectTrigger({
  label,
  open,
  placeholder = "지역",
  onToggle,
  onClear,
}: RegionSelectTriggerProps) {
  const selected = label !== null;

  return (
    <div
      className={cn(
        "inline-flex h-[2.625rem] items-center rounded-button border bg-card transition",
        selected ? "border-gold" : "border-line",
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={onToggle}
        className={cn(
          "flex h-full items-center gap-2 rounded-button pl-3.5 text-sm font-bold outline-none focus-visible:ring-[3px] focus-visible:ring-gold-soft",
          selected ? "pr-1.5 text-ink" : "pr-3.5 text-ink-3",
        )}
      >
        <MapPin className={cn("shrink-0 text-[1.0625rem]", selected ? "text-gold" : "text-ink-3")} />
        {label ?? placeholder}
        {!selected && <ChevronDown className="shrink-0 text-base" />}
      </button>

      {selected && (
        <button
          type="button"
          aria-label="지역 선택 해제"
          onClick={onClear}
          className="mr-2.5 flex size-[1.125rem] shrink-0 items-center justify-center rounded-full text-[0.875rem] text-ink-3 transition hover:bg-paper hover:text-ink"
        >
          <X />
        </button>
      )}
    </div>
  );
}
