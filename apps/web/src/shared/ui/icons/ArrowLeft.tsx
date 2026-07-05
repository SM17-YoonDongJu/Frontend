interface ArrowLeftProps {
  className?: string;
}

/** 좌향 화살표(뒤로가기). 크기·색은 className으로(currentColor). */
export function ArrowLeft({ className }: ArrowLeftProps) {
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
      <path d="M19 12H5" />
      <path d="M11 18l-6-6 6-6" />
    </svg>
  );
}
