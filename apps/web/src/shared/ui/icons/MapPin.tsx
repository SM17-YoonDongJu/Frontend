interface MapPinProps {
  className?: string;
}

/** 지역(위치) 핀. 크기·색은 className으로(currentColor). */
export function MapPin({ className }: MapPinProps) {
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
      <path d="M20 10.5c0 5.25-8 11-8 11s-8-5.75-8-11a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10.5" r="2.8" />
    </svg>
  );
}
