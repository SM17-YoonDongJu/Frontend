# Figma → 프로젝트 컨벤션 변환 매핑

Figma Dev Mode MCP의 raw 출력(`get_code`/`get_variable_defs`)을 **그대로 쓰지 않는다**. 아래 규칙으로 프로젝트 단일 진실에 매핑한 코드만 산출한다. 토큰·식별자 출처는 `component-build/references/design-tokens.md`·`frontend-feature/references/naming-dictionary.md`가 우선이며, 이 문서는 "Figma 값을 그 진실로 어떻게 옮기나"만 정의한다.

## 0. 스타일 진실은 `get_design_context` — 추측 금지 (최우선)

**색·폰트두께·배경/fill·정렬은 반드시 해당 노드의 `get_design_context`에서 읽는다. `get_metadata`나 프롬프트 산문으로 추측 금지.**

- `get_metadata`는 **구조·좌표·크기·텍스트만** 준다 — **색·폰트두께·fill 정보가 없다.** metadata만 보고 색/두께/배경을 채우면 전부 추측이 된다(가장 흔한 드리프트 원인).
- 큰 페이지는 한 번에 못 읽으니 **섹션(카드/패널) 단위로 `get_design_context`를 뽑고, 그 출력의 실제 값으로 그 섹션을 작성**한 뒤 다음 섹션으로. 산문 브리프가 "navy 강조/serif 금액"이라 해도 **실제 hex·폰트명을 design_context에서 확인**해 토큰을 정한다.
- 스크린샷 게이트는 구조·정렬은 잡지만 **색/두께/배경 미세 오류는 잘 안 잡힌다** → design_context 값과 직접 대조가 유일한 방어.

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
- **텍스트 색은 그 text 노드의 hex 그대로 매핑**한다(추측 금지). 예: 금액이 `#3c4856`면 `text-ink-2`지 `text-ink` 아님. 비슷한 ink/ink-2/ink-3, paper/paper-2/card 혼동 주의.
- **fill 없으면 배경 넣지 말 것.** Figma 노드에 fill(배경색)이 **있을 때만** `bg-*`를 단다. Figma에 없는 장식용 pill·박스·테두리를 발명하지 말 것(예: fill 없는 라벨에 `bg-paper-2 rounded-pill`을 임의로 붙이는 것 금지). 투명 배경은 투명으로 둔다.
- 추가 색 매핑: `#fbf9f4`→`paper-2`, `#efeadf`→`line-2`, `#182740`→`navy`, `#8a6420`→`gold-ink`, `#d8b25f`→`gold-2`, `#f3e9d4`→`gold-soft`, `#e3eee7`→`green-soft`, `#f6e7df`→`terra-soft`.

## 2. radius → 토큰

| Figma corner radius | 토큰 |
|---------------------|------|
| 6 / 7 / 9px | `rounded-tag` / `rounded-pill` / `rounded-chip` |
| 11 / 13px | `rounded-button` / `rounded-input` |
| 16 / 22px | `rounded-card` / `rounded-card-lg` |

가까운 토큰으로 스냅. 임의 `rounded-[5px]` 지양.

## 3. 폰트 → 토큰 (family + **weight**)

**family** — Figma 폰트명 앞부분으로 판별:
- `Gowun_Batang:*` → `font-serif`. Title 계열(화면·금액 제목·통계 수치)에만. 본문·Label·UI는 기본 산세(`Inter:*`, 유틸 미지정 — body 기본이 Inter).
- 코드·스펙 라벨만 `font-mono`. serif를 본문에 쓰지 않는다.

**weight** — Figma 폰트명 뒷부분을 유틸로 그대로 옮긴다(추측·뭉개기 금지. `Semi_Bold`를 `font-medium`으로 깔지 말 것):

| Figma 폰트명 | 유틸 |
|-------------|------|
| `*:Bold` (`Inter:Bold`, `Gowun_Batang:Bold`) | `font-bold` |
| `*:Semi_Bold` | `font-semibold` |
| `*:Medium` | `font-medium` |
| `*:Regular` | (미지정) |

- 예: `Gowun_Batang:Bold` 금액 → `font-serif font-bold`. `Inter:Semi_Bold` 라벨 → `font-semibold`.

## 4. auto-layout → Tailwind v4 (+ px → rem 변환)

**Figma는 px로 표기되지만, 우리는 길이값을 rem으로 변환해 적용한다.** 루트 폰트사이즈 오버라이드 없음 → **기준 16px = 1rem**. 변환식: `rem = px / 16`.

| Figma | Tailwind |
|-------|----------|
| auto-layout(가로) | `flex items-center gap-*` |
| auto-layout(세로) | `flex flex-col gap-*` |
| item spacing / padding / size | 스케일 유틸 우선, 안 맞으면 **rem 임의값**(`gap-[0.875rem]`) — `[Npx]` 금지 |
| 절대좌표(no auto-layout) | 좌표 그대로 복사 금지 → flex/grid로 의미 재구성 |

- **스케일 유틸이 값에 맞으면 그걸 우선**(이미 rem 기반: `gap-4`=1rem, `p-5`=1.25rem, `text-2xl`=1.5rem). 값이 스케일과 어긋나면 **rem 임의값 유틸**(`p-[1.3125rem]`, `text-[0.8rem]`)로. **`[Npx]` 임의값은 쓰지 않는다.**
- 변환 예: 14px→`0.875rem`, 12.8px→`0.8rem`, 13px→`0.8125rem`, 21px→`1.3125rem`, 46px→`2.875rem`.
- **예외 — 1px hairline(보더·구분선)은 px 유지**(`border`, `h-px`). rem 환산 시 서브픽셀 반올림으로 선이 흐려진다.
- 절대 위치는 최후수단.
- **정렬축을 Figma에서 그대로 읽어라 — 기본 좌/상단으로 깔지 말 것.** auto-layout의 primary/counter axis 정렬을 확인해 매핑: 가운데=`justify-center`/`items-center`/`text-center`, 양끝=`justify-between`, 우측=`justify-end`/`items-end`. `get_design_context` 코드의 `items-*`/`justify-*`/`text-center`를 누락 없이 옮긴다(히어로 통계 등 중앙정렬 자주 놓침).

## 5. 컴포넌트 → 프렉탈 배치

- 해당 라우트에서만 쓰면 그 세그먼트의 `_components/`에 코로케이션.
- 2개 이상 라우트가 공유하면 `src/shared`로 승격(`code-conventions` 판단).
- 공용 UI는 `<Name>.stories.tsx`를 **같은 커밋**에 동반(Storybook 규칙).
- Server/Client 경계·3상태(로딩/빈/에러)는 `component-build` 규칙을 따른다.

## 6. 네이밍

- 컴포넌트·prop·필드명은 `naming-dictionary.md`를 먼저 조회.
- 사전에 없는 식별자는 **임의 결정 금지** → 후보 여러 개로 사용자에게 질문 후 확정·사전 추가.
- Figma 레이어 이름(예: `Frame 427`)을 식별자로 그대로 쓰지 않는다.

## 7. 표시 텍스트 — Figma 문자열 그대로

화면에 보이는 텍스트(라벨·버튼 문구·수치 표기·접미사)는 **Figma 표시 문자열을 글자 그대로** 옮긴다. 식별자(§6)와 달리 표시 텍스트는 의역·축약·추가 금지.

- 버튼 "상담"을 "상담 신청"으로 늘리거나, 이름 "정우성 사정사"에서 "사정사"를 빼지 말 것. 변형(variant)마다 문구가 다르면(추천=`상담 신청`, 일반=`상담`) 각각 그대로 둔다.
- 수치 표기도 그대로: `410+`를 `410명+`로 바꾸지 말 것.
- mock 데이터에 넣을 때도 Figma 원문을 그대로 박는다(컴포넌트에서 접미사 임의 합성 금지).

## 8. 아이콘 → 기존 공용 아이콘 재사용

- **먼저 `apps/web/src/shared/ui/icons/`를 검색해 의미로 재사용한다**(예: 문서=`FileText`, 알림=`Bell`, 사용자=`User`, 경고=`AlertTriangle`, 추세=`TrendingUp`, 저울=`Scale`, 체브론=`ChevronDown`/`Chevron`). 있는 걸 두고 새로 만들지 말 것.
- 없으면 **`shared/ui/icons/`에 새 컴포넌트로 추가**(currentColor 인라인 svg). 페이지 `_components/icons.tsx` 같은 **로컬 인라인 아이콘 모음 금지**(재사용·일관성 깨짐).
- **Figma의 localhost svg(`imgVector`/`http://localhost:3845/...`)를 그대로 쓰지 말 것** — Figma 아이콘은 이름 없는 vector라 정체를 문맥으로 판별(이 노드가 무슨 아이콘인지)해 위 공용 아이콘에 매핑한다.
- 아이콘 크기·색도 §0대로 design_context 값 사용(`size-*`는 rem, 색은 토큰).
