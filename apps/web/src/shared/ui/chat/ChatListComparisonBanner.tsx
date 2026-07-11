import { cn } from "@/shared/lib/utils";
import { Scale } from "@/shared/ui/icons/Scale";

export interface ChatListComparisonBannerProps {
  /** 배너 문구의 사건 유형(예: "후유장해"). */
  reportTypeLabel: string;
  /** "N명과 상담 중" 수. */
  comparingCount: number;
  className?: string;
}

/**
 * 목록 상단 비교 안내 배너(모바일 전용 — 데스크톱 목록엔 없음).
 * Figma 1011:9251 — 골드 카드 배너. 스레드 배너(ChatComparisonBanner)와 문구가 다르다.
 * 데이터·수치 계산은 배선층에서 주입한다(presentational).
 */
export function ChatListComparisonBanner({
  reportTypeLabel,
  comparingCount,
  className,
}: ChatListComparisonBannerProps) {
  return (
    <div
      className={cn(
        "mx-5 mb-3 mt-1 flex items-start gap-2.5 rounded-input bg-gold-soft px-4 py-3.5",
        className,
      )}
    >
      <Scale className="mt-0.5 shrink-0 text-[1.125rem] text-gold-ink" />
      <p className="text-[0.75rem] leading-relaxed text-gold-ink">
        {reportTypeLabel} 건으로 {comparingCount}명과 상담 중이에요. 한 명을{" "}
        <b className="font-bold">매칭 완료</b>하면 나머지는 정리돼요.
      </p>
    </div>
  );
}
