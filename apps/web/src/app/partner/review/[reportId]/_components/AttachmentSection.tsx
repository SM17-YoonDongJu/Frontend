"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/Button";
import type { ReviewAttachment } from "../_model/types";

export interface AttachmentSectionProps {
  attachments: ReviewAttachment[];
}

function fileMeta(file: ReviewAttachment): string {
  const pages = file.pageCount != null ? ` · ${file.pageCount}page` : "";
  return `${file.fileType}${pages}`;
}

export function AttachmentSection({ attachments }: AttachmentSectionProps) {
  const [selectedId, setSelectedId] = useState(attachments[0]?.id ?? null);
  const selected = attachments.find((file) => file.id === selectedId) ?? attachments[0];

  if (!attachments.length) {
    return (
      <section className="rounded-card-lg border border-line bg-card p-6">
        <h2 className="font-serif text-[17px] font-bold text-ink">첨부 자료</h2>
        <p className="mt-3 text-[14px] text-ink-3">첨부된 자료가 없습니다.</p>
      </section>
    );
  }

  return (
    <section className="rounded-card-lg border border-line bg-card p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-serif text-[17px] font-bold text-ink">
          첨부 자료 <span className="text-gold-ink">{attachments.length}건</span>
        </h2>
        <Button variant="outline" size="sm">
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
                  <p className="text-[14px] font-semibold text-ink">{file.name}</p>
                  <p className="mt-0.5 text-[12px] text-ink-3">{fileMeta(file)}</p>
                </button>
              </li>
            );
          })}
        </ul>

        {selected && (
          <div className="rounded-card border border-line-2 bg-paper-2 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[14px] font-semibold text-ink">{selected.name}</p>
              {(selected.issuedBy || selected.issuedAt) && (
                <p className="text-[12px] text-ink-3">
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
                  <p className="text-[12.5px] font-semibold text-gold-ink">AI 추출 요약</p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">
                    {selected.aiSummary}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm">
                원본 크게 보기
              </Button>
              <Button variant="outline" size="sm">
                다운로드
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
