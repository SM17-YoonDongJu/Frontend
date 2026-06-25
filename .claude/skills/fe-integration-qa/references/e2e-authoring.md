# E2E 작성 패턴 (Playwright + MSW)

이 repo에서 E2E 스펙을 **실제로 어떻게 짜는지**. 무엇을 E2E로 올릴지(범위·CUJ)는 `SKILL.md`의 "E2E 범위 규칙"을 먼저 보고, 여기선 *올리기로 정한 흐름을 어떻게 쓰는지*만 다룬다. 기존 스펙(`apps/web/e2e/*.spec.ts`)이 단일 진실 — 새 스펙은 이 패턴에 맞춘다.

## 환경·실행
- 위치: `apps/web/e2e/<feature>.spec.ts`. import는 `import { expect, test } from "@playwright/test";`
- 실행: `pnpm --filter @insurance/web test:e2e`. config(`playwright.config.ts`)가 `pnpm dev`를 webServer로 띄우고(`reuseExistingServer` 로컬), `chromium`·`webkit`·`edge` 3개 프로젝트에서 `fullyParallel`로 돈다.
- **데이터는 앱의 MSW 워커가 제공**(별도 목 서버 X). dev 모드에서 MSW가 기본 핸들러 응답을 준다. baseURL은 `PLAYWRIGHT_BASE_URL`로 덮어쓸 수 있다(포트 충돌 시).

## 스펙 파일 구조
파일 맨 위 JSDoc에 **무엇/이슈번호/원칙/응답 출처/정적 위임(미테스트)한 것**을 적는다. 라우트는 `const PATH` 상수로.
```ts
/**
 * 받은 제안 목록 E2E (happy-path, 이슈 #18).
 * 원칙: 핵심 사용자 흐름만 — 목록 열람 / 거절 / 검수 의견 보기 이동.
 * 응답은 기본 MSW 핸들러가 제공(목록 3건, 거절 성공).
 * 빈 상태·거절 실패 롤백 중 고가치는 핸들러 override로 이 스펙에 추가, 저가치 형식 검증은 zod·TS에 위임(미테스트).
 */
const PATH = "/customer/proposals/test-id-123";
```
테스트명은 **한글 사용자 행동 문장**("~하면 ~가 보인다/된다/이동한다"). 구현어(state·props·함수명) 금지.

## 셀렉터 — 사용자가 보는 것으로만
DOM 구조는 쉽게 바뀐다. 거기 의존하면 테스트가 깨진다. **역할·텍스트·라벨 기반만** 쓴다.
- `getByRole("heading"|"radio"|"button"|"listitem", { name: /정규식/ })`, `{ exact: true }`로 정확매칭.
- `getByText(...)`, `getByPlaceholder(...)`.
- **CSS 클래스·XPath·`data-*` 남발 금지** — 스타일 바뀌면 깨진다.
- 좁히기는 **체이닝+필터**로: `page.getByRole("listitem").filter({ hasText: "김도현" })` → 그 안에서 `.getByRole("button", { name: "거절" })`.

## 단언·대기 — web-first, 고정 sleep 금지
자동 대기·재시도하는 단언을 쓴다. 동기 검사(`isVisible()`)나 `waitForTimeout`/sleep은 금지(타이밍 깨짐).
- 노출: `await expect(locator).toBeVisible()` / 숨김: `toBeHidden()`
- 부재: `await expect(locator).toHaveCount(0)` (액션 버튼 사라짐 등)
- 이동: `await expect(page).toHaveURL(/\/customer\/report\/test-id-123/)`
- 속성: `await expect(card).toHaveAttribute("aria-checked", "true")`

**하이드레이션·내비 유실 가드(`toPass`):** 첫 상호작용이 하이드레이션 전이라 클릭이 유실되거나, 클릭 후 라우팅이 늦을 수 있다. 클릭+검증을 묶어 재시도:
```ts
await expect(async () => {
  await medicalCard.click();
  await expect(medicalCard).toHaveAttribute("aria-checked", "true");
}).toPass({ timeout: 10000 });
```
내비게이션도 동일: `expect(async () => { await link.click(); await expect(page).toHaveURL(/.../); }).toPass(...)`.

## 격리 — 각 테스트는 독립
- 테스트마다 `await page.goto(PATH)`로 fresh 진입. 테스트 간 상태(쿠키·스토리지·순서) 공유 금지.
- 반복 준비는 `beforeEach`나 헬퍼로 빼되, 각 테스트는 **혼자서도 통과**해야 한다.
- 다단계 흐름(퍼널 등)은 헬퍼 함수로 추출:
```ts
async function fillThroughConsent(page: import("@playwright/test").Page) {
  // step1~6을 사용자 행동대로 채워 제출 직전까지 진행
}
```

## MSW — 기본 핸들러 + 고가치 상태는 override
이 프로젝트는 단위·통합테스트가 없어 **빈/에러/롤백도 내려보낼 하위 레이어가 없다.** 그래서 E2E가 떠안되, 가치 있는 것만:
- **happy-path**: 기본 MSW 핸들러 응답을 그대로 쓴다(override 불필요).
- **고가치 빈/에러/롤백**(사용자에게 실제 보이고 깨지면 신뢰 직타): 해당 테스트에서 **핸들러를 override**해 그 상태를 강제 검증한다. Playwright의 `page.route(...)`로 응답을 가로채거나, 앱 MSW 워커에 시나리오를 주입하는 방식.
- **저가치 엣지**(형식 검증·드문 에러 분기): E2E에 넣지 말고 **정적 레이어(zod·TS)에 위임 = 의식적 미테스트**. 스펙 JSDoc에 "정적 위임"으로 기록(갈 곳 없는 "통합테스트로 내림" 표현 금지).
- E2E는 유일한 런타임망이라 비대해지면 *전부* 느려지고 깨진다 — 고가치만 선별.

## 안티패턴 (하지 말 것)
- 구현 세부 단언(`component.state`, 내부 함수 호출 여부) — 사용자가 보는 결과로만.
- CSS 클래스/XPath 셀렉터, `data-*` 남발.
- `waitForTimeout`·고정 sleep — web-first 단언으로 대체.
- 통제 못 하는 서드파티(외부 사이트/PG/OAuth 실호출) 테스트 — 계약은 MSW로 고정.
- 저가치 필드 검증·드문 엣지를 E2E에 욱여넣기 — zod·TS에 위임(의식적 미테스트). 고가치 에러만 override로 E2E.
- `await` 누락 — `@typescript-eslint/no-floating-promises`로 잡는다.
