"use client";

import { useNotificationList } from "@/shared/api/use-notification-list";
import { groupNotificationsByDate } from "@/shared/model/notification-group";
import { NotificationCard } from "./NotificationCard";
import { NotificationEmpty } from "./NotificationEmpty";

export function NotificationList() {
  const { data } = useNotificationList();
  const notifications = data.list;

  if (notifications.length === 0) {
    return <NotificationEmpty />;
  }

  const sections = groupNotificationsByDate(notifications);

  return (
    <div className="flex flex-col gap-3.5 px-5 pb-7 pt-5">
      {sections.map((section) => (
        <section key={section.group} className="flex flex-col gap-2">
          <h2 className="text-[0.75rem] font-bold text-ink-3">{section.label}</h2>
          <ul className="flex flex-col gap-[0.5625rem]">
            {section.items.map((notification) => (
              <li key={notification.notificationId}>
                <NotificationCard notification={notification} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
