interface KakaoProps {
  className?: string;
}

/** 카카오 심볼(말풍선). 크기·색은 className으로(currentColor fill). */
export function Kakao({ className }: KakaoProps) {
  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 3C6.48 3 2 6.54 2 10.9c0 2.82 1.87 5.29 4.68 6.68-.21.75-.75 2.72-.86 3.14-.13.52.19.51.4.37.17-.11 2.66-1.81 3.74-2.55.66.1 1.35.15 2.04.15 5.52 0 10-3.54 10-7.79C22 6.54 17.52 3 12 3Z" />
    </svg>
  );
}
