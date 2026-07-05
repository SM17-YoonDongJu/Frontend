"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsKeys } from "@/shared/api/query-keys";
import type { UpdateNotificationSettingsBody } from "../_model/types";
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
