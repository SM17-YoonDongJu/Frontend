interface ChevronDownProps {
  className?: string;
}

/** 아래 방향 셰브런(드롭다운 표시). 크기·색은 className으로(currentColor). */
export function ChevronDown({ className }: ChevronDownProps) {
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
      <path d="M5 9l7 7 7-7" />
    </svg>
  );
}
