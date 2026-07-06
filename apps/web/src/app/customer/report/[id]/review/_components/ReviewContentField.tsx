"use client";

import { Textarea } from "@/shared/ui/Textarea";
import { User } from "@/shared/ui/icons/User";
import { MAX_REVIEW_CONTENT_LENGTH } from "../_hooks/use-review-form";

export function ReviewContentField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <section className="rounded-card border border-line bg-card p-[1.625rem]">
      <h2 className="text-[1.0625rem] font-bold text-ink">
        자세한 후기 <span className="text-[0.8125rem] font-medium text-ink-3">(선택)</span>
      </h2>
      <p className="mt-1 text-[0.8125rem] text-ink-3">진행 과정, 결과, 소통 경험 등을 자유롭게 남겨주세요.</p>
      <Textarea
        value={value}
        onChange={onChange}
        maxLength={MAX_REVIEW_CONTENT_LENGTH}
        rows={5}
        aria-label="자세한 후기"
        counterHint=" · 개인정보(연락처 등)는 적지 말아 주세요"
        footerRight={
          <span className="flex items-center gap-1 text-[0.8125rem] text-ink-2">
            <User className="size-3.5" />
            닉네임으로 익명 공개
          </span>
        }
        className="mt-4"
      />
    </section>
  );
}
