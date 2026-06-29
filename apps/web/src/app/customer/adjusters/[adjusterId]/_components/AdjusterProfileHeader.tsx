import Link from "next/link";
import { StarRating } from "@/shared/ui/StarRating";
import { StatusBadge } from "@/shared/ui/StatusBadge";

interface AdjusterProfileHeaderProps {
  nickname: string;
  avatarUrl: string | null;
  career: number;
  specialties: string[];
  verified: boolean;
  averageRating: number;
  reviewCount: number;
  completedConsultCount: number;
  handledCaseCount: number;
}

const numberFormatter = new Intl.NumberFormat("ko-KR");

export function AdjusterProfileHeader({
  nickname,
  avatarUrl,
  career,
  specialties,
  verified,
  averageRating,
  reviewCount,
  completedConsultCount,
  handledCaseCount,
}: AdjusterProfileHeaderProps) {
  const subtitle = [`경력 ${career}년`, ...specialties.slice(0, 2)].join(" · ") + " 전문";

  return (
    <header className="border-b border-line bg-card">
      <div className="mx-auto w-full max-w-[1100px] px-4 py-9">
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-ink-3">
          <Link href="/customer/proposals" className="transition hover:text-ink">
            손해사정사
          </Link>
          <span aria-hidden>›</span>
          <span className="text-ink-2">{nickname} 손해사정사</span>
        </nav>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-7">
          <span
            aria-hidden
            className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy text-3xl font-semibold text-white"
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" className="size-full object-cover" />
            ) : (
              nickname.trim().charAt(0) || "?"
            )}
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold text-ink">{nickname} 손해사정사</h1>
              {verified && (
                <StatusBadge
                  tone="green"
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  }
                >
                  자격 인증
                </StatusBadge>
              )}
            </div>
            <p className="mt-2 text-sm text-ink-2">{subtitle}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {specialties.map((tag) => (
                <li
                  key={tag}
                  className="rounded-tag bg-gold-soft px-2.5 py-1 text-xs font-medium text-gold-ink"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:divide-x sm:divide-line">
          <Stat
            label="평점"
            value={
              <span className="flex items-center gap-1.5">
                <StarRating score={averageRating} max={1} size={1.25} />
                {averageRating.toFixed(1)}
              </span>
            }
            caption={`후기 ${numberFormatter.format(reviewCount)}건`}
          />
          <Stat
            label="상담 완료"
            value={`${numberFormatter.format(completedConsultCount)}+`}
            caption="누적 의뢰"
            inset
          />
          <Stat
            label="처리 사건"
            value={`${numberFormatter.format(handledCaseCount)}건`}
            caption="누적 처리"
            inset
          />
        </dl>
      </div>
    </header>
  );
}

function Stat({
  label,
  value,
  caption,
  inset,
}: {
  label: string;
  value: React.ReactNode;
  caption: string;
  inset?: boolean;
}) {
  return (
    <div className={inset ? "sm:pl-6" : undefined}>
      <dt className="text-xs text-ink-3">{label}</dt>
      <dd className="mt-1 text-3xl font-semibold text-ink">{value}</dd>
      <p className="mt-1 text-xs text-ink-3">{caption}</p>
    </div>
  );
}
