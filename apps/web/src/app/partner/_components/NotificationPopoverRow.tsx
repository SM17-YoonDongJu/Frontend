import type { Notification } from "../../_shared/notifications/model/notification.schema";
import { formatPopoverTime } from "../../_shared/notifications/model/notification-group";
import { NotificationTypeIcon } from "../../_shared/notifications/ui/NotificationTypeIcon";

interface NotificationPopoverRowProps {
  notification: Notification;
  now?: Date;
}

export function NotificationPopoverRow({ notification, now }: NotificationPopoverRowProps) {
  const { type, title, body, isRead, createdAt } = notification;

  return (
    <div className="flex items-start gap-3 px-5 py-3.5">
      <NotificationTypeIcon type={type} />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <h4 className="truncate text-[0.8125rem] font-bold text-ink">{title}</h4>
          {!isRead && (
            <span
              className="size-1.5 shrink-0 rounded-full bg-terra"
              aria-label="읽지 않은 알림"
            />
          )}
        </div>
        <p className="line-clamp-1 text-[0.75rem] text-ink-2">{body}</p>
      </div>

      <time className="shrink-0 pt-0.5 text-[0.6875rem] text-ink-3">
        {formatPopoverTime(createdAt, now)}
      </time>
    </div>
  );
}
