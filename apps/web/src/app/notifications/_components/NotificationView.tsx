"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "@/shared/ui/icons/ChevronLeft";
import { useReadAllNotifications } from "../../_shared/notifications/api/use-read-all-notifications";
import { NotificationBoundary } from "./NotificationBoundary";
import { NotificationList } from "./NotificationList";

export function NotificationView() {
  const router = useRouter();
  const readAll = useReadAllNotifications();

  return (
    <>
      <header className="flex items-center gap-1.5 px-3 pb-3 pt-1">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로 가기"
          className="flex size-[2.375rem] items-center justify-center rounded-button text-ink transition hover:bg-paper"
        >
          <ChevronLeft className="size-[1.375rem]" />
        </button>
        <h1 className="flex-1 text-[0.9375rem] font-bold text-ink">알림</h1>
        <button
          type="button"
          onClick={() => readAll.mutate()}
          disabled={readAll.isPending}
          className="pr-1.5 text-[0.75rem] font-semibold text-gold-ink transition hover:brightness-[.96] disabled:cursor-not-allowed disabled:opacity-[.42]"
        >
          모두 읽음
        </button>
      </header>

      <NotificationBoundary>
        <NotificationList />
      </NotificationBoundary>
    </>
  );
}
