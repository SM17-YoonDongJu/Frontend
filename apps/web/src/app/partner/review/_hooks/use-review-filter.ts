"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { z } from "zod";
import { accidentTypeSchema } from "@/shared/model/accident-type";

// 사고 유형 필터 값은 명세 영문 enum + 전체.
const typeSchema = z.enum(["전체", ...accidentTypeSchema.options]);

export function useReviewFilter() {
  const pathname = usePathname();
  const params = useSearchParams();

  const type = typeSchema.safeParse(params.get("type")).data ?? "전체";

  const setType = (value: string) => {
    const next = new URLSearchParams(params);
    if (value === "전체") next.delete("type");
    else next.set("type", value);
    const query = next.toString();
    // 서버 데이터가 없는 순수 클라이언트 필터라 shallow routing으로 URL만 동기화.
    // (prod 정적 라우트에서 router.replace(pathname)가 쿼리 제거를 반영하지 않는 문제 회피)
    window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname);
  };

  return { type, setType };
}
