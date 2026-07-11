"use client";

import { useEffect, useState } from "react";

// Tailwind md 브레이크포인트(48rem/768px) 기준. md↑=단일 폼, md↓=3스텝 퍼널.
const DESKTOP_QUERY = "(min-width: 48rem)";

/**
 * md 이상 여부. 하이드레이션 불일치 방지를 위해 mount 전엔 null 반환 →
 * 소비처는 null일 때 레이아웃 확정을 미룬다.
 */
export function useIsDesktop(): boolean | null {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return isDesktop;
}
