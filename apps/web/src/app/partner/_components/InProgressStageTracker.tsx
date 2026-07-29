import { cn } from "@/shared/lib/utils";
import { IN_PROGRESS_STAGE_LABELS } from "../_model/in-progress-status-meta";

export function InProgressStageTracker({ currentIndex }: { currentIndex: number }) {
  const lastIndex = IN_PROGRESS_STAGE_LABELS.length - 1;
  const isDone = currentIndex >= lastIndex;

  return (
    <ol className="mt-3 flex items-start">
      {IN_PROGRESS_STAGE_LABELS.map((label, index) => {
        const reached = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const fillClass = isDone ? "bg-green" : "bg-gold";

        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "size-2.5 shrink-0 rounded-full",
                  reached ? fillClass : "bg-line",
                  isCurrent && !isDone && "ring-[3px] ring-gold-soft",
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
                  index < currentIndex ? fillClass : "bg-line",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
