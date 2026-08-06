import { cn } from "@/shared/lib/utils";
import { ShieldCheck } from "@/shared/ui/icons/ShieldCheck";

/** 보험 0건 빈 상태 — 텍스트 중심 최소 처리(디자인 프레임 미제공). */
export function InsuranceEmpty({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-[0.875rem] border border-dashed border-line bg-paper-2 px-6 py-9 text-center",
        className,
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-button bg-gold-soft text-gold-ink">
        <ShieldCheck className="size-5.5" />
      </span>
      <p className="mt-3 text-[0.875rem] font-bold text-ink">아직 등록된 보험이 없어요</p>
      <p className="mt-1 text-[0.8125rem] text-ink-3">
        아래에서 보험사·상품명을 입력해 추가해 보세요.
      </p>
    </div>
  );
}
