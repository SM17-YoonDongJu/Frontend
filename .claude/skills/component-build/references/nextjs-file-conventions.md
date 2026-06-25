# Next.js App Router 파일 컨벤션 (이 프로젝트 결정 기준)

대상: Next.js 16. 출처: nextjs.org/docs/app/api-reference/file-conventions (공식). 일반 설명이 아니라 **이 프로젝트가 어떤 특수 파일을 언제 쓰는지**의 기준이다. 지금 repo는 `page.tsx`·`layout.tsx`만 쓰고 나머지를 안 써서 생기는 구멍을 메운다.

## 특수 파일 한눈에
| 파일 | 서버/클라 | 핵심 |
|------|----------|------|
| `page.tsx` | 서버 기본 | 라우트 UI. 세그먼트를 공개 경로로 |
| `layout.tsx` | 서버 기본 | 공유 셸. 이동 간 **상태 보존**(리렌더 안 됨) |
| `loading.tsx` | 서버 기본 | 세그먼트를 **자동 `<Suspense>`** 로 감쌈 |
| `error.tsx` | **`"use client"` 필수** | 세그먼트를 **에러 바운더리**로 감쌈 |
| `not-found.tsx` | 서버 기본 | `notFound()` 호출 시 표시 |
| `forbidden.tsx`/`unauthorized.tsx` | 서버 기본 | `forbidden()`/`unauthorized()` 호출 시(403/401) |
| `route.ts` | 서버 | API 핸들러. **같은 세그먼트에 `page.tsx`와 공존 불가** |
| `template.tsx` | 서버 기본 | layout 같지만 **이동마다 새 인스턴스**(상태 리셋) |
| `default.tsx` | 서버 기본 | 병렬 라우트 `@slot` 미매칭 폴백 |
| `global-error.tsx` | `"use client"` 필수 | 루트 layout까지 감싸는 최상위 에러. 자체 `<html><body>` 필요 |

폴더: `[id]`(동적) · `[...slug]`(catch-all) · `[[...slug]]`(optional) · `(group)`(URL 미반영) · `@slot`(병렬) · `(.)`(인터셉트) · `_private`(라우팅 제외).

## 로딩: 두 층을 구분하라 (중요)
이 프로젝트는 데이터를 **클라이언트(TanStack Query)** 로 받는 화면이 많다. 로딩 표현이 두 종류이고 **섞으면 안 된다**:

- **`loading.tsx`** = *세그먼트(서버 렌더) 스트리밍* 로딩. 라우트 진입 직후 page가 준비될 때까지 자동 표시. `page.tsx`와 그 아래 중첩만 `<Suspense>`로 감싼다(같은 세그먼트 `layout`/`error`는 안 감쌈).
- **컴포넌트 내 `isPending` 스켈레톤** = *클라이언트 쿼리* 로딩. `useReportList()`의 `isPending`으로 그린다. 이건 기존 3상태 그대로 유지(맞는 패턴).

판단: **서버에서 데이터를 받아 page를 그리면 `loading.tsx`**, **마운트 후 쿼리 훅으로 받으면 컴포넌트 내 스켈레톤**. CSR 위주 화면은 후자가 기본이라 `loading.tsx`가 늘 필요하진 않다 — 라우트 전환 체감이 필요한 무거운 세그먼트에만 둔다.

**서버 prefetch 조합(`loading.tsx`가 제값 하는 유일한 자리):** `page.tsx`를 async 서버 컴포넌트로 두고 `await queryClient.prefetchQuery(...)` 후 `<HydrationBoundary state={dehydrate(queryClient)}>`로 감싸면 — 서버가 `await`에서 기다리는 동안 `loading.tsx`가 뜨고, 클라 컴포넌트는 캐시가 hydrate된 채 마운트돼 `isPending`이 처음부터 false(스켈레톤 안 깜빡). 두 로딩이 한 번으로 합쳐진다.
- **`await`가 핵심.** "이 데이터를 박은 채 page를 띄운다"가 의도면 `await`를 빠뜨리면 안 된다 — 빠지면 서버가 안 기다려 `loading.tsx`가 안 뜨고 결국 `isPending` 스켈레톤이 가린다(= 그냥 클라 패턴). 에러는 안 나서 조용히 효과만 사라지는 실수.
- **단, 의도적 `await` 생략이 정답인 경우도 있다:** ① 병렬 프리페치(여러 개를 await 없이 발사 후 `await Promise.all([...])`로 한 번에 대기), ② 스트리밍(핵심만 `await`로 가리고 부가 데이터는 fire-and-forget으로 클라에서 채움), ③ 캐시 워밍(다음에 갈 화면을 미리 prefetch — 지금 화면을 막으면 안 되므로 `await` 금지). 기준은 단 하나, **"이 page 렌더를 기다리게 할 것이냐"**.
- 서버 프리페치엔 `prefetchQuery`(에러 시 throw 안 함)를 쓴다. `fetchQuery`는 데이터를 반환하지만 에러 시 throw하므로 프리페치 용도엔 부적합.

## 에러: 렌더 예외 ≠ 쿼리 실패 (현재 가장 큰 구멍)
지금 repo엔 `error.tsx`가 **하나도 없다.** 그래서 컴포넌트 렌더 중 throw되면 잡을 바운더리가 없어 화면 전체가 깨진다. 두 층으로 나눠라:

- **`error.tsx`(클라이언트 필수)** = *렌더 중 던져진 예외*를 잡는 바운더리. 같은 세그먼트의 `page`·`loading`·`not-found`·중첩 `layout`을 감싸지만, **같은 세그먼트의 `layout`/`template`은 못 감싼다**(그건 부모 `error.tsx` 또는 `global-error.tsx`가 잡음).
- **컴포넌트 내 `isError`** = *쿼리 실패* UI(재시도 버튼). 기존 3상태 유지.

→ `isError`(쿼리 실패)는 그대로 두고, **세그먼트마다 `error.tsx`를 추가**해 렌더 예외 안전망을 깐다.

```tsx
// app/customer/report/[id]/error.tsx
"use client"; // 에러 바운더리는 클라이언트 컴포넌트여야 함

export default function ReportError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void; // 에러 상태 초기화 후 자식 재렌더(재요청은 안 함)
}) {
  return (
    <div role="alert">
      <p>리포트를 불러오는 중 문제가 발생했어요.</p>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
```
- 프로덕션에선 서버 컴포넌트가 던진 에러의 `message`가 가려지고 `error.digest`(해시)만 옴 — UI는 일반 문구로, 디버깅은 digest로 서버 로그 대조.
- 루트 `layout.tsx`에서 나는 에러는 `error.tsx`가 못 잡는다 → 필요 시 `app/global-error.tsx`(자체 `<html><body>` 포함).
- 카피는 컴플라이언스 주의: 단정적 보상·법률 뉘앙스 금지(domain-glossary).

## not-found / 403 / 401 = api-spec 에러코드와 연결
api-spec.md 에러코드를 받으면 화면도 표준 파일로 응답하라:

| 백엔드 code | 처리 | 파일 |
|------|------|------|
| `POST_NOT_FOUND` / `USER_NOT_FOUND` 등 404 | `notFound()` 호출 | `not-found.tsx` |
| `FORBIDDEN`(403) | `forbidden()` 호출 | `forbidden.tsx` |
| `LOGIN_REQUIRED`(401) | `unauthorized()` 호출 | `unauthorized.tsx` |

```tsx
// 서버 컴포넌트/route에서 없는 리소스면
import { notFound } from "next/navigation";
if (!report) notFound(); // 가장 가까운 not-found.tsx 표시
```
- `not-found.tsx`·`forbidden.tsx`·`unauthorized.tsx`는 **서버 컴포넌트**, props 없음. 트리거 함수(`notFound`/`forbidden`/`unauthorized`)는 `next/navigation`에서 import.
- 루트 `app/not-found.tsx`는 매칭 안 되는 URL 전역 404도 겸한다.
- 클라이언트에서 `usePathname` 등이 필요하면 not-found 안에서 클라이언트 데이터 페칭으로 처리.

## route.ts = API 핸들러
백엔드가 아직이거나 BFF/프록시가 필요할 때만. MSW 목 우선 개발이 기본이라 **자주 만들 일은 아니다.**
```ts
// app/api/.../route.ts  — page.tsx와 같은 세그먼트에 둘 수 없음
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;          // params는 Promise — 반드시 await
  return Response.json({ /* ... */ });   // api-spec 봉투 형태로
}
```
- 메서드: `GET POST PUT PATCH DELETE HEAD OPTIONS`. `OPTIONS` 미정의 시 자동 생성.
- 응답은 api-spec 전역 봉투(`{status,message,data}` / 실패 `{status,code,message}`)를 따른다.
- 타입: `RouteContext<'/users/[id]'>` 전역 헬퍼로 params 강타입(빌드 시 생성).

## template / default
- `template.tsx`: 이동마다 상태를 **초기화**해야 할 때만(예: 페이지 전환 애니메이션, 단계마다 리셋되는 폼). 기본은 `layout.tsx`(상태 보존). 둘 중 헷갈리면 layout.
- `default.tsx`: 병렬 라우트(`@slot`) 도입 시에만. 현재 구조엔 불필요.

## 배치 규칙
특수 파일은 **해당 라우트 세그먼트 폴더에 직접** 둔다(`_components/` 안 아님 — 라우팅 파일이라 세그먼트 루트). 세그먼트 전용 UI는 코로케이션(`_components/`), 라우팅 특수 파일은 세그먼트 루트.
