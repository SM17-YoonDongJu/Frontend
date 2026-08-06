"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { useFocusTrap } from "@/shared/lib/use-focus-trap";

export interface ModalProps {
  open: boolean;
  title: string;
  /** 타이틀 위 작은 골드 라벨(예: "내 정보") */
  kicker?: string;
  /** 배경/Esc로 닫기 허용 여부. 강제 선택 플로우면 false. */
  dismissible?: boolean;
  onClose: () => void;
  children: ReactNode;
  /** 카드 오버라이드(예: max-w-sm) */
  className?: string;
}

/** 오버레이 + 카드 모달 셸. 포커스 트랩·Esc·overlay 클릭 닫기 내장, 본문은 children 슬롯. */
export function Modal({
  open,
  title,
  kicker,
  dismissible = true,
  onClose,
  children,
  className,
}: ModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(cardRef, open);

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4"
    >
      <div
        ref={cardRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "max-h-[85dvh] w-full max-w-[31.25rem] overflow-y-auto rounded-[1.25rem] bg-card px-8 pb-6.5 pt-7.5 shadow-modal outline-none",
          className,
        )}
      >
        {kicker && (
          <p className="mb-1 text-[0.75rem] font-bold text-gold-ink">{kicker}</p>
        )}
        <h2 className="font-serif text-[1.4375rem] font-bold text-ink">{title}</h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
