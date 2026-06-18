export interface CoverageApplicableProps {
  guarantees: string[];
}

export function CoverageApplicable({ guarantees }: CoverageApplicableProps) {
  if (!guarantees.length) return null;

  return (
    <section className="rounded-card-lg border border-line bg-card p-6">
      <div className="flex items-center gap-2">
        <h2 className="text-[17px] font-semibold text-ink">적용 가능 보장</h2>
        <span className="text-[13px] text-ink-3">{guarantees.length}건</span>
      </div>
      <ul className="mt-4 space-y-2">
        {guarantees.map((guarantee, i) => (
          <li key={i} className="flex items-center gap-2 text-[14px] text-ink-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 text-green" aria-hidden>
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {guarantee}
          </li>
        ))}
      </ul>
    </section>
  );
}
