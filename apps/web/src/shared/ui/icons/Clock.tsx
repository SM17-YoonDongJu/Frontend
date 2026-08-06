interface ClockProps {
  className?: string;
}

/** 시계(최근·시간). 크기·색은 className으로(currentColor). */
export function Clock({ className }: ClockProps) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6.8V12l3.4 2" />
    </svg>
  );
}
