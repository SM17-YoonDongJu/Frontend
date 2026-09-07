import { formatManwon } from "@/shared/lib/format-amount";
import { StatusBadge, type StatusBadgeProps } from "@/shared/ui/StatusBadge";
import type {
  SharedIssueReviewStatus,
  SharedReportIssue,
} from "../_model/shared-report.schema";

type Tone = NonNullable<StatusBadgeProps["tone"]>;

const ISSUE_REVIEW_STATUS_META: Record<
  SharedIssueReviewStatus,
  { label: string; tone: Tone }
> = {
  ACCEPTED: { label: "인정", tone: "green" },
  MODIFIED: { label: "수정", tone: "gold" },
  ADDED: { label: "사정사 추가", tone: "navy" },
  // 명세에 없는 판정 — 단정하지 않고 중립 배지로 보여준다.
  UNKNOWN: { label: "확인 필요", tone: "neutral" },
};

function formatImpact(won: number | null): string | null {
  if (won == null || won === 0) return null;
  const manwon = formatManwon(Math.abs(won));
  return won > 0 ? `+ 약 ${manwon}만원` : `- 약 ${manwon}만원`;
}

export function SharedIssueCard({ issue }: { issue: SharedReportIssue }) {
  const meta = ISSUE_REVIEW_STATUS_META[issue.reviewStatus];
  const impact = formatImpact(issue.impactAmount);

  return (
    <li className="rounded-card border border-line-2 bg-paper-2 p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[0.89rem] font-bold text-ink">{issue.title}</h3>
        <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>
      </div>

      {impact && (
        <p className="mt-1.5 font-serif text-[0.9rem] font-bold text-gold-ink">{impact}</p>
      )}

      <p className="mt-2.5 whitespace-pre-line text-[0.8125rem] leading-[1.375rem] text-ink-2">
        <span className="font-semibold text-ink">사정사 의견 </span>
        {issue.adjusterOpinion}
      </p>

      {issue.description && (
        <p className="mt-2 whitespace-pre-line text-[0.78rem] leading-[1.3125rem] text-ink-3">
          {issue.description}
        </p>
      )}

      {issue.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {issue.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-tag border border-line bg-card px-2 py-1 text-[0.75rem] font-medium text-ink-3"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </li>
  );
}
