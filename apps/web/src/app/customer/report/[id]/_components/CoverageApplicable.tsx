import { Check } from "@/shared/ui/icons/Check";

export interface CoverageApplicableProps {
  guarantees: string[];
}

export function CoverageApplicable({ guarantees }: CoverageApplicableProps) {
  if (!guarantees.length) return null;

  return (
    <section className="rounded-card border border-line bg-card p-[1.1875rem] lg:rounded-card-lg lg:p-6">
      <div className="flex items-center gap-2">
        <h2 className="text-[0.9rem] font-bold text-ink lg:text-[1.0625rem] lg:font-semibold">
          적용 가능 보장 항목
        </h2>
        <span className="text-[0.78rem] text-gold-ink">{guarantees.length}건</span>
      </div>
      <ul className="mt-2 lg:mt-4 lg:space-y-2">
        {guarantees.map((guarantee, i) => (
          <li
            key={i}
            className="flex items-center gap-3 py-[0.6875rem] text-[0.79rem] font-medium text-ink-2 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-line-2 lg:gap-2 lg:border-none lg:py-0 lg:text-[0.875rem] lg:font-normal"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-pill bg-green-soft text-green lg:size-4 lg:rounded-none lg:bg-transparent">
              <Check className="text-[0.9375rem] lg:text-[1rem]" />
            </span>
            {guarantee}
          </li>
        ))}
      </ul>
    </section>
  );
}
