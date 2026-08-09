"use client";

import { useState, type KeyboardEvent } from "react";
import { cn } from "@/shared/lib/utils";
import { RatingStar } from "@/shared/ui/icons/RatingStar";

const STAR_SIZE = { lg: "size-10", sm: "size-6" } as const;
const STAR_GAP = { lg: "gap-2", sm: "gap-1" } as const;

export interface StarRatingInputProps {
  /** 선택된 점수(1~max). 0이면 미선택 */
  value: number;
  onChange: (score: number) => void;
  max?: number;
  size?: keyof typeof STAR_SIZE;
  /** radiogroup 접근성 라벨 */
  label: string;
  className?: string;
}

export function StarRatingInput({
  value,
  onChange,
  max = 5,
  size = "lg",
  label,
  className,
}: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0);
  const highlighted = hovered || value;

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    let next = value;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") next = Math.min(max, value + 1);
    else if (event.key === "ArrowLeft" || event.key === "ArrowDown") next = Math.max(1, value - 1);
    else if (event.key === "Home") next = 1;
    else if (event.key === "End") next = max;
    else return;
    event.preventDefault();
    onChange(next);
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("inline-flex items-center", STAR_GAP[size], className)}
      onMouseLeave={() => setHovered(0)}
    >
      {Array.from({ length: max }, (_, index) => {
        const star = index + 1;
        const checked = value === star;
        const isRovingFocusable = checked || (value === 0 && index === 0);
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={`${max}점 중 ${star}점`}
            tabIndex={isRovingFocusable ? 0 : -1}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onKeyDown={handleKeyDown}
            className={cn(
              "rounded-sm transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-gold-soft",
              STAR_SIZE[size],
            )}
          >
            <RatingStar filled={star <= highlighted} className="size-full transition" />
          </button>
        );
      })}
    </div>
  );
}
