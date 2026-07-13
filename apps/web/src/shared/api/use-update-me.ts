"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/shared/api/query-keys";
import type { UpdateMeBody } from "@/shared/model/user";
import { updateMe } from "./update-me";

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateMeBody) => updateMe(body),
    // PATCH 응답이 부분 필드라 캐시에 직접 쓰면 role·createdAt·phone이 소실된다(setQueryData 금지).
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me.queryKey });
    },
  });
}
