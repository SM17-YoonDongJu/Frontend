"use client";

import { useCallback, useSyncExternalStore } from "react";

const RECENT_LOGIN_KEY = "bb.recentLogin";

export type SocialProvider = "kakao" | "naver";

export interface RecentLogin {
  provider: SocialProvider;
  maskedEmail: string;
  lastLoginAt: string;
}

const listeners = new Set<() => void>();
let cache: RecentLogin | null = null;
let cacheRaw: string | null = null;

function readRaw(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(RECENT_LOGIN_KEY);
  } catch {
    return null;
  }
}

function getSnapshot(): RecentLogin | null {
  const raw = readRaw();
  if (raw === cacheRaw) return cache;
  cacheRaw = raw;
  try {
    cache = raw ? (JSON.parse(raw) as RecentLogin) : null;
  } catch {
    cache = null;
  }
  return cache;
}

function getServerSnapshot(): RecentLogin | null {
  return null;
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === RECENT_LOGIN_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function emit(): void {
  for (const listener of listeners) listener();
}

/**
 * 최근 로그인 흔적 read/write. useSyncExternalStore로 localStorage를 구독 —
 * 서버·초기 스냅샷은 null(hydration 안전), 다른 탭 변경(storage 이벤트)·자체 write 시 갱신.
 */
export function useRecentLogin() {
  const recentLogin = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const saveRecentLogin = useCallback((value: RecentLogin) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(RECENT_LOGIN_KEY, JSON.stringify(value));
    }
    emit();
  }, []);

  const clearRecentLogin = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(RECENT_LOGIN_KEY);
    }
    emit();
  }, []);

  return { recentLogin, saveRecentLogin, clearRecentLogin };
}
