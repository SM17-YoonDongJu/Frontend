interface HomeProps {
  className?: string;
}

/** 홈(집) 아이콘. 크기·색은 className으로(currentColor). */
export function Home({ className }: HomeProps) {
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
      <path d="M3 10.5 12 4l9 6.5" />
      <path d="M5 9.5V20h14V9.5" />
    </svg>
  );
}
