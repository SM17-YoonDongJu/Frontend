"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/shared/api/query-keys";
import type { UpdateMeBody } from "@/shared/model/user";
import { updateMe } from "./update-me";

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateMeBody) => updateMe(body),
    onSuccess: (data) => {
      queryClient.setQueryData(userKeys.me.queryKey, data);
      queryClient.invalidateQueries({ queryKey: userKeys.me.queryKey });
    },
  });
}
