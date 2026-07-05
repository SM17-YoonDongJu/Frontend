"use client";

import { useSyncExternalStore } from "react";

const MOBILE_QUERY = "(max-width: 639px)";

function subscribe(onChange: () => void): () => void {
  const mql = window.matchMedia(MOBILE_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/** 모바일(<=639px) 뷰포트 여부. SSR·첫 페인트는 false(데스크톱), 하이드레이션 후 실제 값. */
export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
