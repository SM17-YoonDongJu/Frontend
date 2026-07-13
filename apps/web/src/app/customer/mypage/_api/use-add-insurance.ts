"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/shared/api/query-keys";
import type { AddInsuranceBody } from "../_model/types";
import { addInsurance } from "./add-insurance";

export function useAddInsurance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: AddInsuranceBody) => addInsurance(body),
    // 응답이 `{ id }` 단건이라 캐시에 직접 쓸 수 없다(setQueryData 금지) → invalidate로 목록 재조회.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.insurances.queryKey });
    },
  });
}
