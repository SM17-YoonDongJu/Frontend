import { StatusBadge, type StatusBadgeProps } from "@/shared/ui/StatusBadge";
import type { IssueItem, IssueStatus } from "../_model/types";

type Tone = NonNullable<StatusBadgeProps["tone"]>;

const ISSUE_STATUS_META: Record<IssueStatus, { label: string; tone: Tone }> = {
  CONFIRMED: { label: "확정", tone: "green" },
  TRUSTED: { label: "신뢰", tone: "gold" },
  INFO: { label: "안내", tone: "neutral" },
};

export interface IssueReviewProps {
  issues: IssueItem[];
}

export function IssueReview({ issues }: IssueReviewProps) {
  if (!issues.length) return null;

  return (
    <section className="rounded-card-lg border border-line bg-card p-6">
      <h2 className="text-[17px] font-semibold text-ink">검토 의견 및 보완 사항</h2>
      <ol className="mt-4 space-y-3">
        {issues.map((issue, i) => {
          const meta = ISSUE_STATUS_META[issue.status];
          return (
            <li key={i} className="rounded-card border border-line-2 bg-paper-2 p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-ink text-[12px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <h3 className="text-[15px] font-semibold text-ink">{issue.title}</h3>
                </div>
                <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{issue.opinion}</p>
              {issue.tag && (
                <span className="mt-3 inline-block rounded-tag bg-card px-2 py-1 text-[12px] text-ink-3">
                  {issue.tag}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
