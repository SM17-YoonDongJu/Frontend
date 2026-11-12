"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { z } from "zod";
import { accidentTypeSchema } from "@/shared/model/accident-type";
import { isRegionFilterValue } from "../_model/region-filter-options";

// 사고 유형 필터 값은 명세 영문 enum + 전체.
const typeSchema = z.enum(["전체", ...accidentTypeSchema.options]);

// 이 목록 API는 검수 단계(AWAITING_INSPECTION·AWAITING_ADOPTION) 리포트만 돌려준다.
// 탭은 전체(파라미터 생략)와 AWAITING_ADOPTION만 둔다 — 나머지 상태는 늘 빈 목록이었다(#326).
const statusSchema = z.enum(["전체", "AWAITING_ADOPTION"]);

export type ReviewStatusTabValue = z.infer<typeof statusSchema>;

export function useReviewFilter() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const type = typeSchema.safeParse(params.get("type")).data ?? "전체";
  const status = statusSchema.safeParse(params.get("status")).data ?? "전체";
  // 목록에 없는 값(손으로 고친 URL·지원 종료된 옵션)은 전체로 본다 — select가 빈 값으로 어긋나지 않게.
  const regionParam = params.get("region") ?? "";
  const region = isRegionFilterValue(regionParam) ? regionParam : "전체";

  // 목록 API에 보낼 값. 전체는 파라미터를 생략한다.
  const statusFilter = status === "전체" ? undefined : status;
  const accidentTypeFilter = type === "전체" ? undefined : type;
  const regionFilter = region === "전체" ? undefined : region;

  // router.replace를 startTransition으로 감싸야 리스트 Suspense 재서스펜드 시
  // React가 기존 화면을 유지한 채 pending 처리한다(window.history 직접 조작은
  // React 트랜지션 경계 밖에서 반영돼 즉시 폴백으로 떨어짐).
  // 단, 쿼리가 완전히 비워지는 경우(전체 복귀)는 prod 정적 라우트에서
  // router.replace(pathname)가 쿼리 제거를 반영하지 않는 버그가 있어(#99)
  // 그 경로만 shallow routing(history.replaceState)으로 우회한다.
  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value === "전체") next.delete(key);
    else next.set(key, value);
    const query = next.toString();
    startTransition(() => {
      if (query) router.replace(`${pathname}?${query}`, { scroll: false });
      else window.history.replaceState(null, "", pathname);
    });
  };

  const setType = (value: string) => setParam("type", value);
  const setStatus = (value: string) => setParam("status", value);
  const setRegion = (value: string) => setParam("region", value);

  return {
    type,
    setType,
    status,
    setStatus,
    region,
    setRegion,
    statusFilter,
    accidentTypeFilter,
    regionFilter,
    isPending,
  };
}
