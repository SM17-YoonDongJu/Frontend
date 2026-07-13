"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * 마이페이지에서 URL로 특정 패널을 여는 `?panel=` 파라미터.
 * 알림 팝오버의 "알림 설정" 진입에 사용하며, 패널을 닫으면 파라미터를 제거해 재오픈을 막는다.
 */
export function usePanelParam() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const panel = params.get("panel");

  const clearPanel = useCallback(() => {
    const query = new URLSearchParams(params);
    query.delete("panel");
    const search = query.toString();
    router.replace(search ? `${pathname}?${search}` : pathname);
  }, [params, pathname, router]);

  return { panel, clearPanel };
}
