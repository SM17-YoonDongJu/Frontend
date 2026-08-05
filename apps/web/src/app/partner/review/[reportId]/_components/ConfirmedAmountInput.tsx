interface ConfirmedAmountInputProps {
  label: string;
  value: string;
  onValueChange: (text: string) => void;
}

export function ConfirmedAmountInput({ label, value, onValueChange }: ConfirmedAmountInputProps) {
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
