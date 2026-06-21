"use client";

import { useEffect } from "react";
import { Button } from "@/shared/ui/Button";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  confirmTone?: "primary" | "danger";
  /** 배경/Esc로 닫을 때 동작(생략 시 onCancel). 강제 선택이면 undefined로 두지 말고 막을 것. */
  dismissible?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  confirmTone = "primary",
  dismissible = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open || !dismissible) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, dismissible, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={dismissible ? onCancel : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-card-lg border border-line bg-card p-6 shadow-lg"
      >
        <h2 className="font-serif text-[18px] font-bold text-ink">{title}</h2>
        {description && (
          <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{description}</p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={confirmTone} size="sm" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
