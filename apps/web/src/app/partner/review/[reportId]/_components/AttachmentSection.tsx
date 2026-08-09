"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Button, buttonVariants } from "@/shared/ui/Button";
import { Search } from "@/shared/ui/icons/Search";
import type { ReviewAttachment } from "../_model/types";
import { AttachmentPreviewModal } from "./AttachmentPreviewModal";
import { FileTypeIcon } from "./FileTypeIcon";

/** "application/pdf" → "PDF", "image/jpeg" → "JPG". */
function mimeLabel(mimeType: string): string {
  const subtype = mimeType.split("/")[1] ?? mimeType;
  if (/jpe?g/i.test(subtype)) return "JPG";
  return subtype.toUpperCase();
}

export interface AttachmentSectionProps {
  attachments: ReviewAttachment[];
}

function fileMeta(file: ReviewAttachment): string {
  const pages = file.pageCount != null ? ` · ${file.pageCount}page` : "";
  return `${mimeLabel(file.mimeType)}${pages}`;
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
  const [selectedId, setSelectedId] = useState(attachments[0]?.attachmentId ?? null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const selected =
    attachments.find((file) => file.attachmentId === selectedId) ?? attachments[0];

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

      <div className="mt-4 grid gap-4 md:grid-cols-[12.5rem_1fr]">
        <ul className="flex flex-col gap-2" aria-label="첨부 파일 목록">
          {attachments.map((file) => {
            const active = file.attachmentId === selected?.attachmentId;
            return (
              <li key={file.attachmentId}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedId(file.attachmentId)}
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
                      <FileTypeIcon mimeType={file.mimeType} />
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

            <div className="mt-3 grid gap-4 sm:grid-cols-[8.75rem_1fr]">
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
                iconLeft={<Search className="size-[0.9375rem]" />}
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
        <AttachmentPreviewModal file={selected} onClose={() => setPreviewOpen(false)} />
      )}
    </div>
  );
}
