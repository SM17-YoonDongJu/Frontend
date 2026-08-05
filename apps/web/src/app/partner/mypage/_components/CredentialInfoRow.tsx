export function CredentialInfoRow({
  label,
  value,
  action,
}: {
  label: string;
  value: string;
  action?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 py-3">
      <dt className="w-18 shrink-0 text-[0.8125rem] text-ink-3">{label}</dt>
      <dd className="min-w-0 flex-1 truncate text-[0.875rem] font-semibold text-ink">{value}</dd>
      {action && (
        <button type="button" className="shrink-0 text-[0.8125rem] font-semibold text-gold-ink">
          보기
        </button>
      )}
    </div>
  );
}
