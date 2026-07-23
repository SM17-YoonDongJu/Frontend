"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationKeys } from "@/shared/api/query-keys";
import { patchNotificationRead } from "./patch-notification-read";

export function useReadNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchNotificationRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: notificationKeys.list.queryKey }),
  });
}
