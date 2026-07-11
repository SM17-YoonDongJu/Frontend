"use client";

import { useNotificationList } from "../../_shared/notifications/api/use-notification-list";
import { groupNotificationsForPopover } from "../../_shared/notifications/model/notification-group";
import { NotificationPopoverRow } from "./NotificationPopoverRow";

export function NotificationPopoverList() {
  const { data } = useNotificationList();
  const notifications = data.list;

  if (notifications.length === 0) {
    return (
      <p className="px-5 py-10 text-center text-[0.8125rem] text-ink-3">
        새 알림이 없어요
      </p>
    );
  }

  const sections = groupNotificationsForPopover(notifications);

  return (
    <div className="max-h-96 overflow-y-auto">
      {sections.map((section) => (
        <section key={section.group}>
          <h3 className="border-b border-line-2 bg-paper-2 px-5 py-1.5 text-[0.71875rem] font-bold text-ink-3">
            {section.label}
          </h3>
          <ul className="divide-y divide-line-2">
            {section.items.map((notification) => (
              <li key={notification.notificationId}>
                <NotificationPopoverRow notification={notification} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
