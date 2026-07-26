"use client";

import { useEffect, useRef } from "react";
import {
  isBridgeAvailable,
  sendToNative,
  subscribeToNative,
} from "@insurance/bridge/web";
import { useAuthStatus } from "@/shared/api/use-auth-status";
import { useRegisterDeviceToken } from "@/shared/api/use-register-device-token";
import {
  loadRegisteredDeviceToken,
  saveRegisteredDeviceToken,
} from "./device-token-storage";

export function useDeviceTokenRegistration() {
  const auth = useAuthStatus();
  const { mutate: registerDeviceToken } = useRegisterDeviceToken();
  const requestedUserIdRef = useRef<string | null>(null);

  const userId = auth.status === "authenticated" ? auth.me.userId : null;

  useEffect(() => {
    if (!isBridgeAvailable() || userId === null) {
      return;
    }

    const unsubscribe = subscribeToNative((message) => {
      if (message.type !== "PUSH_TOKEN") {
        return;
      }
      const { token, platform } = message.payload;
      // 계정 전환 시에도 새 계정으로 등록되도록 사용자+토큰 쌍으로 중복 판정.
      const registered = loadRegisteredDeviceToken();
      if (registered?.userId === userId && registered.token === token) {
        return;
      }
      registerDeviceToken(
        { token, platform: platform === "ios" ? "IOS" : "ANDROID" },
        {
          onSuccess: () => {
            saveRegisteredDeviceToken({ userId, token });
          },
        },
      );
    });

    sendToNative({ v: 1, type: "WEB_READY" });
    if (requestedUserIdRef.current !== userId) {
      requestedUserIdRef.current = userId;
      sendToNative({ v: 1, type: "REQUEST_PUSH_TOKEN" });
    }
    return unsubscribe;
  }, [userId, registerDeviceToken]);
}
