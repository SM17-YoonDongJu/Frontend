"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsKeys } from "@/shared/api/query-keys";
import type { UpdateNotificationSettingsBody } from "@/shared/model/notification-settings.schema";
import { updateNotificationSettings } from "./update-notification-settings";

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateNotificationSettingsBody) =>
      updateNotificationSettings(body),
    onSuccess: (data) => {
      queryClient.setQueryData(settingsKeys.notification.queryKey, data);
      queryClient.invalidateQueries({
        queryKey: settingsKeys.notification.queryKey,
      });
    },
  });
}
