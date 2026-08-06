"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ComingSoonButtonProps {
  children: ReactNode;
  className?: string;
}

/** 미지원 액션 버튼 — 클릭 시 "추후 지원 예정" 안내를 잠시 노출. */
export function ComingSoonButton({ children, className }: ComingSoonButtonProps) {
  const [notice, setNotice] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const showNotice = () => {
    setNotice(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setNotice(false), 2000);
  };

  return (
    <span className="inline-flex shrink-0 items-center gap-2">
      {notice && (
        <span role="status" className="text-[0.75rem] text-ink-3">
          추후 지원 예정
        </span>
      )}
      <button type="button" onClick={showNotice} className={className}>
        {children}
      </button>
    </span>
  );
}
