"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useFocusTrap } from "@/shared/lib/use-focus-trap";
import { cn } from "@/shared/lib/utils";
import { X } from "@/shared/ui/icons/X";

export interface BottomSheetProps {
  open: boolean;
  /** 시트 제목(스크린리더 라벨 겸용) */
  title: string;
  /** 타이틀 위 작은 골드 라벨(예: "마이페이지") */
  kicker?: string;
  /** 배경/Esc/핸들로 닫기 허용 여부 */
  dismissible?: boolean;
  onClose: () => void;
  children: ReactNode;
  /** 시트 패널 오버라이드 */
  className?: string;
}

/**
 * 하단 고정 바텀시트 셸. 모바일 오버레이용.
 * 드래그 핸들 + 닫기 버튼 + 포커스 트랩 + Esc/오버레이 닫기 내장, 본문은 children 슬롯.
 * (디자인 시스템 light 전용 — dark: 변형 없음.)
 */
export function BottomSheet({
  open,
  title,
  kicker,
  dismissible = true,
  onClose,
  children,
  className,
}: BottomSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open || !dismissible) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, dismissible, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={dismissible ? onClose : undefined}
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "max-h-[90dvh] w-full max-w-[30rem] overflow-y-auto rounded-t-card-lg bg-card px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-3 shadow-sheet outline-none",
          className,
        )}
      >
        {dismissible && (
          <div className="flex justify-center pb-4">
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="h-1.5 w-10 rounded-full bg-line transition hover:brightness-[.96]"
            />
          </div>
        )}

        <div className="mb-4 flex items-start justify-between">
          <div>
            {kicker && (
              <p className="mb-1 text-[0.75rem] font-bold text-gold-ink">
                {kicker}
              </p>
            )}
            <h2 className="font-serif text-[1.4375rem] font-bold text-ink">
              {title}
            </h2>
          </div>
          {dismissible && (
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="flex size-8.5 items-center justify-center rounded-full text-ink-3 transition hover:bg-paper"
            >
              <X className="size-[1.0625rem]" />
            </button>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
