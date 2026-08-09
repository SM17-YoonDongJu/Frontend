/** 회색 펄스 블록 스켈레톤. */
export function SectionSkeleton({ className = "h-40" }: { className?: string }) {
  return <div className={`animate-pulse rounded-card bg-line-2 ${className}`} />;
}
