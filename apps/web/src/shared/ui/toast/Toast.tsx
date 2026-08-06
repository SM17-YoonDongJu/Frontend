import type { ComponentType } from "react";
import { cn } from "@/shared/lib/utils";
import { CheckCircle } from "@/shared/ui/icons/CheckCircle";
import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import { X } from "@/shared/ui/icons/X";
import type { ToastVariant } from "./toast-store";

interface VariantConfig {
  role: "status" | "alert";
  iconWrap: string;
  Icon: ComponentType<{ className?: string }>;
}

const VARIANT: Record<ToastVariant, VariantConfig> = {
  success: { role: "status", iconWrap: "bg-green-soft text-green", Icon: CheckCircle },
  error: { role: "alert", iconWrap: "bg-terra-soft text-terra", Icon: AlertTriangle },
};

export interface ToastProps {
  variant: ToastVariant;
  message: string;
  onClose: () => void;
}

/** 단일 토스트 프레젠테이션. 스택·타이머·구독은 Toaster가 담당. */
export function Toast({ variant, message, onClose }: ToastProps) {
  const { role, iconWrap, Icon } = VARIANT[variant];

  return (
    <div
      role={role}
      className="flex w-full items-start gap-3 rounded-card border border-line bg-card p-3.5 shadow-popover"
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-chip text-[1.125rem]",
          iconWrap,
        )}
      >
        <Icon />
      </span>
      <p className="min-w-0 flex-1 pt-1 text-sm font-semibold break-words text-ink">
        {message}
      </p>
      <button
        type="button"
        onClick={onClose}
        aria-label="알림 닫기"
        className="-mt-0.5 -mr-0.5 shrink-0 rounded-chip p-1 text-base text-ink-3 transition hover:bg-paper"
      >
        <X />
      </button>
    </div>
  );
}
