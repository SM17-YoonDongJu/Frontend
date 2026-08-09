"use client";

import { useRouter } from "next/navigation";
import { NotificationSettingsForm } from "../../_shared/ui/NotificationSettingsForm";

export function NotificationsView() {
  const router = useRouter();
  const goBack = () => router.back();

  return <NotificationSettingsForm onComplete={goBack} onCancel={goBack} />;
}
