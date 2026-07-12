interface ImageIconProps {
  className?: string;
}

/** 이미지(갤러리). 크기·색은 className으로(currentColor). */
export function ImageIcon({ className }: ImageIconProps) {
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
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M20 16l-4.5-4.5L7 20" />
    </svg>
  );
}
