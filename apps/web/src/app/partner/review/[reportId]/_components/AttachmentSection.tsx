"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Button, buttonVariants } from "@/shared/ui/Button";
import { useFocusTrap } from "@/shared/lib/use-focus-trap";
import type { ReviewAttachment } from "../_model/types";

function PreviewModal({ file, onClose }: { file: ReviewAttachment; onClose: () => void }) {
  const isImage = /jpe?g|png|gif|webp|image/i.test(file.fileType);
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
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
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

export interface AttachmentSectionProps {
  attachments: ReviewAttachment[];
}

function fileMeta(file: ReviewAttachment): string {
  const pages = file.pageCount != null ? ` · ${file.pageCount}page` : "";
  return `${file.fileType}${pages}`;
}

function FileTypeIcon({ fileType }: { fileType: string }) {
  const isImage = /jpe?g|png|gif|webp|image/i.test(fileType);

  if (isImage) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5 18l4.5-4.5 3 3 3-3L19 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8.5 13h7M8.5 16h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function downloadAll(attachments: ReviewAttachment[]) {
  attachments.forEach((file) => {
    const a = document.createElement("a");
    a.href = file.url;
    a.download = file.name;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
}

export function AttachmentSection({ attachments }: AttachmentSectionProps) {
  const [selectedId, setSelectedId] = useState(attachments[0]?.id ?? null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const selected = attachments.find((file) => file.id === selectedId) ?? attachments[0];

  if (!attachments.length) {
    return (
      <div>
        <h2 className="font-serif text-[1.0625rem] font-bold text-ink">첨부 자료</h2>
        <p className="mt-3 text-[0.875rem] text-ink-3">첨부된 자료가 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-serif text-[1.0625rem] font-bold text-ink">
          첨부 자료 <span className="text-gold-ink">{attachments.length}건</span>
        </h2>
        <Button variant="outline" size="sm" onClick={() => downloadAll(attachments)}>
          전체 다운로드
        </Button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[200px_1fr]">
        <ul className="flex flex-col gap-2" aria-label="첨부 파일 목록">
          {attachments.map((file) => {
            const active = file.id === selected?.id;
            return (
              <li key={file.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedId(file.id)}
                  className={cn(
                    "w-full rounded-card border p-3 text-left transition",
                    active
                      ? "border-gold-2 bg-gold-soft"
                      : "border-line-2 bg-paper-2 hover:border-line",
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={cn(
                        "mt-0.5 shrink-0",
                        active ? "text-gold-ink" : "text-ink-3",
                      )}
                    >
                      <FileTypeIcon fileType={file.fileType} />
                    </span>
                    <div>
                      <p className="text-[0.875rem] font-semibold text-ink">{file.name}</p>
                      <p className="mt-0.5 text-[0.75rem] text-ink-3">{fileMeta(file)}</p>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {selected && (
          <div className="rounded-card border border-line-2 bg-paper-2 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[0.875rem] font-semibold text-ink">{selected.name}</p>
              {(selected.issuedBy || selected.issuedAt) && (
                <p className="text-[0.75rem] text-ink-3">
                  {[selected.issuedBy, selected.issuedAt].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>

            <div className="mt-3 grid gap-4 sm:grid-cols-[140px_1fr]">
              <div
                aria-hidden
                className="aspect-[3/4] rounded-card border border-line bg-card"
              />
              {selected.aiSummary && (
                <div>
                  <p className="text-[0.78125rem] font-semibold text-gold-ink">AI 추출 요약</p>
                  <p className="mt-1.5 text-[0.84375rem] leading-relaxed text-ink-2">
                    {selected.aiSummary}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewOpen(true)}
                iconLeft={
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
                    <path
                      d="M20 20l-3.2-3.2"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                }
              >
                원본 크게 보기
              </Button>
              <a
                href={selected.url}
                download={selected.name}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                다운로드
              </a>
            </div>
          </div>
        )}
      </div>

      {previewOpen && selected && (
        <PreviewModal file={selected} onClose={() => setPreviewOpen(false)} />
      )}
    </div>
  );
}
