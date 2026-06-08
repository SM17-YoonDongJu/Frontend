---
name: fe-integration-qa
description: 손해사정 플랫폼 프론트 통합 QA 방법론. 경계면 교차검증(MSW↔zod↔쿼리훅↔컴포넌트 shape 비교), typecheck/lint 실행, Playwright 행동 기반 테스트 작성. 기능 구현 후 검증·QA·통합 점검·회귀 확인 시 반드시 사용.
---

# 프론트 통합 QA 방법론

핵심: "파일이 존재하는가"가 아니라 **"인접 레이어의 shape이 일치하는가"**. 통합 버그는 단일 파일이 아니라 레이어 경계에서 난다. 각 모듈 완성 직후 점진적으로 검증한다(전체 완성 후 1회 몰아치기 X).

## 경계면 교차검증 (핵심)
두 레이어를 **동시에 열어** shape을 비교한다. 한쪽만 보면 못 잡는다.

| 경계 | 비교 방법 | 흔한 버그 |
|------|----------|----------|
| MSW 핸들러 ↔ zod 스키마 | 핸들러 응답 객체를 `schema.parse`에 넣어보기 | 필드명 오타, 누락 필드, enum 값 불일치 |
| zod `z.infer` ↔ 쿼리 훅 반환 | 훅 반환 타입이 스키마 타입과 같은가 | `parse` 누락→`any`, 배열/단건 혼동 |
| 훅 반환 ↔ 컴포넌트 소비 | 컴포넌트가 접근하는 필드가 타입에 있는가 | 없는 필드 접근, optional 미처리(`?.`), undefined 인덱스 |
| 쿼리키 ↔ 무효화 호출 | 뮤테이션 invalidate 키 == 쿼리 등록 키 | factory `_def` 범위 불일치 → 캐시 안 지워짐 |
| staleTime 정책 ↔ 화면 요구 | 폴링 화면이 staleTime 0 + refetchInterval 인가 | 리스트가 stale 안 됨 → 갱신 누락 |

**검증 절차:** 경계마다 양쪽 파일을 읽고 → shape 표로 정리 → 불일치를 버그로 기록. 추측 금지, 실제 코드 인용.

## 실행 검증 (증명)
추측하지 말고 실제 실행:
```
pnpm typecheck     # tsc --noEmit — 경계 타입 불일치 다수 여기서 잡힘
pnpm lint          # eslint — prefer-const, eqeqeq, no-console
```
- 실패 시 **에러 전문 인용** + 원인 레이어 지목. "통과했을 것"이라 쓰지 않는다.
- `noUncheckedIndexedAccess` 위반(배열 인덱스 undefined 미처리)은 흔하니 우선 확인.

## 행동 기반 테스트 (Playwright + MSW)
구현 세부가 아닌 **사용자 행동**으로 테스트(규칙: 구현보다 행동 기준).

> **전제 도구:** Playwright와 `pnpm test` 스크립트는 아직 미설치다(2026-06-09 기준). 행동 테스트를 처음 작성할 때 `pnpm --filter @insurance/web add -D @playwright/test` + `playwright.config.ts` + web `package.json`에 `"test": "playwright test"`를 추가한다. 환경 미비 단계에서는 아래 시나리오를 문서로만 명세하고 "실행 보류" 기록(거짓 통과 금지).
```ts
// 나쁨: expect(component.state.count).toBe(0)   ← 구현 결합
// 좋음: 사용자 관점
test("리포트 없으면 빈 상태 노출", async ({ page }) => {
  // MSW가 빈 배열 반환하도록 핸들러 override
  await page.goto("/내리포트");
  await expect(page.getByText("받은 리포트가 없어요")).toBeVisible();
});
test("분석신청 제출하면 결과로 이동", async ({ page }) => {
  await page.goto("/분석신청");
  // 사고유형 선택 → 입력 → 제출 → 결과 화면 검증
});
```
- MSW로 시나리오별 응답(빈/에러/정상)을 만들어 3상태를 모두 행동으로 검증.
- 환경 미비로 실행 못 하면 **시나리오를 문서로 명세**하고 "실행 보류 사유" 기록. 거짓 통과 보고 금지.

## 코드 컨벤션 리뷰
`code-conventions` 스킬 4원칙으로 리뷰. 동작이 맞아도 위반은 보고하되 분류:
- **blocker**: 동작 버그, 타입 에러, 경계 불일치, 데이터 유실
- **nit**: 컨벤션 위반(매직넘버, 네이밍, 과결합) — 권고

## 점진 검증 타이밍
- data-engineer 완료 직후 → 데이터 경계(MSW↔zod↔훅)부터
- ui-builder 완료 직후 → UI 경계(훅↔컴포넌트) + 3상태 존재
- 통합 후 → 행동 테스트 + 회귀(이전 QA에서 고친 버그 재발 여부)

## 리포트 형식
`_workspace/04_qa_<feature>.md`에 경계 검증표 + 실행 결과(인용) + 컨벤션 위반 + 테스트 결과 + blocker/nit 분류. 버그는 책임 에이전트(data-engineer/ui-builder)에게 직접 전달.
