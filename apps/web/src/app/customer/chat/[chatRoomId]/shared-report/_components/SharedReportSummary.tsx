export interface SharedReportSummaryProps {
  summary: string | null;
}

export function SharedReportSummary({ summary }: SharedReportSummaryProps) {
  if (!summary) return null;

  return (
    <section className="rounded-card border border-line bg-card p-[1.1875rem] lg:rounded-card-lg lg:p-6">
      <h2 className="text-[0.9rem] font-bold text-ink lg:text-[1.0625rem]">사정사 종합 의견</h2>
      <p className="mt-2.5 whitespace-pre-line text-[0.8125rem] leading-[1.5rem] text-ink-2 lg:text-[0.875rem]">
        {summary}
      </p>
    </section>
  );
}
