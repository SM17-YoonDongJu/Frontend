import Link from "next/link";
import { CheckCircle } from "@/shared/ui/icons/CheckCircle";
import { ChevronRight } from "@/shared/ui/icons/ChevronRight";

export interface ChatComparisonBannerProps {
  variant: "comparing" | "matched";
  /** 배너 문구의 리포트 유형(예: "후유장해"). */
  reportTypeLabel: string;
  /** comparing 변형에서 "N명과 상담 중" 수. */
  comparingCount?: number;
  /** matched 변형에서 "진행 보기" 링크(사건 진행). */
  progressHref?: string;
  /** comparing 변형에서 "매칭 완료" 버튼 — 데스크톱 전용 배너라 이 버튼도 데스크톱에만 노출된다 */
  onMatchComplete?: () => void;
  matchCompletePending?: boolean;
}

/**
 * 스레드 상단 안내 배너.
 * - comparing: 같은 사건으로 몇 명과 비교 중인지 + 매칭 유도.
 * - matched: 매칭 완료 + 진행 단계 안내 + 진행 보기 링크.
 * 데이터·수치 계산은 배선층에서 주입한다(presentational).
 */
export function ChatComparisonBanner({
  variant,
  reportTypeLabel,
  comparingCount = 0,
  progressHref,
  onMatchComplete,
  matchCompletePending,
}: ChatComparisonBannerProps) {
  if (variant === "matched") {
    return (
      <div className="flex items-center gap-2.5 border-b border-line-2 bg-green-soft px-4 py-2.5 md:px-5.5">
        <CheckCircle className="shrink-0 text-[1rem] text-green" />
        <p className="min-w-0 flex-1 truncate text-[0.75rem] text-green">
          이 사정사와 매칭됐어요 · 자료 검토 단계 진행 중
        </p>
        {progressHref && (
          <Link
            href={progressHref}
            className="flex shrink-0 items-center gap-0.5 text-[0.75rem] font-bold text-green transition hover:brightness-[.96]"
          >
            진행 보기
            <ChevronRight className="text-[0.8125rem]" />
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 border-b border-line-2 bg-gold-soft px-4 py-2.5 md:px-5.5">
      <CheckCircle className="shrink-0 text-[1rem] text-gold-ink" />
      <p className="min-w-0 flex-1 text-[0.75rem] text-gold-ink">
        {reportTypeLabel} 건으로 {comparingCount}명과 상담 중 · 마음에 들면 매칭 완료를 누르세요
      </p>
      {onMatchComplete && (
        <button
          type="button"
          onClick={onMatchComplete}
          disabled={matchCompletePending}
          className="flex shrink-0 items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-[0.75rem] font-bold text-white transition hover:brightness-[.96] disabled:cursor-not-allowed disabled:opacity-[.42]"
        >
          <CheckCircle className="text-[0.875rem]" />
          매칭 완료
        </button>
      )}
    </div>
  );
}
