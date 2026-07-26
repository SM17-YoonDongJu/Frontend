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
  const requestedUserIdRef = useRef<string | null>(null);

  const userId = auth.status === "authenticated" ? auth.me.userId : null;

  useEffect(() => {
    if (!isBridgeAvailable() || userId === null) {
      return;
    }

    // 계정 전환 시에도 새 계정으로 등록되도록 요청 상태·저장 키를 사용자 단위로 분리.
    const storageKey = `${REGISTERED_TOKEN_STORAGE_KEY}.${userId}`;

    const unsubscribe = subscribeToNative((message) => {
      if (message.type !== "PUSH_TOKEN") {
        return;
      }
      const { token, platform } = message.payload;
      if (localStorage.getItem(storageKey) === token) {
        return;
      }
      registerDeviceToken(
        { token, platform: platform === "ios" ? "IOS" : "ANDROID" },
        {
          onSuccess: () => {
            localStorage.setItem(storageKey, token);
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
