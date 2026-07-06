import { Button } from "@/shared/ui/Button";

interface FunnelFooterProps {
  isFirst: boolean;
  isLast: boolean;
  loading?: boolean;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * 하단 진행 버튼.
 * - 모바일: 화면 하단 고정 + 전체폭 "다음"(이전은 상단 진행바의 뒤로가기로 대체)
 * - 데스크톱: 일반 흐름 + 이전/다음 양쪽 배치
 */
export function FunnelFooter({ isFirst, isLast, loading, onPrev, onNext }: FunnelFooterProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur sm:static sm:mt-6 sm:flex sm:items-center sm:justify-between sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
      <Button
        variant="ghost"
        onClick={onPrev}
        disabled={isFirst || loading}
        className="hidden sm:inline-flex"
      >
        ‹ 이전
      </Button>
      <Button onClick={onNext} loading={loading} full className="sm:w-auto">
        {isLast ? "분석 요청 →" : "다음 →"}
      </Button>
    </div>
  );
}
