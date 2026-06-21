"use client";

import { AmountRange } from "@/shared/ui/AmountRange";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";

const MANWON = 10_000;

function toManwonValue(won: number | null): string {
  return won != null ? String(Math.round(won / MANWON)) : "";
}

function parseManwon(text: string): number | null {
  const digits = text.replace(/[^\d]/g, "");
  return digits ? Number(digits) * MANWON : null;
}

export interface EstimatedRangeSectionProps {
  aiMin: number;
  aiMax: number;
  confirmedMin: number | null;
  confirmedMax: number | null;
  onChangeRange: (min: number | null, max: number | null) => void;
}

export function EstimatedRangeSection({
  aiMin,
  aiMax,
  confirmedMin,
  confirmedMax,
  onChangeRange,
}: EstimatedRangeSectionProps) {
  return (
    <section className="rounded-card-lg border border-line bg-card p-6">
      <h2 className="font-serif text-[17px] font-bold text-ink">예상 보상 범위</h2>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-card border border-line-2 bg-paper-2 p-4">
          <Label kicker>AI 추정</Label>
          <p className="mt-2">
            <AmountRange min={aiMin} max={aiMax} size="lg" />
          </p>
        </div>

        <div className="rounded-card border border-navy bg-navy p-4">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-gold-2">
            사정사 확정 (직접 입력)
          </p>
          <div className="mt-2 flex items-end gap-2">
            <Input
              type="number"
              inputMode="numeric"
              aria-label="확정 보상 최소 금액(만원)"
              suffix="만원"
              value={toManwonValue(confirmedMin)}
              onChange={(e) => onChangeRange(parseManwon(e.target.value), confirmedMax)}
            />
            <span className="pb-3 text-white">~</span>
            <Input
              type="number"
              inputMode="numeric"
              aria-label="확정 보상 최대 금액(만원)"
              suffix="만원"
              value={toManwonValue(confirmedMax)}
              onChange={(e) => onChangeRange(confirmedMin, parseManwon(e.target.value))}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
