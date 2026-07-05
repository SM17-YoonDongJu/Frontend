// CONTRACT: 명세없음-초안(.pr-assets/api-spec-draft-notifications.md)
"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { notificationKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_LIST } from "@/shared/api/query-constants";
import { getNotificationList } from "./get-notification-list";

export function useNotificationList() {
  return useSuspenseQuery({
    queryKey: notificationKeys.list.queryKey,
    queryFn: getNotificationList,
    staleTime: STALE_TIME_LIST,
    gcTime: GC_TIME_DEFAULT,
  });
}
