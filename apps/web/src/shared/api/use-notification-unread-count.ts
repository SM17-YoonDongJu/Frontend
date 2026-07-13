// CONTRACT: 명세없음-초안(.pr-assets/api-spec-draft-notifications.md)
"use client";

import { useQuery } from "@tanstack/react-query";
import { notificationKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getNotificationList } from "./get-notification-list";

/** 미읽음 알림 개수. 목록 쿼리와 같은 키를 공유해 읽음 처리 시 함께 갱신된다. 로딩·에러 시 undefined. */
export function useNotificationUnreadCount() {
  const { data } = useQuery({
    queryKey: notificationKeys.list.queryKey,
    queryFn: getNotificationList,
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
    select: (list) => list.list.filter((notification) => !notification.isRead).length,
  });

  return data;
}
