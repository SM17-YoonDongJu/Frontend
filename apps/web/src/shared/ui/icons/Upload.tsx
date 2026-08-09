interface UploadProps {
  className?: string;
}

/** 업로드(위 화살표+트레이) 아이콘. 크기·색은 className으로(currentColor). */
export function Upload({ className }: UploadProps) {
  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 16V4m0 0 4 4m-4-4-4 4" />
      <path d="M5 18v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1" />
    </svg>
  );
}
