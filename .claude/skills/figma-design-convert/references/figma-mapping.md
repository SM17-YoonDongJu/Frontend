# Figma → 프로젝트 컨벤션 변환 매핑

Figma Dev Mode MCP의 raw 출력(`get_code`/`get_variable_defs`)을 **그대로 쓰지 않는다**. 아래 규칙으로 프로젝트 단일 진실에 매핑한 코드만 산출한다. 토큰·식별자 출처는 `component-build/references/design-tokens.md`·`frontend-feature/references/naming-dictionary.md`가 우선이며, 이 문서는 "Figma 값을 그 진실로 어떻게 옮기나"만 정의한다.

## 1. 색 → `@theme` 토큰

`get_variable_defs`로 받은 Figma 색 변수/hex를 `design-tokens.md` 팔레트에 매핑한다. **인라인 hex·임의 색 금지.**

| Figma hex | 토큰 | 유틸 예 |
|-----------|------|---------|
| `#15202e` | `ink` | `text-ink` `bg-ink` |
| `#3c4856` | `ink-2` | `text-ink-2` |
| `#7b8693` | `ink-3` | `text-ink-3` (placeholder·캡션) |
| `#f4f1ea` | `paper` | `bg-paper` |
| `#ffffff` | `card` | `bg-card` |
| `#e6e0d4` | `line` | `border-line` |
| `#b0822e` | `gold` | `text-gold` `ring-gold` (강조·포커스) |
| `#2f6149` | `green` | 성공·완료 |
| `#b0492c` | `terra` | 위험·에러 |

- 팔레트에 **없는 색**이 Figma에 있으면 → 임의 hex 박지 말고, 먼저 `@theme`에 토큰 추가를 제안(사용자 확인). `--color-brand`(#2563eb)는 레거시이므로 매핑 대상 아님.
- 상태(hover/focus/disabled)는 색을 새로 만들지 말고 `design-tokens.md` §상태=유틸 표를 그대로 적용(`hover:brightness-[.96]`, `focus:ring-gold-soft` 등).

## 2. radius → 토큰

| Figma corner radius | 토큰 |
|---------------------|------|
| 6 / 7 / 9px | `rounded-tag` / `rounded-pill` / `rounded-chip` |
| 11 / 13px | `rounded-button` / `rounded-input` |
| 16 / 22px | `rounded-card` / `rounded-card-lg` |

가까운 토큰으로 스냅. 임의 `rounded-[5px]` 지양.

## 3. 폰트 → 토큰

- Title 계열(화면·금액 제목)만 `font-serif`(Gowun Batang). 본문·Label·UI는 기본 산세(유틸 미지정).
- 코드·수치·스펙 라벨은 `font-mono`. serif를 본문에 쓰지 않는다.

## 4. auto-layout → Tailwind v4

| Figma | Tailwind |
|-------|----------|
| auto-layout(가로) | `flex items-center gap-*` |
| auto-layout(세로) | `flex flex-col gap-*` |
| item spacing(px) | `gap-[Npx]` 또는 근사 스케일(`gap-2`=8px, `gap-3`=12px…) |
| padding | `p-*`/`px-*`/`py-*`, 비표준은 `p-[Npx]` |
| 절대좌표(no auto-layout) | 좌표 그대로 복사 금지 → flex/grid로 의미 재구성 |

px는 4의 배수면 스케일 유틸로, 아니면 임의값 유틸(`[Npx]`)로. 절대 위치는 최후수단.

## 5. 컴포넌트 → 프렉탈 배치

- 해당 라우트에서만 쓰면 그 세그먼트의 `_components/`에 코로케이션.
- 2개 이상 라우트가 공유하면 `src/shared`로 승격(`code-conventions` 판단).
- 공용 UI는 `<Name>.stories.tsx`를 **같은 커밋**에 동반(Storybook 규칙).
- Server/Client 경계·3상태(로딩/빈/에러)는 `component-build` 규칙을 따른다.

## 6. 네이밍

- 컴포넌트·prop·필드명은 `naming-dictionary.md`를 먼저 조회.
- 사전에 없는 식별자는 **임의 결정 금지** → 후보 여러 개로 사용자에게 질문 후 확정·사전 추가.
- Figma 레이어 이름(예: `Frame 427`)을 식별자로 그대로 쓰지 않는다.
