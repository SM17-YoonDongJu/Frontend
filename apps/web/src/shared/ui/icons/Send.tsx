interface SendProps {
  className?: string;
}

/** 종이비행기(전송) 아이콘. 크기·색은 className으로(currentColor). */
export function Send({ className }: SendProps) {
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
      <path d="M21 3L10.5 13.5" />
      <path d="M21 3l-6.5 18-4-8-8-4 18-6.5z" />
    </svg>
  );
}
