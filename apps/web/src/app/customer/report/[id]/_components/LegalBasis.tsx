export interface LegalBasisProps {
  items: string[];
}

export function LegalBasis({ items }: LegalBasisProps) {
  if (!items.length) return null;

  return (
    <section className="rounded-card-lg border border-line bg-paper-2 p-6">
      <h2 className="text-[15px] font-semibold text-ink-2">근거 약관·판례</h2>
      <ul className="mt-3 space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-[13px] leading-relaxed text-ink-3">
            ※ {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
