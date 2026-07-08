interface ChevronLeftProps {
  className?: string;
}

/** 좌향 셰브런(뒤로 가기). 크기·색은 className으로(currentColor). */
export function ChevronLeft({ className }: ChevronLeftProps) {
  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}
