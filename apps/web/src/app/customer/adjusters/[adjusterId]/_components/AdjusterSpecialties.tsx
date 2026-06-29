import { ProfileCard } from "./ProfileCard";

export function AdjusterSpecialties({ specialties }: { specialties: string[] }) {
  return (
    <ProfileCard title="전문 분야">
      <ul className="grid gap-3 sm:grid-cols-2">
        {specialties.map((specialty) => (
          <li
            key={specialty}
            className="flex items-center gap-4 rounded-card border border-line bg-paper-2 px-4 py-4"
          >
            <span
              aria-hidden
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold-soft text-gold-ink"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
            <p className="text-sm font-semibold text-ink">{specialty}</p>
          </li>
        ))}
      </ul>
    </ProfileCard>
  );
}
