interface MegaphoneProps {
  className?: string;
}

/** 확성기 아이콘. 크기·색은 className으로(currentColor). */
export function Megaphone({ className }: MegaphoneProps) {
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
      <path d="m3 11 15-5v12L3 13v-2Z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      <path d="M18 8a3 3 0 0 1 0 6" />
    </svg>
  );
}
