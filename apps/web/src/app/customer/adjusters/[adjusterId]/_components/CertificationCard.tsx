import type { Certification } from "../_model/types";

interface CertificationCardProps {
  certification: Certification;
  activityRegion: string;
  verified: boolean;
}

function formatVerifiedAt(iso: string | null) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}.${month}`;
}

export function CertificationCard({
  certification,
  activityRegion,
  verified,
}: CertificationCardProps) {
  const verifiedAt = formatVerifiedAt(certification.verifiedAt);
  const verifiedLabel = verified
    ? verifiedAt
      ? `완료 · ${verifiedAt}`
      : "완료"
    : "미인증";

  const rows = [
    { label: "등록번호", value: certification.registrationNo },
    { label: "자격 검증", value: verifiedLabel },
    { label: "활동 지역", value: activityRegion },
  ];

  return (
    <section className="rounded-card-lg border border-line bg-card p-6">
      <div className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="text-gold" aria-hidden>
          <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
        <h2 className="text-base font-semibold text-ink">인증 정보</h2>
      </div>

      <dl className="mt-4 divide-y divide-line">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-3 first:pt-0">
            <dt className="text-sm text-ink-3">{row.label}</dt>
            <dd className="text-sm font-semibold text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
