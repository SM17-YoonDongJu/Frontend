import { ChevronRight } from "@/shared/ui/icons/ChevronRight";
import { ProgressBar } from "@/shared/ui/ProgressBar";

interface SignupProgressProps {
  current: number;
  total: number;
  /** 뒤로가기(없으면 첫 단계 — 버튼 숨김) */
  onBack?: () => void;
}

/** 상단 진행 헤더: 뒤로가기 + 골드 진행바 + n/total. 모바일 전용 —
 *  PC(md 이상)는 카드 내부 뒤로가기로 대체되므로 소비처가 md:hidden으로 감싼다(#173). */
export function SignupProgress({ current, total, onBack }: SignupProgressProps) {
  return (
    <div className="flex items-center gap-3">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="이전 단계로"
          className="flex size-9 shrink-0 items-center justify-center rounded-chip text-ink transition hover:bg-paper"
        >
          <ChevronRight className="rotate-180 text-[1.25rem]" />
        </button>
      ) : (
        <span className="size-9 shrink-0" aria-hidden />
      )}

      <ProgressBar value={current} max={total} label="회원가입 진행" className="h-1.5 flex-1" />

      <span className="shrink-0 text-xs font-bold text-ink-3">
        {current}/{total}
      </span>

      <span className="size-9 shrink-0" aria-hidden />
    </div>
  );
}
