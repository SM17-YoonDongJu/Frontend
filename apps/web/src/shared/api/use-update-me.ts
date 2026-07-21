"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/shared/api/query-keys";
import type { UpdateMeBody } from "@/shared/model/user";
import { updateMe } from "./update-me";

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateMeBody) => updateMe(body),
    // 응답을 폐기하고 GET 재조회로만 갱신한다(단일 소스). setQueryData 미사용.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me.queryKey });
    },
  });
}
