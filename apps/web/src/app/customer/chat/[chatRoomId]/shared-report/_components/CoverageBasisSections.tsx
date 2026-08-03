import { cn } from "@/shared/lib/utils";
import { AlertTriangle } from "@/shared/ui/icons/AlertTriangle";
import { Check } from "@/shared/ui/icons/Check";
import { Scale } from "@/shared/ui/icons/Scale";

interface CoverageBlockProps {
  title: string;
  items: string[];
  icon: "check" | "warning" | "scale";
}

const BLOCK_ICON = {
  check: { Icon: Check, className: "bg-green-soft text-green" },
  warning: { Icon: AlertTriangle, className: "bg-terra-soft text-terra" },
  scale: { Icon: Scale, className: "bg-gold-soft text-gold-ink" },
};

function CoverageBlock({ title, items, icon }: CoverageBlockProps) {
  if (!items.length) return null;

  const { Icon, className } = BLOCK_ICON[icon];

  return (
    <section className="rounded-card border border-line bg-card p-[1.1875rem] lg:rounded-card-lg lg:p-6">
      <div className="flex items-center gap-2">
        <h2 className="text-[0.9rem] font-bold text-ink lg:text-[1.0625rem]">{title}</h2>
        <span className="text-[0.78rem] text-gold-ink">{items.length}건</span>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-[0.8125rem] leading-[1.375rem] text-ink-2"
          >
            <span
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-pill",
                className,
              )}
            >
              <Icon className="text-[0.8125rem]" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export interface CoverageBasisSectionsProps {
  applicableGuarantees: string[];
  omittedSpecialContract: string[];
  basisTermsPrecedents: string[];
}

export function CoverageBasisSections({
  applicableGuarantees,
  omittedSpecialContract,
  basisTermsPrecedents,
}: CoverageBasisSectionsProps) {
  return (
    <div className="space-y-[1.125rem] md:grid md:grid-cols-2 md:items-start md:gap-6 md:space-y-0">
      <CoverageBlock title="적용 가능 보장" items={applicableGuarantees} icon="check" />
      <CoverageBlock title="누락 가능 특약" items={omittedSpecialContract} icon="warning" />
      <CoverageBlock title="근거 약관·판례" items={basisTermsPrecedents} icon="scale" />
    </div>
  );
}
