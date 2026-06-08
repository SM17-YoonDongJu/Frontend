---
name: react-query-data
description: 손해사정 플랫폼 데이터 레이어 구현 패턴. TanStack Query v5 훅, query-key-factory 쿼리키, staleTime/gcTime 정책표, zod DTO 스키마, MSW 모킹 핸들러. 데이터 페칭 훅·뮤테이션·스키마·목 핸들러를 만들 때 반드시 사용.
---

# 데이터 레이어 구현 패턴 (TanStack Query + zod + MSW)

대상: `@tanstack/react-query` v5 + `@lukemorales/query-key-factory` + `msw` + zod. 코드 컨벤션은 `code-conventions` 스킬과 함께 적용.

> **전제 도구:** `zod`는 아직 미설치다(2026-06-09 기준). 스키마를 처음 만들 때 `pnpm --filter @insurance/shared add zod`(공유) 또는 web 워크스페이스에 추가하고 진행한다. 설치 없이 `import {z}`를 쓰면 깨진다.

## 레이어 흐름 (단방향)
```
zod 스키마 (계약)  →  fetch 함수  →  쿼리 훅  →  컴포넌트(소비)
       ↑                                  └ MSW 핸들러가 같은 스키마 통과 shape 반환
```
스키마가 단일 진실. 타입은 `z.infer`로 도출하고 따로 interface를 또 쓰지 않는다(드리프트 방지).

## 1. zod 스키마 = 계약
```ts
import { z } from "zod";
export const reportSummarySchema = z.object({
  id: z.string(),
  type: z.string(),
  status: z.enum(["analyzing", "analyzed", "reviewed"]),
  estimateMin: z.number(),
  estimateMax: z.number(),
});
export type ReportSummary = z.infer<typeof reportSummarySchema>;
```
- 2개 이상 기능이 쓰면 `packages/shared/src/<domain>.ts`. 1곳만 쓰면 `features/<name>/model/<domain>.ts`.
- 응답 파싱 시 `schema.parse(json)`로 런타임 검증 — 백엔드 shape 어긋남을 경계에서 잡는다.

## 2. 쿼리키 = factory 패턴
```ts
import { createQueryKeys } from "@lukemorales/query-key-factory";
export const reportKeys = createQueryKeys("report", {
  list: (filter?: ReportFilter) => [{ filter }],
  detail: (id: string) => [id],
});
// 사용: reportKeys.detail(id).queryKey / .list().queryKey
```
- 문자열 배열 수기 작성 금지. 무효화도 같은 factory 키로: `queryClient.invalidateQueries({ queryKey: reportKeys.list._def })`.

## 3. staleTime / gcTime 정책 (규칙표 — 반드시 준수)
```
staleTime
├─ auth                           30 * 60 * 1000   (30분)
├─ 리포트 상세                     Infinity
├─ 손해사정 요청 리스트            0   (폴링: refetchInterval 설정)
├─ 사용자 손해사정 프로세스 확인   0   (폴링)
gcTime
├─ 기본                           30 * 60 * 1000   (30분)
├─ 상세                           60 * 60 * 1000   (1시간)
```
- 상수로 추출: `const STALE_TIME_AUTH = 30 * 60 * 1000;`. 폴링은 `refetchInterval`로 명시.

## 4. 쿼리 훅
```ts
export function useReportList(filter?: ReportFilter) {
  return useQuery({
    queryKey: reportKeys.list(filter).queryKey,
    queryFn: async () => {
      const res = await fetch(`/api/reports?...`);
      return reportSummarySchema.array().parse(await res.json());
    },
    staleTime: 0,
    refetchInterval: 5000, // 폴링 리스트
  });
}
```
- 훅은 `features/<name>/api/use<Thing>.ts`. 반환은 raw `useQuery` 결과(예측가능성: 같은 종류 훅은 같은 모양).
- 뮤테이션은 `onSuccess`에서 관련 키 무효화. 낙관적 업데이트는 폴링 리스트엔 불필요.

## 5. MSW 핸들러 = 계약 거울
```ts
// apps/web/src/shared/mocks/handlers.ts
import { http, HttpResponse } from "msw";
export const handlers = [
  http.get("/api/reports", () =>
    HttpResponse.json([
      { id: "r1", type: "auto", status: "analyzed", estimateMin: 100, estimateMax: 300 },
    ] satisfies ReportSummary[]) // 스키마와 같은 shape — 경계 버그 방지
  ),
];
```
- 핸들러 응답은 **반드시 같은 zod 스키마를 통과하는 shape**. `satisfies` 또는 `schema.parse`로 자기검증.
- 백엔드 API 미정이면 MSW가 계약을 고정한다(목 우선 개발). 핸들러 ↔ 훅 ↔ 컴포넌트 shape 3자 일치가 fe-qa 검증 대상.

## SSR/CSR 주의 (Next App Router)
- `getQueryClient()`는 서버/브라우저 분기 이미 구현됨(`shared/api/query-client.ts`). 새 QueryClient를 직접 만들지 않는다.
- 서버 프리페치가 필요하면 `dehydrate`/`HydrationBoundary` 패턴. CSR 전용 화면(마이·상세·폼)은 클라이언트 훅만으로 충분.
