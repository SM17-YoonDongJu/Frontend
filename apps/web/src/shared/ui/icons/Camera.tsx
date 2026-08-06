interface CameraProps {
  className?: string;
}

/** 카메라(사진 촬영). 크기·색은 className으로(currentColor). */
export function Camera({ className }: CameraProps) {
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
      <path d="M4 7h3l2-2.5h6L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}
