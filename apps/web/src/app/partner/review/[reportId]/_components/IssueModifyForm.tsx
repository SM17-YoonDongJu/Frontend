"use client";

import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import type { ReviewIssue } from "../_model/types";
import type { DraftIssue } from "../_hooks/use-review-draft";

const MANWON = 10_000;

function toManwonValue(won: number | null): string {
  return won != null ? String(Math.round(won / MANWON)) : "";
}

function parseManwon(text: string): number | null {
  const digits = text.replace(/[^\d-]/g, "");
  return digits && digits !== "-" ? Number(digits) * MANWON : null;
}

export interface IssueModifyFormProps {
  issue: DraftIssue;
  onPatch: (patch: Partial<ReviewIssue>) => void;
}

export function IssueModifyForm({ issue, onPatch }: IssueModifyFormProps) {
  return (
    <div className="mt-3 space-y-3 rounded-card border border-gold-2 bg-gold-soft/40 p-4">
      <p className="text-[0.78125rem] font-semibold text-gold-ink">AI 초안 수정 중 — 제목·금액·설명을 고치세요</p>

      <div className="grid gap-3 sm:grid-cols-[1fr_10rem]">
        <div>
          <Label htmlFor={`modify-title-${issue.key}`}>쟁점 제목</Label>
          <Input
            id={`modify-title-${issue.key}`}
            className="mt-1.5"
            value={issue.modifiedTitle ?? issue.aiTitle ?? ""}
            onChange={(e) => onPatch({ modifiedTitle: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor={`modify-amount-${issue.key}`}>영향 금액</Label>
          <Input
            id={`modify-amount-${issue.key}`}
            type="number"
            inputMode="numeric"
            className="mt-1.5"
            suffix="만원"
            value={toManwonValue(issue.modifiedImpactAmount ?? issue.impactAmount)}
            onChange={(e) => onPatch({ modifiedImpactAmount: parseManwon(e.target.value) })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor={`modify-reason-${issue.key}`}>수정 사유</Label>
        <Input
          id={`modify-reason-${issue.key}`}
          multiline
          rows={2}
          className="mt-1.5"
          placeholder="수정한 근거와 판단을 적어주세요."
          value={issue.modifiedReason ?? ""}
          onChange={(e) => onPatch({ modifiedReason: e.target.value })}
        />
      </div>
    </div>
  );
}
