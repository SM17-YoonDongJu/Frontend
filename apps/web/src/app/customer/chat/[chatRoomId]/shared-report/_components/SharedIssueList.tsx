import type { SharedReportIssue } from "../_model/shared-report.schema";
import { SharedIssueCard } from "./SharedIssueCard";

export interface SharedIssueListProps {
  issues: SharedReportIssue[];
}

export function SharedIssueList({ issues }: SharedIssueListProps) {
  return (
    <section className="rounded-card border border-line bg-card p-[1.1875rem] lg:rounded-card-lg lg:p-6">
      <div className="flex items-center gap-2">
        <h2 className="text-[0.9rem] font-bold text-ink lg:text-[1.0625rem]">주요 쟁점</h2>
        <span className="text-[0.78rem] text-gold-ink">{issues.length}건</span>
      </div>

      {issues.length > 0 && (
        <ul className="mt-4 space-y-3">
          {issues.map((issue) => (
            <SharedIssueCard key={issue.reviewIssueId} issue={issue} />
          ))}
        </ul>
      )}
    </section>
  );
}
