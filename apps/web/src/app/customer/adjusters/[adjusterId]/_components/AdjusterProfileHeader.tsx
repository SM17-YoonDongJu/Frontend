import { Avatar } from "@/shared/ui/Avatar";
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
    <header className="lg:border-b lg:border-line lg:bg-card">
      <div className="mx-auto w-full max-w-[68.75rem] px-5 pb-6 pt-2 lg:px-4 lg:py-9">
        <nav className="mb-6 hidden items-center gap-1.5 text-xs text-ink-3 lg:flex">
          <span>손해사정사</span>
          <span aria-hidden>›</span>
          <span className="text-ink-2">{nickname} 손해사정사</span>
        </nav>

        <div className="flex flex-col items-center gap-2 text-center lg:flex-row lg:items-center lg:gap-7 lg:text-left">
          <Avatar
            src={avatarUrl}
            name={nickname}
            className="text-[5.25rem] font-sans font-semibold [--avatar-initial:0.357em] lg:text-[6rem]"
          />

          <div className="flex min-w-0 flex-col items-center lg:items-start">
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1.5 lg:justify-start lg:gap-3 lg:pt-0">
              <h1 className="font-serif text-2xl font-bold text-ink lg:font-sans lg:text-3xl lg:font-semibold">
                {nickname} 손해사정사
              </h1>
              {verified && (
                <StatusBadge
                  tone="green"
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  }
                >
                  <span className="lg:hidden">인증</span>
                  <span className="hidden lg:inline">자격 인증</span>
                </StatusBadge>
              )}
            </div>
            <p className="mt-2 text-sm text-ink-2">{subtitle}</p>
            <ul className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
              {specialties.map((tag) => (
                <li
                  key={tag}
                  className="rounded-pill bg-gold-soft px-2.5 py-1 text-xs font-semibold text-gold-ink"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <dl className="mt-8 hidden grid-cols-3 divide-x divide-line lg:grid">
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
    <div className={inset ? "pl-3 sm:pl-6" : undefined}>
      <dt className="text-xs text-ink-3">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">{value}</dd>
      <p className="mt-1 text-xs text-ink-3">{caption}</p>
    </div>
  );
}
