interface SectionSkeletonProps {
  height?: string;
}

export function SectionSkeleton({ height = "12rem" }: SectionSkeletonProps) {
  return (
    <div
      aria-hidden
      className="animate-pulse rounded-card border border-line bg-paper-2"
      style={{ height }}
    />
  );
}
