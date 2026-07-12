"use client";

import { type ChangeEvent } from "react";
import { Button } from "@/shared/ui/Button";
import { Camera } from "@/shared/ui/icons/Camera";
import { Input } from "@/shared/ui/Input";
import { joinInfoLabel, socialAccountLabel } from "../_model/profile-format";
import type { Me } from "../_model/types";
import { useProfileSettingsForm } from "../_hooks/use-profile-settings-form";
import { ComingSoonButton } from "./ComingSoonButton";
import { ProfileAvatar } from "./ProfileAvatar";

interface ProfileSettingsFormProps {
  profile: Me;
  variant: "modal" | "sheet";
  onClose: () => void;
}

/** 프로필 설정 공용 폼(모달·바텀시트 공유). 사진·휴대폰·소셜 + 저장. variant로 문구·액션 분기. */
export function ProfileSettingsForm({
  profile,
  variant,
  onClose,
}: ProfileSettingsFormProps) {
  const { phone, setPhone, avatarUrl, pickFile, isUploading, isSaving, save } =
    useProfileSettingsForm({ profile, onSaved: onClose });

  const caption =
    variant === "modal"
      ? "사진은 상담 시 사정사에게만 보여요."
      : joinInfoLabel(profile.socialProvider, profile.createdAt);

  const phoneInputId = `mypage-phone-${variant}`;

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void pickFile(file);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3.5">
        <div className="relative shrink-0">
          <ProfileAvatar
            avatarUrl={avatarUrl}
            nickname={profile.nickname}
            className="size-14 bg-navy text-[1.375rem]"
          />
          {variant === "sheet" && (
            <label className="absolute -bottom-0.5 -right-0.5 flex size-6 cursor-pointer items-center justify-center rounded-full bg-gold text-white shadow-sm transition hover:brightness-[.96]">
              <Camera className="size-3" />
              <span className="sr-only">사진 변경</span>
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={onFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[0.9375rem] font-bold text-ink">{profile.nickname} 님</p>
          <p className="mt-0.5 truncate text-[0.8125rem] text-ink-3">{caption}</p>
        </div>

        <label className="shrink-0 cursor-pointer rounded-chip border border-line px-3.5 py-1.5 text-[0.8125rem] font-bold text-ink-2 transition hover:bg-paper">
          {isUploading ? "업로드 중…" : "사진 변경"}
          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={onFileChange}
            className="hidden"
          />
        </label>
      </div>

      <div>
        <label
          htmlFor={phoneInputId}
          className="mb-2 block text-[0.8125rem] font-bold text-ink-2"
        >
          휴대폰 번호
        </label>
        <Input
          id={phoneInputId}
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="010-0000-0000"
          inputMode="tel"
        />
      </div>

      <div>
        <p className="mb-2 text-[0.8125rem] font-bold text-ink-2">연결된 소셜</p>
        <div className="flex items-center justify-between rounded-input border border-line bg-card px-4 py-3">
          <span className="text-[0.875rem] font-medium text-ink">
            {socialAccountLabel(profile.socialProvider)}
          </span>
          <ComingSoonButton className="text-[0.8125rem] font-bold text-ink-2 transition hover:text-ink">
            관리
          </ComingSoonButton>
        </div>
      </div>

      <p className="text-[0.8125rem] text-ink-3">
        휴대폰은 리포트·제안 알림 수신에 사용돼요.
      </p>

      {variant === "modal" ? (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button onClick={save} loading={isSaving}>
            저장하기
          </Button>
        </div>
      ) : (
        <Button full onClick={save} loading={isSaving}>
          저장하기
        </Button>
      )}
    </div>
  );
}
