interface CloseProps {
  className?: string;
}

/** 닫기(X) 아이콘. 크기·색은 className으로(currentColor). */
export function Close({ className }: CloseProps) {
  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
