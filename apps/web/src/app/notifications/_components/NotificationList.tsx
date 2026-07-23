"use client";

import { useNotificationList } from "@/shared/api/use-notification-list";
import { useReadNotification } from "@/shared/api/use-read-notification";
import { groupNotificationsByDate } from "@/shared/model/notification-group";
import { toast } from "@/shared/ui/toast";
import { NotificationCard } from "./NotificationCard";
import { NotificationEmpty } from "./NotificationEmpty";

export function NotificationList() {
  const { data } = useNotificationList();
  const { mutate: readNotification, isPending } = useReadNotification();
  const notifications = data.items;

  if (notifications.length === 0) {
    return <NotificationEmpty />;
  }

  const handleRead = (notificationId: string) => {
    if (isPending) return;
    readNotification(notificationId, {
      onError: () =>
        toast.error("알림 읽음 처리에 실패했어요. 잠시 후 다시 시도해 주세요."),
    });
  };

  const sections = groupNotificationsByDate(notifications);

  return (
    <div className="flex flex-col gap-3.5 px-5 pb-7 pt-5">
      {sections.map((section) => (
        <section key={section.group} className="flex flex-col gap-2">
          <h2 className="text-[0.75rem] font-bold text-ink-3">{section.label}</h2>
          <ul className="flex flex-col gap-[0.5625rem]">
            {section.items.map((notification) => (
              <li key={notification.id}>
                <NotificationCard notification={notification} onRead={handleRead} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
