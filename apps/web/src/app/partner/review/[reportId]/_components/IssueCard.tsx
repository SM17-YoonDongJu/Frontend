"use client";

import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/Input";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { Scale } from "@/shared/ui/icons/Scale";
import type { ReviewIssue, ReviewIssueStatus } from "../_model/types";
import { IssueStatusControl } from "./IssueStatusControl";
import { IssueModifyForm } from "./IssueModifyForm";
import { IssueExcludeForm } from "./IssueExcludeForm";

function formatImpact(won: number | null): string | null {
  if (won == null || won === 0) return null;
  const manwon = Math.round(won / 10_000).toLocaleString("ko-KR");
  return won > 0 ? `+약 ${manwon}만` : `-약 ${Math.abs(Number(manwon.replace(/,/g, ""))).toLocaleString("ko-KR")}만`;
}

export interface IssueCardProps {
  issue: ReviewIssue;
  index: number;
  onSetStatus: (status: ReviewIssueStatus) => void;
  onPatch: (patch: Partial<ReviewIssue>) => void;
  onRemove: () => void;
}

export function IssueCard({ issue, index, onSetStatus, onPatch, onRemove }: IssueCardProps) {
  const impact = formatImpact(issue.impactAmount);
  const impactTone =
    issue.impactAmount != null && issue.impactAmount < 0 ? "text-terra" : "text-green";
  const isPending = issue.reviewStatus === "PENDING";
  const isModified = issue.reviewStatus === "MODIFIED";

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
              <h3 className="text-[0.9375rem] font-semibold text-ink">{issue.title}</h3>
              {impact && (
                <span className={cn("text-[0.8125rem] font-semibold", impactTone)}>{impact}</span>
              )}
              {issue.isNew && <StatusBadge tone="gold">신규</StatusBadge>}
            </div>
          </div>
        </div>
        <IssueStatusControl value={issue.reviewStatus} onChange={onSetStatus} />
      </div>

      {!isModified && (
        <p className="mt-2.5 pl-[2.125rem] text-[0.84375rem] leading-relaxed text-ink-2">
          {issue.description}
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
        {isModified && <IssueModifyForm issue={issue} onPatch={onPatch} />}
        {issue.reviewStatus === "EXCLUDED" && <IssueExcludeForm issue={issue} onPatch={onPatch} />}

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

        {issue.isNew && (
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
