export interface IssueReviewProps {
  issues: string[];
}

export function IssueReview({ issues }: IssueReviewProps) {
  if (!issues.length) return null;

  return (
    <section className="rounded-card-lg border border-line bg-card p-6">
      <h2 className="text-[17px] font-semibold text-ink">검토 의견 및 보완 사항</h2>
      <ol className="mt-4 space-y-3">
        {issues.map((issue, i) => (
          <li
            key={i}
            className="flex gap-3 rounded-card border border-line-2 bg-paper-2 p-4"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-ink text-[12px] font-semibold text-white">
              {i + 1}
            </span>
            <p className="text-[14px] leading-relaxed text-ink-2">{issue}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
