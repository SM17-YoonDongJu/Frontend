"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportKeys, userKeys } from "@/shared/api/query-keys";
import { createReport } from "./create-report";

/** 분석 신청 뮤테이션. 성공 시 리포트 목록과 사용자 홈 대시보드를 갱신한다(#314). */
export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.list._def });
      queryClient.invalidateQueries({ queryKey: userKeys.dashboard.queryKey });
    },
  });
}
