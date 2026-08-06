"use client";

import { useEffect, useRef } from "react";
import { useFocusTrap } from "@/shared/lib/use-focus-trap";
import { X } from "@/shared/ui/icons/X";
import { isImageMime } from "../_model/mime";
import type { ReviewAttachment } from "../_model/types";

export function AttachmentPreviewModal({ file, onClose }: { file: ReviewAttachment; onClose: () => void }) {
  const isImage = isImageMime(file.mimeType);
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${file.name} 원본 미리보기`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-ink/60 p-4 sm:p-8"
    >
      <div className="flex w-full max-w-4xl items-center justify-between gap-2 text-white">
        <p className="text-[0.9375rem] font-semibold">{file.name}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="rounded-full p-2 transition hover:bg-white/15"
        >
          <X className="size-[1.375rem]" />
        </button>
      </div>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[80vh] w-full max-w-4xl items-center justify-center overflow-auto rounded-card bg-card"
      >
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={file.url} alt={file.name} className="max-h-[80vh] w-auto object-contain" />
        ) : (
          <iframe
            src={file.url}
            title={file.name}
            sandbox=""
            className="h-[80vh] w-full"
          />
        )}
      </div>
    </div>
  );
}
