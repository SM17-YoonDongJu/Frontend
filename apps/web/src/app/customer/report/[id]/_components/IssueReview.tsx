"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { ChevronDown } from "@/shared/ui/icons/ChevronDown";
import { StatusBadge, type StatusBadgeProps } from "@/shared/ui/StatusBadge";
import type { IssueItem, IssueStatus } from "../_model/types";

type Tone = NonNullable<StatusBadgeProps["tone"]>;

const ISSUE_STATUS_META: Record<IssueStatus, { label: string; tone: Tone }> = {
  CONFIRMED: { label: "확정", tone: "green" },
  TRUSTED: { label: "신뢰", tone: "gold" },
  INFO: { label: "안내", tone: "neutral" },
};

function issueTags(issue: IssueItem): string[] {
  if (issue.tags?.length) return issue.tags;
  return issue.tag ? [issue.tag] : [];
}

export interface IssueReviewProps {
  issues: IssueItem[];
}

export function IssueReview({ issues }: IssueReviewProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!issues.length) return null;

  return (
    <section className="rounded-card border border-line bg-card p-[1.1875rem] drop-shadow-[0_1px_1px_rgba(21,32,46,0.03)] lg:rounded-card-lg lg:p-6">
      <div className="flex items-center gap-2">
        <h2 className="text-[0.9rem] font-bold text-ink lg:text-[1.0625rem]">검토가 필요한 쟁점</h2>
        <span className="text-[0.78rem] text-gold-ink">{issues.length}건</span>
      </div>

      <ol className="mt-4 space-y-4 lg:space-y-3">
        {issues.map((issue, i) => {
          const meta = ISSUE_STATUS_META[issue.status];
          const tags = issueTags(issue);
          const isOpen = openIndex === i;
          const canToggle = tags.length > 0;

          return (
            <li
              key={i}
              className={cn(
                "pt-4 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-line-2",
                "first:pt-0 lg:mt-3 lg:rounded-card lg:border lg:border-line-2 lg:bg-paper-2 lg:p-4 lg:pt-4 lg:first:mt-0",
              )}
            >
              <button
                type="button"
                onClick={() => canToggle && setOpenIndex(isOpen ? null : i)}
                aria-expanded={canToggle ? isOpen : undefined}
                className="flex w-full items-start gap-2.5 text-left"
              >
                <span className="flex size-[1.625rem] shrink-0 items-center justify-center rounded-[0.5rem] bg-gold-soft font-serif text-[0.9375rem] font-bold text-gold-ink lg:rounded-full lg:bg-ink lg:font-sans lg:text-[0.75rem] lg:font-semibold lg:text-white">
                  {i + 1}
                </span>
                <span className="flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-[0.89rem] font-bold text-ink">{issue.title}</span>
                    {issue.impactAmount != null && (
                      <span className="shrink-0 font-serif text-[0.9rem] font-bold text-gold-ink">
                        + 약 {issue.impactAmount.toLocaleString("ko-KR")}만
                      </span>
                    )}
                  </span>
                </span>
                <StatusBadge tone={meta.tone} className="hidden lg:inline-flex">
                  {meta.label}
                </StatusBadge>
                {canToggle && (
                  <ChevronDown
                    className={cn(
                      "mt-0.5 shrink-0 text-[1.125rem] text-ink-3 transition-transform lg:hidden",
                      isOpen && "rotate-180",
                    )}
                  />
                )}
              </button>

              <p className="mt-2 pl-[2.125rem] text-[0.75rem] leading-[1.26rem] text-ink-2 lg:pl-0 lg:text-[0.875rem] lg:leading-relaxed">
                {issue.opinion}
              </p>

              {tags.length > 0 && (
                <div
                  className={cn(
                    "mt-3 flex-wrap gap-1.5 pl-[2.125rem] lg:flex lg:pl-0",
                    isOpen ? "flex" : "hidden",
                  )}
                >
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-tag border border-line bg-paper-2 px-2 py-1 text-[0.75rem] font-medium text-ink-3"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
