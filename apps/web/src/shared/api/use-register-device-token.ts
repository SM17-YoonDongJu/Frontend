"use client";

import { useMutation } from "@tanstack/react-query";
import type { RegisterDeviceTokenBody } from "@/shared/model/device-token.schema";
import { registerDeviceToken } from "./register-device-token";

export function useRegisterDeviceToken() {
  return useMutation({
    mutationFn: (body: RegisterDeviceTokenBody) => registerDeviceToken(body),
  });
}
