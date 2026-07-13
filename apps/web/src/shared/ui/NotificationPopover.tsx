"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/shared/ui/Button";
import { useReadAllNotifications } from "@/shared/api/use-read-all-notifications";
import { useNotificationUnreadCount } from "@/shared/api/use-notification-unread-count";
import { NotificationPopoverList } from "./NotificationPopoverList";

const SKELETON_ROW_COUNT = 3;

function NotificationPopoverSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-2 px-5 py-4">
      {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
        <div
          key={index}
          className="h-14 animate-pulse rounded-input bg-paper-2"
        />
      ))}
    </div>
  );
}

interface NotificationPopoverErrorProps {
  code?: string;
  onRetry: () => void;
}

function NotificationPopoverError({ code, onRetry }: NotificationPopoverErrorProps) {
  return (
    <div role="alert" className="flex flex-col items-center px-6 py-8 text-center">
      <p className="text-[0.8125rem] font-semibold text-ink">
        알림을 불러오지 못했어요
      </p>
      {code && <p className="mt-1 text-[0.71875rem] text-ink-3">({code})</p>}
      <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
        다시 시도
      </Button>
    </div>
  );
}

interface NotificationPopoverProps {
  settingsHref: string;
  onClose: () => void;
}

export function NotificationPopover({ settingsHref, onClose }: NotificationPopoverProps) {
  const router = useRouter();
  const readAll = useReadAllNotifications();
  const unreadCount = useNotificationUnreadCount();

  const goToSettings = () => {
    onClose();
    router.push(settingsHref);
  };

  return (
    <div className="flex flex-col">
      <header className="flex items-center gap-2 border-b border-line px-5 py-3.5">
        <h2 className="text-[0.9375rem] font-bold text-ink">알림</h2>
        {unreadCount != null && unreadCount > 0 && (
          <span className="rounded-pill bg-gold-soft px-2 py-0.5 text-[0.6875rem] font-semibold text-gold-ink">
            {unreadCount} 새 알림
          </span>
        )}
        <button
          type="button"
          onClick={() => readAll.mutate()}
          disabled={readAll.isPending}
          className="ml-auto text-[0.75rem] font-semibold text-gold-ink transition hover:brightness-[.96] disabled:cursor-not-allowed disabled:opacity-[.42]"
        >
          모두 읽음
        </button>
      </header>

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ error, resetErrorBoundary }) => (
              <NotificationPopoverError
                code={(error as Error).name}
                onRetry={resetErrorBoundary}
              />
            )}
          >
            <Suspense fallback={<NotificationPopoverSkeleton />}>
              <NotificationPopoverList />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>

      <footer className="border-t border-line">
        <button
          type="button"
          onClick={goToSettings}
          className="w-full rounded-b-card-lg py-3 text-center text-[0.8125rem] font-semibold text-gold-ink transition hover:bg-paper-2"
        >
          알림 설정
        </button>
      </footer>
    </div>
  );
}
