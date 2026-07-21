"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { useFocusTrap } from "@/shared/lib/use-focus-trap";
import type { HoldReason } from "../_model/review.schema";

const REASON_OPTIONS: { value: HoldReason; label: string }[] = [
  { value: "NEED_MORE_DOCUMENTS", label: "자료 보완 필요" },
  { value: "OUT_OF_SPECIALTY", label: "전문분야 아님" },
  { value: "SCHEDULE_CONFLICT", label: "일정 어려움" },
  { value: "OTHER", label: "기타" },
];

export interface HoldReasonDialogProps {
  isPending: boolean;
  onConfirm: (reason: HoldReason, reasonDetail?: string | null) => void;
  onClose: () => void;
}

export function HoldReasonDialog({ isPending, onConfirm, onClose }: HoldReasonDialogProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  useFocusTrap(cardRef, true);

  const [otherOpen, setOtherOpen] = useState(false);
  const [detail, setDetail] = useState("");
  const canConfirmOther = detail.trim().length > 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleSelect(reason: HoldReason) {
    if (reason === "OTHER") {
      setOtherOpen(true);
      return;
    }
    onConfirm(reason);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="검수 보류 사유 선택"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4"
    >
      <div
        ref={cardRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-card-lg border border-line bg-card p-6 shadow-lg outline-none"
      >
        <h2 className="font-serif text-[1.125rem] font-bold text-ink">보류 사유를 선택해 주세요</h2>
        <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-2">
          선택한 사유는 배정 관리에 전달됩니다.
        </p>

        {otherOpen ? (
          <div className="mt-4 space-y-3">
            <div>
              <Label htmlFor="hold-reason-detail">기타 사유</Label>
              <Input
                id="hold-reason-detail"
                multiline
                rows={3}
                className="mt-1.5"
                placeholder="보류 사유를 입력해 주세요."
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setOtherOpen(false)}>
                뒤로
              </Button>
              <Button
                size="sm"
                loading={isPending}
                disabled={!canConfirmOther}
                onClick={() => onConfirm("OTHER", detail.trim())}
              >
                보류
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {REASON_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={isPending}
                onClick={() => handleSelect(option.value)}
                className="w-full rounded-card border border-line-2 bg-paper-2 px-4 py-3 text-left text-[0.875rem] font-medium text-ink transition hover:border-gold-2 hover:bg-gold-soft/30 disabled:opacity-60"
              >
                {option.label}
              </button>
            ))}
            <Button variant="ghost" size="sm" className="mt-1 self-end" onClick={onClose}>
              취소
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
