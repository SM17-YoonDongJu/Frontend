// CONTRACT: 명세없음-초안(.pr-assets/api-spec-draft-notifications.md)
"use client";

import { useQuery } from "@tanstack/react-query";
import { notificationKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_AUTH } from "@/shared/api/query-constants";
import { getNotificationList } from "./get-notification-list";

/**
 * 미읽음 알림 개수. 목록 쿼리와 같은 키를 공유해 읽음 처리 시 함께 갱신된다. 로딩·에러 시 undefined.
 * 전 페이지 헤더 벨에서 마운트되므로 목록(staleTime 0)과 달리 staleTime을 둬 페이지 이동·포커스마다의 재요청을 막는다.
 */
export function useNotificationUnreadCount() {
  const { data } = useQuery({
    queryKey: notificationKeys.list.queryKey,
    queryFn: getNotificationList,
    staleTime: STALE_TIME_AUTH,
    gcTime: GC_TIME_DEFAULT,
    select: (list) => list.list.filter((notification) => !notification.isRead).length,
  });

  return data;
}
