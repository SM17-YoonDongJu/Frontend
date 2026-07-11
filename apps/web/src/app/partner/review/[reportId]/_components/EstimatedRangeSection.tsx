"use client";

import { AmountRange } from "@/shared/ui/AmountRange";
import { Label } from "@/shared/ui/Label";

const MANWON = 10_000;

function toManwonValue(won: number | null): string {
  return won != null ? String(Math.round(won / MANWON)) : "";
}

function parseManwon(text: string): number | null {
  const digits = text.replace(/[^\d]/g, "");
  return digits ? Number(digits) * MANWON : null;
}

interface ConfirmedAmountInputProps {
  label: string;
  value: string;
  onValueChange: (text: string) => void;
}

function ConfirmedAmountInput({ label, value, onValueChange }: ConfirmedAmountInputProps) {
  return (
    <div className="relative flex flex-1 items-center">
      <input
        type="number"
        inputMode="numeric"
        aria-label={label}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="h-[2.625rem] w-full rounded-input border border-white/20 bg-ink pl-3 pr-12 text-[0.9375rem] font-semibold text-white outline-none transition placeholder:text-white/40 focus:border-gold-2 focus:ring-[3px] focus:ring-gold/30"
      />
      <span className="pointer-events-none absolute right-3 text-[0.75rem] text-white/60">만원</span>
    </div>
  );
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
      <h2 className="font-serif text-[1.0625rem] font-bold text-ink">예상 보상 범위</h2>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-card border border-line-2 bg-paper-2 p-4">
          <Label kicker>AI 추정</Label>
          <p className="mt-2">
            <AmountRange min={aiMin} max={aiMax} size="lg" />
          </p>
        </div>

        <div className="rounded-card border border-navy bg-navy p-4">
          <p className="text-[0.78125rem] font-semibold uppercase tracking-[0.12em] text-gold-2">
            사정사 확정 (직접 입력)
          </p>
          <div className="mt-2 flex items-center gap-2">
            <ConfirmedAmountInput
              label="확정 보상 최소 금액(만원)"
              value={toManwonValue(confirmedMin)}
              onValueChange={(text) => onChangeRange(parseManwon(text), confirmedMax)}
            />
            <span className="text-white">~</span>
            <ConfirmedAmountInput
              label="확정 보상 최대 금액(만원)"
              value={toManwonValue(confirmedMax)}
              onValueChange={(text) => onChangeRange(confirmedMin, parseManwon(text))}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
