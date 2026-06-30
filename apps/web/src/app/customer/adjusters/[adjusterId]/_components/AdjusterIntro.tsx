import { ProfileCard } from "./ProfileCard";

export function AdjusterIntro({ introduction }: { introduction: string }) {
  return (
    <ProfileCard title="소개">
      <p className="text-sm leading-relaxed text-ink-2">{introduction}</p>
    </ProfileCard>
  );
}
