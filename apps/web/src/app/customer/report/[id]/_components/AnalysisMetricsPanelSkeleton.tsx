/**
 * "AI 분석 근거" 접힌 헤더와 같은 높이 — 수치가 도착해도 아래 내용이 밀리지 않게.
 * 높이 = 헤더 버튼 세로 패딩 + 제목 한 줄(line-height 1.5) + 위아래 1px 보더 실측값
 * (모바일 3.35rem, 데스크톱 4.03125rem). 패널 헤더 스타일을 바꾸면 같이 맞춘다.
 */
export function AnalysisMetricsPanelSkeleton() {
  return (
    <div
      role="status"
      aria-label="AI 분석 근거 불러오는 중"
      className="h-[3.35rem] animate-pulse rounded-card border border-line bg-line-2/40 lg:h-[4.03125rem] lg:rounded-card-lg"
    />
  );
}
