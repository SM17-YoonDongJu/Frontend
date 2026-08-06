"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { cn } from "@/shared/lib/utils";

export interface PopoverProps {
  open: boolean;
  onClose: () => void;
  /** 트리거 요소. 바깥 클릭 판정에서 제외하고, 닫힐 때 포커스를 복귀시킨다. */
  triggerRef: RefObject<HTMLElement | null>;
  label: string;
  children: ReactNode;
  /** 패널 오버라이드(예: w-95, left-0 앵커 변경) */
  className?: string;
}

/** 트리거에 앵커되는 드롭다운 패널 셸. Esc·바깥 클릭 닫기 내장, 소비처가 relative 래퍼를 소유한다. */
export function Popover({
  open,
  onClose,
  triggerRef,
  label,
  children,
  className,
}: PopoverProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      onClose();
      triggerRef.current?.focus();
    };
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      onClose();
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label={label}
      tabIndex={-1}
      className={cn(
        "absolute right-0 top-full z-50 mt-2 rounded-card-lg border border-line bg-card shadow-[0_1.5rem_4rem_-1.5rem_rgba(21,32,46,0.4)] outline-none",
        className,
      )}
    >
      {children}
    </div>
  );
}
