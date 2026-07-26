"use client";

import { useEffect, useRef } from "react";
import {
  isBridgeAvailable,
  sendToNative,
  subscribeToNative,
} from "@insurance/bridge/web";
import { useAuthStatus } from "@/shared/api/use-auth-status";
import { useRegisterDeviceToken } from "@/shared/api/use-register-device-token";

const REGISTERED_TOKEN_STORAGE_KEY = "bb.registeredDeviceToken";

export function useDeviceTokenRegistration() {
  const auth = useAuthStatus();
  const { mutate: registerDeviceToken } = useRegisterDeviceToken();
  const requestedRef = useRef(false);

  useEffect(() => {
    if (!isBridgeAvailable() || auth.status !== "authenticated") {
      return;
    }

    const unsubscribe = subscribeToNative((message) => {
      if (message.type !== "PUSH_TOKEN") {
        return;
      }
      const { token, platform } = message.payload;
      if (localStorage.getItem(REGISTERED_TOKEN_STORAGE_KEY) === token) {
        return;
      }
      registerDeviceToken(
        { token, platform: platform === "ios" ? "IOS" : "ANDROID" },
        {
          onSuccess: () => {
            localStorage.setItem(REGISTERED_TOKEN_STORAGE_KEY, token);
          },
        },
      );
    });

    sendToNative({ v: 1, type: "WEB_READY" });
    if (!requestedRef.current) {
      requestedRef.current = true;
      sendToNative({ v: 1, type: "REQUEST_PUSH_TOKEN" });
    }
    return unsubscribe;
  }, [auth.status, registerDeviceToken]);
}
