import { cn } from "@/shared/lib/utils";

interface RatingStarProps {
  /** 채워진 별(골드) 여부. false면 외곽선만 */
  filled: boolean;
  /** 한 변 크기(rem). 미지정 시 className으로 크기를 준다 */
  size?: number;
  className?: string;
}

/** 평점 표시·입력에 쓰는 별. 채움 상태에 따라 골드·라인 색이 바뀐다. */
export function RatingStar({ filled, size, className }: RatingStarProps) {
  const dimension = size === undefined ? undefined : `${size}rem`;

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn(filled ? "text-gold-2" : "text-line", className)}
    >
      <path d="M12 3l2.7 5.4 6 .9-4.3 4.2 1 6L12 17l-5.4 2.8 1-6L3.3 9.3l6-.9L12 3z" />
    </svg>
  );
}
