import { cn } from "@/shared/lib/utils";

interface ToggleChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

/** 선택 토글 칩(치료형태 복수·비급여 단일 공용). */
export function ToggleChip({ label, selected, onClick }: ToggleChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "rounded-chip border px-4 py-2 text-[0.875rem] font-medium transition",
        selected ? "border-ink bg-ink text-white" : "border-line bg-card text-ink-2 hover:border-ink/40",
      )}
    >
      {label}
    </button>
  );
}
