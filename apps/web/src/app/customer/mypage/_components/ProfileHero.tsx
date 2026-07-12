import { Button } from "@/shared/ui/Button";
import type { Me } from "../_model/types";
import { ProfileAvatar } from "./ProfileAvatar";

interface ProfileHeroProps {
  profile: Me;
  onEdit: () => void;
}

/** PC 프로필 히어로 — 다크(navy) 카드. 아바타·이름·`일반 회원` 칩 + 프로필 수정. */
export function ProfileHero({ profile, onEdit }: ProfileHeroProps) {
  return (
    <section className="flex items-center gap-6 rounded-[1.25rem] bg-navy p-6.5">
      <ProfileAvatar
        avatarUrl={profile.avatarUrl}
        nickname={profile.nickname}
        className="size-16 text-[1.625rem]"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-serif text-[1.4375rem] font-bold text-white">
            {profile.nickname} 님
          </h2>
          <span className="inline-flex items-center rounded-tag bg-gold-2 px-2.5 py-0.5 text-[0.6875rem] font-bold text-navy">
            일반 회원
          </span>
        </div>
      </div>

      <Button variant="gold" onClick={onEdit} className="shrink-0">
        프로필 수정
      </Button>
    </section>
  );
}
