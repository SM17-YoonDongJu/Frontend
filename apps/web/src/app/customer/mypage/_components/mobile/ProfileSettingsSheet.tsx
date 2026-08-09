"use client";

import { BottomSheet } from "@/shared/ui/BottomSheet";
import type { Me } from "../../_model/types";
import { ProfileSettingsForm } from "../ProfileSettingsForm";

interface ProfileSettingsSheetProps {
  open: boolean;
  profile: Me;
  onClose: () => void;
}

/** 모바일 프로필 설정 바텀시트 — shared BottomSheet + 공용 폼(sheet variant). */
export function ProfileSettingsSheet({
  open,
  profile,
  onClose,
}: ProfileSettingsSheetProps) {
  return (
    <BottomSheet open={open} kicker="마이페이지" title="프로필 설정" onClose={onClose}>
      <ProfileSettingsForm profile={profile} variant="sheet" onClose={onClose} />
    </BottomSheet>
  );
}
