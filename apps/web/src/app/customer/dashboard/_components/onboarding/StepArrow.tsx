import { ChevronRight } from "@/shared/ui/icons/ChevronRight";

/** 단계 카드 사이 화살표 배지. 데스크톱에서만 노출. */
export function StepArrow() {
  return (
    <span
      aria-hidden
      className="absolute -right-2 top-1/2 z-10 hidden size-[1.625rem] -translate-y-1/2 items-center justify-center rounded-input border border-line bg-paper-2 text-ink-3 md:flex"
    >
      <ChevronRight className="text-[0.8125rem]" />
    </span>
  );
}
