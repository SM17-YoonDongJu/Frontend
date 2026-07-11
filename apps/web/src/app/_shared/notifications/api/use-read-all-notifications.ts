// CONTRACT: 명세없음-초안(.pr-assets/api-spec-draft-notifications.md)
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationKeys } from "@/shared/api/query-keys";
import { patchReadAllNotifications } from "./patch-read-all-notifications";

export function useReadAllNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchReadAllNotifications,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: notificationKeys.list.queryKey }),
  });
}
