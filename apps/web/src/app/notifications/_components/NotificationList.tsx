"use client";

import { Bell } from "@/shared/ui/icons/Bell";
import { useNotificationList } from "../_api/use-notification-list";
import { groupNotificationsByDate } from "../_model/notification-group";
import { NotificationCard } from "./NotificationCard";

export function NotificationList() {
  const { data } = useNotificationList();
  const notifications = data.list;

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center px-6 pt-24 text-center">
        <Bell className="text-[1.75rem] text-ink-3" />
        <p className="mt-3 text-[0.875rem] text-ink-2">아직 받은 알림이 없어요</p>
      </div>
    );
  }

  const sections = groupNotificationsByDate(notifications);

  return (
    <div className="px-5 pb-6 pt-5">
      {sections.map((section) => (
        <section key={section.group} className="mt-4 first:mt-0">
          <h2 className="px-0.5 text-[0.75rem] font-bold text-ink-3">{section.label}</h2>
          <ul className="mt-2 flex flex-col gap-2">
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
