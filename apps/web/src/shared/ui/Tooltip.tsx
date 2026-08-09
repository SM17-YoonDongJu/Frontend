"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface TooltipProps {
  /** 말풍선 문구. */
  label: string;
  /** 트리거 요소. disabled 버튼도 래퍼가 포인터 이벤트를 받아 동작한다. */
  children: ReactNode;
  /** 래퍼 오버라이드(예: w-full). */
  className?: string;
}

const TAP_DISMISS_MS = 2500;

/** hover·focus 시 위쪽에 뜨는 말풍선. 터치(hover 없음)는 탭 시 노출 후 자동 닫힘. */
export function Tooltip({ label, children, className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const hoverRef = useRef(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const showByTap = () => {
    window.clearTimeout(timerRef.current);
    setOpen(true);
    timerRef.current = window.setTimeout(() => {
      if (!hoverRef.current) setOpen(false);
    }, TAP_DISMISS_MS);
  };

  return (
    <span
      className={cn("relative inline-block", className)}
      onMouseEnter={() => {
        hoverRef.current = true;
        setOpen(true);
      }}
      onMouseLeave={() => {
        hoverRef.current = false;
        window.clearTimeout(timerRef.current);
        setOpen(false);
      }}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={showByTap}
    >
      {children}
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-input bg-ink px-3 py-2 text-[0.75rem] font-medium text-white"
        >
          {label}
          <span
            aria-hidden
            className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-ink"
          />
        </span>
      )}
    </span>
  );
}
