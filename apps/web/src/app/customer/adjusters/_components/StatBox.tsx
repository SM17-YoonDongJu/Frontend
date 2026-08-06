export function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-input border border-line bg-paper-2 py-3 text-center">
      <dt className="sr-only">{label}</dt>
      <dd className="font-serif text-xl font-semibold text-ink">{value}</dd>
      <p className="mt-0.5 text-xs text-ink-3">{label}</p>
    </div>
  );
}
