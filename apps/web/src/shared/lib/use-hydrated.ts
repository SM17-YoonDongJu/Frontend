import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/** SSR·첫 페인트엔 false, 클라이언트 하이드레이션 후 true. setState-in-effect 없이 클라이언트 전용 렌더 게이트. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
