import { ProfileCard } from "./ProfileCard";
import type { AdjusterCareer } from "../_model/types";

export function AdjusterCareers({ careers }: { careers: AdjusterCareer[] }) {
  return (
    <ProfileCard title="주요 경력">
      <ul className="divide-y divide-line">
        {careers.map((career) => (
          <li key={`${career.period}-${career.company}`} className="flex gap-6 py-4 first:pt-0 last:pb-0">
            <span className="w-28 shrink-0 text-sm font-medium text-gold-ink">
              {career.period}
            </span>
            <span className="text-sm text-ink-2">{career.company}</span>
          </li>
        ))}
      </ul>
    </ProfileCard>
  );
}
