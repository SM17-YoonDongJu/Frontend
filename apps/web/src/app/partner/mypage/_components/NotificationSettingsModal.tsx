"use client";

import { Modal } from "@/shared/ui/Modal";
import { NotificationSettingsForm } from "../_shared/ui/NotificationSettingsForm";

interface NotificationSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

/** PC 알림 설정 모달(Figma 146-4640). 모바일은 /partner/mypage/notifications 페이지. */
export function NotificationSettingsModal({ open, onClose }: NotificationSettingsModalProps) {
  return (
    <Modal open={open} kicker="내 정보" title="알림 설정" onClose={onClose} className="max-w-sm">
      <NotificationSettingsForm onComplete={onClose} onCancel={onClose} />
    </Modal>
  );
}
