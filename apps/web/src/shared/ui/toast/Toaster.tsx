"use client";

import { useSyncExternalStore } from "react";
import { Toast } from "./Toast";
import {
  subscribe,
  getSnapshot,
  getServerSnapshot,
  dismissToast,
} from "./toast-store";

/** 스토어를 구독해 토스트 스택을 상단 중앙에 고정 렌더. Providers에 1회 마운트. */
export function Toaster() {
  const toasts = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4">
      {toasts.map((item) => (
        <div
          key={item.id}
          className="pointer-events-auto w-full max-w-[22.5rem] transition"
        >
          <Toast
            variant={item.variant}
            message={item.message}
            onClose={() => dismissToast(item.id)}
          />
        </div>
      ))}
    </div>
  );
}
