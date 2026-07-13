import type { Notification } from "@/shared/model/notification.schema";
import { formatRelativeTime } from "@/shared/model/notification-group";
import { NotificationTypeIcon } from "@/shared/ui/NotificationTypeIcon";

interface NotificationCardProps {
  notification: Notification;
  now?: Date;
}

export function NotificationCard({ notification, now }: NotificationCardProps) {
  const { type, title, body, isRead, createdAt } = notification;

  const surfaceClassName = isRead
    ? "bg-paper-2 border-line-2"
    : "bg-card border-line";

  return (
    <article
      className={`relative flex items-start gap-3 rounded-input border px-[0.9375rem] py-3.5 ${surfaceClassName}`}
    >
      <NotificationTypeIcon type={type} />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className={`flex w-full items-end gap-2 ${isRead ? "" : "pr-2.5"}`}>
          <h3 className="truncate text-[0.83125rem] font-bold text-ink">{title}</h3>
          <time className="ml-auto shrink-0 text-[0.6875rem] font-normal text-ink-3">
            {formatRelativeTime(createdAt, now)}
          </time>
        </div>
        <p className="line-clamp-1 text-[0.73125rem] leading-[1.171875rem] text-ink-2">
          {body}
        </p>
      </div>

      {!isRead && (
        <span
          className="absolute right-[0.8125rem] top-[0.9375rem] size-2 rounded-full bg-terra"
          aria-label="읽지 않은 알림"
        />
      )}
    </article>
  );
}
