"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { z } from "zod";
import { accidentTypeSchema } from "@/shared/model/accident-type";

// 사고 유형 필터 값은 명세 영문 enum + 전체.
const typeSchema = z.enum(["전체", ...accidentTypeSchema.options]);

// status 탭 값은 REPORTS.status 생명주기 중 Figma 탭 4종 + 전체(파라미터 생략) + 진행중 프리셋(헤더 진입용).
const statusSchema = z.enum([
  "전체",
  "AWAITING_ADOPTION",
  "COUNSELING",
  "NOT_SELECTED",
  "CLOSED",
  "진행중",
]);

export type ReviewStatusTabValue = z.infer<typeof statusSchema>;

// 백엔드가 status 다중값을 못 받아 프리셋은 클라이언트에서 이 상태들로 필터링.
export const REVIEW_STATUS_PRESETS: Record<string, string[]> = {
  진행중: ["AWAITING_ADOPTION", "COUNSELING"],
};

export function useReviewFilter() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const type = typeSchema.safeParse(params.get("type")).data ?? "전체";
  const status = statusSchema.safeParse(params.get("status")).data ?? "전체";
  const region = params.get("region") ?? "전체";

  // 목록 API 호출·클라이언트 필터에 쓸 실제 상태 배열(전체=undefined, 프리셋=다중, 단일=1개).
  const statusValues = REVIEW_STATUS_PRESETS[status] ?? (status === "전체" ? undefined : [status]);

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

  return { type, setType, status, setStatus, statusValues, region, setRegion, isPending };
}
