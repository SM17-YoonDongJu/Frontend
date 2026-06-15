---
name: code-conventions
description: 손해사정 플랫폼 프론트엔드 코드 컨벤션. 변경하기 쉬운 코드를 위한 4원칙(가독성·예측가능성·응집성·결합도) + 프로젝트 프렉탈(라우트 코로케이션) 폴더/네이밍 규칙. React/TS 컴포넌트·훅·모듈을 작성하거나 리뷰할 때 반드시 적용. "코드 컨벤션", "리뷰 기준", 폴더 배치(app 코로케이션·_shared·src/shared) 판단 시 사용.
---

# 프론트엔드 코드 컨벤션

좋은 프론트엔드 코드 = **변경하기 쉬운 코드**. 아래 4개 가치로 판단하되, 자주 충돌한다(예: 응집성 ↑ 위해 추상화하면 가독성 ↓). 충돌 시 "지금 이 코드에서 무엇이 더 자주 바뀌고 더 위험한가"로 우선순위를 정한다. 정답 1개가 아니라 트레이드오프를 의식적으로 선택하는 게 핵심.

## 1. 가독성 (Readability) — 코드가 읽기 쉬운가

- **매직 넘버 명명**: `setTimeout(animate, 300)` → `const ANIMATION_DELAY_MS = 300`. 값의 의미를 이름으로.
- **복잡 조건 변수화**: `if (user.role === 'partner' && report.status === 'pending' && !report.locked)` → `const canReview = ...; if (canReview)`. 이름이 의도를 설명.
- **시점 이동 줄이기**: 코드를 읽다 다른 파일/함수로 점프해야 이해되면 가독성 저하. 한 번에 한 맥락만 보이게. 단, 무지성 인라인화도 금물 — 추상화 레벨을 맞춘다.
- **삼항·중첩 줄이기**: 중첩 삼항은 if/early-return으로. 한 함수 안에서 추상화 레벨을 섞지 않는다(고수준 호출과 저수준 DOM 조작 혼재 금지).
- **구현 세부 감추기**: 컴포넌트는 "무엇을" 보여줄지만 드러내고 "어떻게"는 훅/유틸로.

## 2. 예측가능성 (Predictability) — 이름·시그니처로 동작을 예측 가능한가

- **이름과 동작 일치**: `getUser()`가 내부에서 로깅·전송 같은 부수효과를 숨기면 안 됨. 이름이 약속한 것만 한다.
- **반환 타입 일관**: 같은 종류 함수는 같은 모양 반환. 한 훅은 `{ data }`, 다른 훅은 raw 반환 같은 불일치 금지.
- **숨은 로직 금지**: 함수가 시그니처에 없는 일을 몰래 하지 않는다. validate 함수가 값을 변형하면 예측 불가.
- **고유 이름**: 같은 개념엔 같은 이름, 다른 개념엔 다른 이름. `fetchData`를 여기저기 다른 의미로 쓰지 않는다.

## 3. 응집성 (Cohesion) — 함께 바뀌는 것이 함께 있는가

- **함께 수정될 코드는 같은 디렉토리에**: 한 라우트 세그먼트의 컴포넌트·훅·타입·테스트는 그 세그먼트 폴더(`app/.../<segment>/_components`·`_hooks`·`_api`·`_model`) 안에. 종류별(모든 hook을 전역 hooks/에)이 아니라 **그 화면이 쓰는 위치별**로 묶는다.
- **폼 응집**: 폼의 필드·검증·제출 로직은 흩뿌리지 말고 한 단위로.
- **매직넘버·상수 동기화**: 관련 상수는 한 곳에 모아 함께 바뀌게.
- **과응집 경계**: 진짜 함께 바뀌는 것만 묶는다. 우연히 비슷한 코드를 억지 추상화하면 결합도가 오른다(아래 4번과 충돌 주의).

## 4. 결합도 (Coupling) — 한 곳 수정이 다른 곳에 번지지 않는가

- **성급한 추상화 경계**: 중복 제거가 항상 옳지 않다. 두 코드가 **다른 이유로 바뀐다면** 중복을 허용하는 게 결합도 측면에서 낫다. "비슷해 보임"이 아니라 "같은 이유로 변경됨"일 때만 합친다.
- **책임 분리**: 거대한 useEffect/거대 컴포넌트는 관심사별로 쪼갠다. 하나가 바뀌어도 나머지에 영향 없게.
- **Props Drilling 대신**: 깊은 prop 전달은 합성(composition)·context로 결합 완화.
- **형제 세그먼트 `_internal` 직접 import 금지**: 한 라우트 세그먼트가 다른 세그먼트의 `_components`/`_api`/`_model` 내부를 직접 import하면 강결합. 공유가 필요하면 **가장 가까운 공통 조상의 `_shared/`**(또는 앱 전역 `src/shared/`)로 올린다.

## 프로젝트 프렉탈(라우트 코로케이션) 배치 규칙

> 구조가 재귀 반복된다. 각 라우트 세그먼트가 자기 ui·훅·데이터·타입을 코로케이션으로 소유하고, 중첩 라우트는 같은 내부 형태를 반복한다. top-level `features/`를 두지 않는다(Feature-Based/FSD 아님 — entities/widgets/pages 계층도 없다).

```
src/
├─ app/                                     라우팅 + 코로케이션 트리
│  ├─ ()/ (customer)/ (partner)/ (auth)/       ← 라우트그룹 = 역할 경계
│  │  └─ <segment>/
│  │     ├─ page.tsx · layout.tsx           라우팅·셸 (비즈니스 로직 최소)
│  │     ├─ _components/                    세그먼트 전용 컴포넌트
│  │     ├─ _hooks/                         세그먼트 전용 훅
│  │     ├─ _api/                           쿼리·뮤테이션·keys(factory)
│  │     ├─ _model/                         zod 스키마·타입
│  │     └─ [param]/ · sub/                 하위 라우트 = 동일 구조 재귀
│  │  └─ _shared/                           그룹 국소 공유
└─ shared/   ui/ api/ hooks/ lib/ mocks/    앱 전역 공유(2곳+)
```
- `_` 접두 폴더 = Next.js 프라이빗 폴더(라우팅에서 제외). 코로케이션 메커니즘.
- 함께 바뀌는 코드는 그 세그먼트 폴더 안에 둔다(종류별 X, 위치별 O).

**배치 결정 트리:**
1. 라우팅/레이아웃/셸인가? → `app/.../page.tsx`·`layout.tsx`
2. 이 라우트 세그먼트 전용인가? → 같은 세그먼트의 `_components`/`_hooks`/`_api`/`_model`
3. 형제 세그먼트 2곳+이 공유하는가? → **가장 가까운 공통 조상의 `_shared/`로 승격**
4. 앱 전역(여러 그룹)에서 공유하는가? → `src/shared/`. **1곳만 쓰면 승격하지 말고 세그먼트 안에 둔다** (성급한 공유화 = 결합도 ↑).

**네이밍:**
- 컴포넌트 파일·이름: PascalCase (`ReportCard.tsx`)
- 훅: `use` 접두 camelCase (`useReportList.ts`)
- 상수: UPPER_SNAKE (`STALE_TIME_AUTH`)
- 라우트 폴더: kebab 또는 한글 경로는 영문 슬러그
- zod 스키마: `<domain>Schema`, 타입은 `z.infer`로 도출한 PascalCase
- **도메인 식별자(필드·enum·ID·훅/쿼리키 이름)는 `frontend-feature/references/naming-dictionary.md`가 단일 진실.** 같은 개념엔 같은 이름 — API 명세 필드명을 그대로 쓰고 임의 별칭 금지.

## 코드 스타일 (eslint/prettier 프리셋 준수)
- `prefer-const`, `eqeqeq: smart`, `no-console`(warn/error만 허용)
- TS strict + `noUncheckedIndexedAccess` — 배열 인덱스 접근은 undefined 가능성 처리
- import 별칭: `@/*`(web src), `@insurance/shared`, `@insurance/bridge`

## 리뷰 체크 (fe-qa용)
각 원칙당 "위반 → 어떻게 바뀌면 위험한가"로 지적. 동작이 맞아도 4가치 위반은 nit으로 보고하되 차단(blocker)과 구분한다.
