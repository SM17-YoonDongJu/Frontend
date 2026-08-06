"use client";

import { cn } from "@/shared/lib/utils";
import type { RegionValue } from "@/shared/model/regions";
import { Checkbox } from "@/shared/ui/Checkbox";
import { Check } from "@/shared/ui/icons/Check";
import { ROW } from "./row-style";

export interface OptionProps {
  multiple: boolean;
  isSelected: (option: RegionValue) => boolean;
  onSelect: (option: RegionValue) => void;
}

/** 다중 모드는 체크박스 행, 단일 모드는 선택 시 체크 표시가 붙는 버튼 행. */
export function OptionRow({
  option,
  label,
  multiple,
  isSelected,
  onSelect,
}: OptionProps & { option: RegionValue; label: string }) {
  const selected = isSelected(option);
  const text = (
    <span
      className={cn(
        "flex-1 text-left",
        selected || option.district === null ? "font-bold text-ink" : "font-medium text-ink-2",
      )}
    >
      {label}
    </span>
  );

  if (multiple) {
    return (
      <Checkbox
        checked={selected}
        onChange={() => onSelect(option)}
        label={text}
        className={cn(ROW, "gap-2.5", selected ? "bg-paper-2" : "hover:bg-paper")}
      />
    );
  }

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(option)}
      className={cn(ROW, selected ? "bg-paper-2" : "hover:bg-paper")}
    >
      {text}
      {selected && <Check className="shrink-0 text-[1.0625rem] text-gold" />}
    </button>
  );
}
