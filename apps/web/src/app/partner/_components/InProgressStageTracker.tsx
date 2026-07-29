import { cn } from "@/shared/lib/utils";
import { IN_PROGRESS_STAGE_LABELS } from "../_model/in-progress-status-meta";

const STAGE_TONES = [
  { dot: "bg-gold", ring: "ring-gold-soft" },
  { dot: "bg-navy", ring: "ring-navy/20" },
  { dot: "bg-terra-2", ring: "ring-terra-2/30" },
  { dot: "bg-green", ring: "ring-green-soft" },
] as const;

export function InProgressStageTracker({ currentIndex }: { currentIndex: number }) {
  const lastIndex = IN_PROGRESS_STAGE_LABELS.length - 1;

  return (
    <ol className="mt-3 flex items-start">
      {IN_PROGRESS_STAGE_LABELS.map((label, index) => {
        const reached = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const tone = STAGE_TONES[index] ?? STAGE_TONES[0];

        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "size-2.5 shrink-0 rounded-full",
                  reached ? tone.dot : "bg-line",
                  isCurrent && `ring-[3px] ${tone.ring}`,
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
                  index < currentIndex ? tone.dot : "bg-line",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
