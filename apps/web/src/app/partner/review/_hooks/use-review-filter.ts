"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { z } from "zod";
import { accidentTypeSchema } from "@/shared/model/accident-type";

// 사고 유형 필터 값은 명세 영문 enum + 전체.
const typeSchema = z.enum(["전체", ...accidentTypeSchema.options]);

// status 탭 값은 REPORTS.status 생명주기 중 Figma 탭 4종 + 전체(파라미터 생략).
const statusSchema = z.enum(["전체", "AWAITING_ADOPTION", "COUNSELING", "NOT_SELECTED", "CLOSED"]);

export type ReviewStatusTabValue = z.infer<typeof statusSchema>;

export function useReviewFilter() {
  const pathname = usePathname();
  const params = useSearchParams();

  const type = typeSchema.safeParse(params.get("type")).data ?? "전체";
  const status = statusSchema.safeParse(params.get("status")).data ?? "전체";
  const region = params.get("region") ?? "전체";

  // 서버 데이터가 없는 순수 클라이언트 필터라 shallow routing으로 URL만 동기화.
  // (prod 정적 라우트에서 router.replace(pathname)가 쿼리 제거를 반영하지 않는 문제 회피)
  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value === "전체") next.delete(key);
    else next.set(key, value);
    const query = next.toString();
    window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname);
  };

  const setType = (value: string) => setParam("type", value);
  const setStatus = (value: string) => setParam("status", value);
  const setRegion = (value: string) => setParam("region", value);

  return { type, setType, status, setStatus, region, setRegion };
}
