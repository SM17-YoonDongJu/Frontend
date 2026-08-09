"use client";

import { Modal } from "@/shared/ui/Modal";
import type { Me } from "../_model/types";
import { ProfileSettingsForm } from "./ProfileSettingsForm";

interface ProfileSettingsModalProps {
  open: boolean;
  profile: Me;
  onClose: () => void;
}

/** PC 프로필 설정 모달 — shared Modal 셸 + 공용 폼. */
export function ProfileSettingsModal({
  open,
  profile,
  onClose,
}: ProfileSettingsModalProps) {
  return (
    <Modal open={open} kicker="마이페이지" title="프로필 설정" onClose={onClose}>
      <ProfileSettingsForm profile={profile} variant="modal" onClose={onClose} />
    </Modal>
  );
}
