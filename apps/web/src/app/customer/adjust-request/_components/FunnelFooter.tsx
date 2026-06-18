import { Button } from "@/shared/ui/Button";

interface FunnelFooterProps {
  isFirst: boolean;
  isLast: boolean;
  loading?: boolean;
  onPrev: () => void;
  onNext: () => void;
}

/** 하단 이전/다음(마지막은 분석 요청). */
export function FunnelFooter({ isFirst, isLast, loading, onPrev, onNext }: FunnelFooterProps) {
  return (
    <div className="mt-8 flex items-center justify-between">
      <Button variant="ghost" onClick={onPrev} disabled={isFirst || loading}>
        ‹ 이전
      </Button>
      <Button onClick={onNext} loading={loading}>
        {isLast ? "분석 요청 →" : "다음 →"}
      </Button>
    </div>
  );
}
