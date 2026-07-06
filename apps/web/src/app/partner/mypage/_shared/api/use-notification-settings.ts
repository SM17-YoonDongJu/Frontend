"use client";

import { useQuery } from "@tanstack/react-query";
import { settingsKeys } from "@/shared/api/query-keys";
import { GC_TIME_DEFAULT, STALE_TIME_AUTH } from "@/shared/api/query-constants";
import { getNotificationSettings } from "./get-notification-settings";

export function useNotificationSettings() {
  return useQuery({
    queryKey: settingsKeys.notification.queryKey,
    queryFn: getNotificationSettings,
    staleTime: STALE_TIME_AUTH,
    gcTime: GC_TIME_DEFAULT,
  });
}
