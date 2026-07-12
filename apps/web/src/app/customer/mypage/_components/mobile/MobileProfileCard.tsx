import type { ReactNode } from "react";
import { Camera } from "@/shared/ui/icons/Camera";
import { Pencil } from "@/shared/ui/icons/Pencil";
import type { Me } from "../../_model/types";
import { ProfileAvatar } from "../ProfileAvatar";

interface MobileProfileCardProps {
  profile: Me;
  onEdit: () => void;
  /** 하단 스탯 영역(같은 카드 내 구분선 아래) */
  children?: ReactNode;
}

/** 모바일 프로필 카드 — navy 다크 카드. 아바타(카메라 badge)·`일반 회원` 칩·수정. 하단 스탯 슬롯. */
export function MobileProfileCard({ profile, onEdit, children }: MobileProfileCardProps) {
  return (
    <section className="overflow-hidden rounded-card-lg bg-navy shadow-xl shadow-navy/40">
      <div className="flex items-center gap-3.5 p-5">
        <div className="relative shrink-0">
          <ProfileAvatar
            avatarUrl={profile.avatarUrl}
            nickname={profile.nickname}
            className="size-13 text-[1.25rem]"
          />
          <span className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full border-2 border-navy bg-gold-2 text-navy">
            <Camera className="size-2.5" />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-[1.0625rem] font-bold text-white">{profile.nickname} 님</p>
            <span className="inline-flex items-center rounded-tag bg-gold-2 px-2 py-0.5 text-[0.6875rem] font-bold text-navy">
              일반 회원
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex shrink-0 items-center gap-1 rounded-[0.625rem] border border-white/[0.18] bg-white/[0.12] px-3 py-1.5 text-[0.8125rem] font-bold text-white transition hover:brightness-110"
        >
          <Pencil className="size-3.5" />
          수정
        </button>
      </div>

      {children && <div className="border-t border-white/10">{children}</div>}
    </section>
  );
}
