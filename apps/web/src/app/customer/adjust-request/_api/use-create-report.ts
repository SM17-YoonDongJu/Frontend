"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportKeys } from "@/shared/api/query-keys";
import { createReport } from "./create-report";

/** 분석 신청 뮤테이션. 성공 시 report 목록 무효화. */
export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.list._def });
    },
  });
}
