"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/shared/api/query-keys";
import type { AddInsuranceBody } from "../_model/types";
import { addInsurance } from "./add-insurance";

export function useAddInsurance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: AddInsuranceBody) => addInsurance(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.insurances.queryKey });
    },
  });
}
