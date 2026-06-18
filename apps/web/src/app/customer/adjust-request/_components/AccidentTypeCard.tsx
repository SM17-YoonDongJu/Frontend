import { cn } from "@/shared/lib/utils";

interface AccidentTypeCardProps {
  title: string;
  description: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

/** 사고유형 선택 카드(라디오). disabled 시 비활성. */
export function AccidentTypeCard({
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
        "flex min-h-[64px] items-center justify-between gap-3 rounded-card border px-5 py-4 text-left transition",
        selected ? "border-ink bg-ink text-white" : "border-line bg-card text-ink",
        disabled ? "cursor-not-allowed opacity-[.45]" : "hover:border-ink/40",
      )}
    >
      <span>
        <span className="block text-[15px] font-semibold">{title}</span>
        <span className={cn("block text-[12.5px]", selected ? "text-white/70" : "text-ink-3")}>
          {description}
        </span>
      </span>
      <span
        className={cn(
          "h-4 w-4 shrink-0 rounded-full border",
          selected ? "border-gold bg-gold" : "border-line",
        )}
      />
    </button>
  );
}
