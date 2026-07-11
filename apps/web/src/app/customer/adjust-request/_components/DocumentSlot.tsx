"use client";

import { useId, useRef } from "react";
import { cn } from "@/shared/lib/utils";
import { Check } from "@/shared/ui/icons/Check";
import { FileText } from "@/shared/ui/icons/FileText";
import { Spinner } from "@/shared/ui/icons/Spinner";
import { Upload } from "@/shared/ui/icons/Upload";
import type { DocumentSlotDef } from "../_model/document-slots";

export type SlotStatus = "idle" | "uploading" | "done" | "error";

interface DocumentSlotProps {
  def: DocumentSlotDef;
  status: SlotStatus;
  fileName?: string;
  errorMessage?: string;
  accept: string;
  onPickFile: (file: File) => void;
  onRetry?: () => void;
  onRemove?: () => void;
}

const TILE_STYLE: Record<SlotStatus, string> = {
  idle: "border border-line bg-paper-2 text-ink-3",
  uploading: "bg-gold-soft text-gold-ink",
  done: "bg-green-soft text-green",
  error: "bg-terra-soft text-terra",
};

/** 명명된 서류 슬롯 카드. 업로드 뮤테이션은 부모가 소유 — 여기서는 파일 선택만. */
export function DocumentSlot({
  def,
  status,
  fileName,
  errorMessage,
  accept,
  onPickFile,
  onRetry,
  onRemove,
}: DocumentSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const trigger = () => inputRef.current?.click();

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-input border bg-card px-3.5 py-3",
        status === "error" ? "border-terra" : "border-line",
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-button text-[1.125rem]",
          TILE_STYLE[status],
        )}
      >
        {status === "idle" ? <Upload /> : <FileText />}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-[0.875rem] font-bold text-ink">{def.label}</p>
          {def.required ? (
            <span className="rounded-tag bg-gold-soft px-1.5 py-0.5 text-[0.625rem] font-bold text-gold-ink">
              필수
            </span>
          ) : (
            <span className="rounded-tag border border-line-2 bg-paper-2 px-1.5 py-0.5 text-[0.625rem] font-bold text-ink-3">
              선택
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-[0.6875rem] sm:text-[0.75rem]" role={status === "error" ? "alert" : undefined}>
          {status === "error" ? (
            <span className="text-terra">{errorMessage ?? "업로드 실패"}</span>
          ) : fileName ? (
            <span className={status === "done" ? "text-green" : "text-gold-ink"}>{fileName}</span>
          ) : def.hint ? (
            <span className="text-ink-3">{def.hint}</span>
          ) : null}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {status === "uploading" && (
          <span className="text-gold-ink">
            <Spinner />
          </span>
        )}

        {status === "done" && (
          <>
            <Check className="text-[1.125rem] text-green" />
            <span className="sr-only">업로드 완료</span>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                aria-label={`${def.label} 삭제`}
                className="text-ink-3 transition hover:text-terra"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </>
        )}

        {status === "error" && (
          <button
            type="button"
            onClick={() => (onRetry ? onRetry() : trigger())}
            className="inline-flex items-center gap-1 rounded-pill border border-line px-2.5 py-1 text-[0.78125rem] text-ink-2 transition hover:border-ink/40"
          >
            재시도
          </button>
        )}

        {status === "idle" && (
          <button
            type="button"
            onClick={trigger}
            className="inline-flex items-center gap-1 text-[0.8125rem] font-bold text-gold-ink transition hover:opacity-80"
          >
            <Upload className="text-[0.875rem]" />
            올리기
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        aria-label={`${def.label} 파일 선택`}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPickFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
