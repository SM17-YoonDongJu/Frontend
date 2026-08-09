"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adjusterKeys } from "@/shared/api/query-keys";
import type { UpdateProfileBody } from "../_model/types";
import { updateProfile } from "./update-profile";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateProfileBody) => updateProfile(body),
    onSuccess: (data) => {
      queryClient.setQueryData(adjusterKeys.meProfile().queryKey, data);
      queryClient.invalidateQueries({
        queryKey: adjusterKeys.meProfile().queryKey,
      });
    },
  });
}
