"use client";

import { useHydrated } from "@/shared/lib/use-hydrated";
import { useMediaQuery } from "@/shared/lib/use-media-query";

// Tailwind md 브레이크포인트(48rem/768px) 기준. md↑=단일 폼, md↓=3스텝 퍼널.
const DESKTOP_QUERY = "(min-width: 48rem)";

/**
 * md 이상 여부. 하이드레이션 전엔 null → 소비처는 레이아웃 확정을 미룬다.
 * 데스크톱 폼과 모바일 퍼널이 서로 다른 트리라, 확정 전에 그리면 화면이 한 번 뒤바뀐다.
 */
export function useIsDesktop(): boolean | null {
  const hydrated = useHydrated();
  const isDesktop = useMediaQuery(DESKTOP_QUERY);

  return hydrated ? isDesktop : null;
}
