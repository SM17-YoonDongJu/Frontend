interface NaverProps {
  className?: string;
}

/** 네이버 심볼(N). 크기·색은 className으로(currentColor fill). */
export function Naver({ className }: NaverProps) {
  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M16.273 12.845 7.376 0H0v24h7.726V11.155L16.624 24H24V0h-7.727v12.845Z" />
    </svg>
  );
}
