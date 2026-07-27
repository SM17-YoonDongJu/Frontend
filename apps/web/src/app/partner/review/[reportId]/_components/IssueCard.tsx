"use client";

import { cn } from "@/shared/lib/utils";
import { formatManwon } from "@/shared/lib/format-amount";
import { Input } from "@/shared/ui/Input";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { Scale } from "@/shared/ui/icons/Scale";
import type { ReviewIssue, IssueReviewStatus } from "../_model/types";
import type { DraftIssue } from "../_hooks/use-review-draft";
import { IssueStatusControl } from "./IssueStatusControl";
import { IssueModifyForm } from "./IssueModifyForm";
import { IssueExcludeForm } from "./IssueExcludeForm";

function formatImpact(won: number | null): string | null {
  if (won == null || won === 0) return null;
  const manwon = formatManwon(Math.abs(won));
  return won > 0 ? `+약 ${manwon}만` : `-약 ${manwon}만`;
}

export interface IssueCardProps {
  issue: DraftIssue;
  index: number;
  onSetStatus: (status: IssueReviewStatus) => void;
  onPatch: (patch: Partial<ReviewIssue>) => void;
  onRemove: () => void;
}

export function IssueCard({ issue, index, onSetStatus, onPatch, onRemove }: IssueCardProps) {
  const isNew = issue.issueId === null;
  const status = issue.reviewStatus;
  const isModified = status === "MODIFIED";
  const isExcluded = status === "EXCLUDED";
  const isPending = status === null;

  const title = issue.modifiedTitle ?? issue.aiTitle ?? "";
  const description = issue.aiDescription ?? issue.modifiedDescription ?? "";
  const impactValue = issue.modifiedImpactAmount ?? issue.impactAmount;
  const impact = formatImpact(impactValue);
  const impactTone = impactValue != null && impactValue < 0 ? "text-terra" : "text-green";

  return (
    <li
      className={cn(
        "rounded-card border p-4 transition",
        isModified ? "border-gold-2 bg-gold-soft/20" : "border-line-2 bg-paper-2",
        isPending && "opacity-90",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-ink text-[0.75rem] font-semibold text-white">
            {index + 1}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[0.9375rem] font-semibold text-ink">{title}</h3>
              {impact && (
                <span className={cn("text-[0.8125rem] font-semibold", impactTone)}>{impact}</span>
              )}
              {isNew && <StatusBadge tone="gold">신규</StatusBadge>}
            </div>
          </div>
        </div>
        {!isNew && <IssueStatusControl value={status} onChange={onSetStatus} />}
      </div>

      {!isModified && description && (
        <p className="mt-2.5 pl-[2.125rem] text-[0.84375rem] leading-relaxed text-ink-2">
          {description}
        </p>
      )}

      {issue.tags.length > 0 && (
        <ul className="mt-2.5 flex flex-wrap gap-1.5 pl-[2.125rem]">
          {issue.tags.map((tag) => (
            <li key={tag}>
              <span className="inline-flex items-center rounded-tag border border-line bg-card px-2 py-1 text-[0.75rem] text-ink-3">
                {tag}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 pl-[2.125rem]">
        {!isNew && isModified && <IssueModifyForm issue={issue} onPatch={onPatch} />}
        {!isNew && isExcluded && <IssueExcludeForm issue={issue} onPatch={onPatch} />}

        <div className="mt-3 flex items-start gap-2">
          <span
            aria-hidden
            className="mt-1.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-navy text-gold"
          >
            <Scale className="text-[0.8125rem]" />
          </span>
          <Input
            aria-label="사정사 의견"
            multiline
            rows={2}
            className="flex-1"
            placeholder="사정사 의견을 입력하세요..."
            value={issue.adjusterOpinion ?? ""}
            onChange={(e) => onPatch({ adjusterOpinion: e.target.value })}
          />
        </div>

        {isNew && (
          <button
            type="button"
            onClick={onRemove}
            className="mt-2 text-[0.78125rem] font-medium text-terra hover:underline"
          >
            쟁점 삭제
          </button>
        )}
      </div>
    </li>
  );
}
