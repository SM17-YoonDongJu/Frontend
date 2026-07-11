import type { Notification } from "./notification.schema";

export type NotificationGroup = "TODAY" | "YESTERDAY" | "EARLIER";

export const NOTIFICATION_GROUP_LABEL: Record<NotificationGroup, string> = {
  TODAY: "오늘",
  YESTERDAY: "어제",
  EARLIER: "이전",
};

const GROUP_ORDER: NotificationGroup[] = ["TODAY", "YESTERDAY", "EARLIER"];

const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_MINUTE = 1000 * 60;

export interface NotificationSection {
  group: NotificationGroup;
  label: string;
  items: Notification[];
}

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/** createdAt이 속한 날짜 그룹(오늘/어제/이전)을 판정한다. */
export function resolveNotificationGroup(
  createdAt: string,
  now: Date = new Date(),
): NotificationGroup {
  const dayDiff = Math.round((startOfDay(now) - startOfDay(new Date(createdAt))) / (MS_PER_HOUR * 24));

  if (dayDiff <= 0) return "TODAY";
  if (dayDiff === 1) return "YESTERDAY";
  return "EARLIER";
}

/** 알림 목록을 날짜 그룹별 섹션으로 묶는다. 비어 있는 그룹은 제외한다. */
export function groupNotificationsByDate(
  notifications: Notification[],
  now: Date = new Date(),
): NotificationSection[] {
  const buckets = new Map<NotificationGroup, Notification[]>();

  for (const notification of notifications) {
    const group = resolveNotificationGroup(notification.createdAt, now);
    const bucket = buckets.get(group) ?? [];
    bucket.push(notification);
    buckets.set(group, bucket);
  }

  return GROUP_ORDER.filter((group) => buckets.has(group)).map((group) => ({
    group,
    label: NOTIFICATION_GROUP_LABEL[group],
    items: buckets.get(group) ?? [],
  }));
}

/** 상대시간 표기. 오늘 그룹은 "N시간 전"/"N분 전", 어제는 "N일 전", 이전은 "MM.DD". */
export function formatRelativeTime(createdAt: string, now: Date = new Date()): string {
  const created = new Date(createdAt);
  const group = resolveNotificationGroup(createdAt, now);

  if (group === "EARLIER") {
    const month = String(created.getMonth() + 1).padStart(2, "0");
    const day = String(created.getDate()).padStart(2, "0");
    return `${month}.${day}`;
  }

  if (group === "YESTERDAY") {
    return "1일 전";
  }

  const elapsedHours = Math.floor((now.getTime() - created.getTime()) / MS_PER_HOUR);
  if (elapsedHours >= 1) {
    return `${elapsedHours}시간 전`;
  }

  const elapsedMinutes = Math.floor((now.getTime() - created.getTime()) / MS_PER_MINUTE);
  return elapsedMinutes >= 1 ? `${elapsedMinutes}분 전` : "방금 전";
}
