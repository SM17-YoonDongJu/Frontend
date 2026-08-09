export function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-card bg-line-2 ${className}`} />;
}
