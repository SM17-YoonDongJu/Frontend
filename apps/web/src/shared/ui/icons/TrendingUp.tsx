interface TrendingUpProps {
  className?: string;
}

/** 상승 추세 화살표 아이콘. 크기·색은 className으로(currentColor). */
export function TrendingUp({ className }: TrendingUpProps) {
  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 17 9 11l4 4 8-8" />
      <path d="M16 7h5v5" />
    </svg>
  );
}
