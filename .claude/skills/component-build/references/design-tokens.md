# 디자인 토큰 (바른보상 디자인 시스템)

Tailwind v4 주력. 토큰은 `apps/web/src/app/globals.css`의 `@theme`에 정의되어 있고 = **단일 진실**. 컴포넌트는 유틸 클래스로만 소비한다. **인라인 hex(`#15202e`)·임의 색 금지** — 토큰에 없는 값이 필요하면 먼저 `@theme`에 추가.

> Tailwind v4는 `@theme`의 `--color-*`/`--radius-*`/`--font-*`를 읽어 유틸을 자동 생성한다. `tailwind.config.js` 없음.
> **light 전용** — 디자인 시스템은 라이트 테마만 정의. `dark:` 변형 쓰지 않는다.
> 출처: 바른보상 디자인 시스템 번들 → 디코드본 `_design_primitives.jsx`(아토믹 원본 스펙).

## 컬러

| 토큰 | hex | 용도 |
|------|-----|------|
| `ink` | `#15202e` | 본문 텍스트·1차 액션 배경 |
| `ink-2` | `#3c4856` | 보조 텍스트 |
| `ink-3` | `#7b8693` | 흐린 텍스트·placeholder·캡션 |
| `paper` | `#f4f1ea` | 페이지 배경·ghost 버튼 |
| `paper-2` | `#fbf9f4` | 내부 타일·CTA 존 |
| `card` | `#ffffff` | 카드·인풋 표면 |
| `line` | `#e6e0d4` | 보더·구분선 |
| `line-2` | `#efeadf` | 약한 구분선 |
| `navy` | `#182740` | 로고·딥 surface |
| `gold` | `#b0822e` | 주요 강조·골드 액션·포커스 |
| `gold-2` | `#d8b25f` | 밝은 골드 악센트 |
| `gold-ink` | `#8a6420` | 골드 위 텍스트·키커 |
| `gold-soft` | `#f3e9d4` | 골드 배경 톤·포커스 링 |
| `green` | `#2f6149` | 성공·완료 |
| `green-soft` | `#e3eee7` | 성공 배경 톤 |
| `terra` | `#b0492c` | 위험·에러·danger 액션 |
| `terra-2` | `#e0987f` | 밝은 테라 악센트 |
| `terra-soft` | `#f6e7df` | 에러 배경 톤 |

`--color-brand`(`#2563eb`)는 레거시. 디자인 토큰은 위 팔레트를 쓴다.

## radius

| 토큰 | 값 | 용도 |
|------|-----|------|
| `rounded-tag` | 6px | 태그·근거 칩 |
| `rounded-pill` | 7px | pill·상태 칩 |
| `rounded-chip` | 9px | 칩 |
| `rounded-button` | 11px | 버튼 |
| `rounded-input` | 13px | 인풋·셀렉트·텍스트영역 |
| `rounded-card` | 16px | 카드 |
| `rounded-card-lg` | 22px | 큰 카드·딥 surface |

## 폰트

| 토큰 | 값 | 용도 |
|------|-----|------|
| `font-sans` | Inter | **본문·UI 기본**(Heading·Label·이름·버튼·태그). `layout.tsx`의 next/font로 로드(`--font-inter`), `body`에 `font-sans` 적용 = 전역 기본. 한글은 Inter에 글리프 없어 시스템 한글 산세로 폴백(Figma와 동일 동작) |
| `font-serif` | Gowun Batang | **Title 계열 전용**(화면·금액 제목·통계 수치). `layout.tsx`의 next/font로 로드(`--font-gowun-batang`) |
| `font-mono` | ui-monospace 계열 | 코드·수치·스펙 라벨 |

본문은 `font-sans`(Inter)가 전역 기본. serif를 본문에 쓰지 않는다. letter-spacing은 Figma 본문 기준 `-0.16px`(≈`tracking-[-0.01rem]`)을 컨테이너에 적용해 상속.

## 유틸 매핑

`@theme` 토큰 1개 → 관련 유틸 자동 생성. 예 `--color-ink`:
- `bg-ink` 배경 · `text-ink` 글자 · `border-ink` 테두리 · `ring-ink` 포커스 링 · `fill-ink`/`stroke-ink` SVG

```tsx
<div className="bg-card border border-line rounded-card text-ink">
<span className="bg-gold-soft text-gold-ink rounded-pill">  // 골드 톤 칩
```

## 상태 = 유틸 (전역 CSS 클래스 X)

원본 디자인 시스템은 `.bb-btn` 등 전역 클래스를 주입했지만, 이 프로젝트는 **Tailwind 유틸로 푼다**.

| 상태 | 유틸 |
|------|------|
| hover 어둡게 | `hover:brightness-[.96]` |
| disabled / loading | `disabled:opacity-[.42] disabled:cursor-not-allowed` |
| 인풋 focus 링 | `focus:border-gold focus:ring-[3px] focus:ring-gold-soft focus:outline-none` |
| 아이콘버튼 hover | `hover:bg-paper` |
| 로딩 스피너 | 내장 `animate-spin` (별도 keyframe 불필요) |
| 트랜지션 | `transition` |

```tsx
// 예: primary 버튼
<button className="bg-ink text-white rounded-button px-[18px] py-3 font-semibold transition hover:brightness-[.96] disabled:opacity-[.42] disabled:cursor-not-allowed">
```
