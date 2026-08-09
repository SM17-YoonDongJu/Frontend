"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { saveReturnPath } from "@/shared/lib/return-path";

/**
 * 미들웨어 리다이렉트는 서버(Edge)에서 일어나 sessionStorage에 못 쓴다.
 * ?from= 쿼리로 넘어온 원래 경로를 여기서 saveReturnPath에 위임해,
 * 이후 로그인 성공 흐름(consumeReturnPath)이 그대로 동작하게 한다.
 */
export function ReturnPathBridge() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const from = searchParams.get("from");
    if (from) saveReturnPath(from);
  }, [searchParams]);

  return null;
}
