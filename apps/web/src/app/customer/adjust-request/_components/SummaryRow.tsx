export function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-2.5 last:border-0">
      <span className="text-[0.8125rem] text-ink-3">{label}</span>
      <span className="text-right text-[0.875rem] font-medium text-ink">{value}</span>
    </div>
  );
}
