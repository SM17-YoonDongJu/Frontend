import { cn } from "@/shared/lib/utils";
import { IN_PROGRESS_STAGE_LABELS } from "../_model/in-progress-status-meta";

const STAGE_TONES = [
  { dot: "bg-gold", from: "from-gold", to: "to-gold", halo: "ring-gold-soft" },
  { dot: "bg-navy", from: "from-navy", to: "to-navy", halo: "ring-navy/15" },
  { dot: "bg-terra-2", from: "from-terra-2", to: "to-terra-2", halo: "ring-terra-2/25" },
  { dot: "bg-green", from: "from-green", to: "to-green", halo: "ring-green-soft" },
] as const;

export function InProgressStageTracker({ currentIndex }: { currentIndex: number }) {
  const lastIndex = IN_PROGRESS_STAGE_LABELS.length - 1;

  return (
    <ol className="mt-3 flex items-start">
      {IN_PROGRESS_STAGE_LABELS.map((label, index) => {
        const reached = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const tone = STAGE_TONES[index] ?? STAGE_TONES[0];
        const nextTone = STAGE_TONES[index + 1] ?? tone;
        const lineDone = index < currentIndex;

        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "size-3 shrink-0 rounded-full transition-colors",
                  reached ? cn(tone.dot, isCurrent ? "ring-[5px]" : "ring-4", tone.halo) : "bg-line",
                )}
              />
              <span
                className={cn(
                  "text-[0.6875rem] whitespace-nowrap",
                  reached ? "font-semibold text-ink" : "text-ink-3",
                )}
              >
                {label}
              </span>
            </div>
            {index < lastIndex && (
              <span
                className={cn(
                  "-mt-4.5 mx-1.5 h-px flex-1",
                  lineDone ? cn("bg-gradient-to-r", tone.from, nextTone.to) : "bg-line",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
