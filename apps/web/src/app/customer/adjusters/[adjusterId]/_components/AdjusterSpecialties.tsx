import { ProfileCard } from "./ProfileCard";

const SPECIALTY_DESCRIPTIONS: Record<string, string> = {
  후유장해: "장해분류표 매핑·재평가",
  "후유장해 등급 재산정": "장해분류표 매핑·재평가",
  "장해등급 재산정": "장해분류표 매핑·재평가",
  교통사고: "과실·일실수입 산정",
  "교통사고 보상": "과실·일실수입 산정",
  "특약 누락 검토": "가입 담보 전수 점검",
  "특약 점검": "가입 담보 전수 점검",
  "분쟁조정": "금감원 분쟁조정 절차 대응",
};

export function AdjusterSpecialties({ specialties }: { specialties: string[] }) {
  return (
    <ProfileCard title="전문 분야">
      <ul className="grid gap-2.5 sm:grid-cols-2">
        {specialties.map((specialty) => {
          const description = SPECIALTY_DESCRIPTIONS[specialty];
          return (
            <li
              key={specialty}
              className="flex items-center gap-3 rounded-input border border-line bg-card px-[0.9375rem] py-3.5 lg:gap-4 lg:rounded-card lg:bg-paper-2 lg:px-4 lg:py-4"
            >
              <span
                aria-hidden
                className="flex size-[2.375rem] shrink-0 items-center justify-center rounded-chip bg-gold-soft text-gold-ink lg:size-10 lg:rounded-full"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{specialty}</p>
                {description && <p className="mt-0.5 text-xs text-ink-3">{description}</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </ProfileCard>
  );
}
