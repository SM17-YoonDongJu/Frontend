import { cn } from "@/shared/lib/utils";

export interface StarRatingProps {
  /** 평점(0~5). 정수로 반올림해 채워진 별 수를 결정 */
  score: number;
  /** 별 개수 (기본 5) */
  max?: number;
  /** 별 한 변 크기(rem) */
  size?: number;
  className?: string;
}

function StarIcon({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg
      width={`${size}rem`}
      height={`${size}rem`}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={filled ? "text-gold-2" : "text-line"}
    >
      <path d="M12 3l2.7 5.4 6 .9-4.3 4.2 1 6L12 17l-5.4 2.8 1-6L3.3 9.3l6-.9L12 3z" />
    </svg>
  );
}

export function StarRating({ score, max = 5, size = 0.875, className }: StarRatingProps) {
  const filled = Math.round(score);
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      role="img"
      aria-label={`5점 만점에 ${score}점`}
    >
      {Array.from({ length: max }, (_, i) => (
        <StarIcon key={i} filled={i < filled} size={size} />
      ))}
    </span>
  );
}
