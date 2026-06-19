import { StatusBadge } from "@/shared/ui/StatusBadge";

export interface CoveragePotentialMissingProps {
  contracts: string[];
}

export function CoveragePotentialMissing({ contracts }: CoveragePotentialMissingProps) {
  if (!contracts.length) return null;

  return (
    <section className="rounded-card-lg border border-line bg-card p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[17px] font-semibold text-ink">누락 가능 특약</h2>
        <StatusBadge tone="terra">{contracts.length}건</StatusBadge>
      </div>
      <ul className="mt-4 space-y-2">
        {contracts.map((contract, i) => (
          <li key={i} className="flex items-start gap-2 text-[14px] text-ink-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-terra" aria-hidden>
              <path d="M12 9v4m0 4h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {contract}
          </li>
        ))}
      </ul>
    </section>
  );
}
