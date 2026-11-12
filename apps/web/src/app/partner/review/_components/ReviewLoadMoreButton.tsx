"use client";

interface Props {
  loading: boolean;
  onClick: () => void;
  /** 레이아웃별 바깥 여백(모바일 카드 목록은 좌우 gutter가 있다). */
  className?: string;
}

/** 검수 대기 목록 "더보기" — 다음 페이지가 있을 때만 렌더한다. */
export function ReviewLoadMoreButton({ loading, onClick, className = "" }: Props) {
  return (
    <div className={className}>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="w-full rounded-button border border-line bg-card py-3 text-[0.875rem] font-semibold text-ink-2 transition hover:brightness-[.98] disabled:cursor-not-allowed disabled:opacity-[.42]"
      >
        {loading ? "불러오는 중…" : "더보기"}
      </button>
    </div>
  );
}
