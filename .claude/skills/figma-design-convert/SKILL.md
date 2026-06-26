---
name: figma-design-convert
description: 로컬 Figma Dev Mode MCP로 선택한 프레임/노드를 프로젝트 컨벤션(@theme 토큰·프렉탈 배치·Tailwind v4·Storybook) 코드로 변환한다. Figma raw 출력을 그대로 쓰지 않고 디자인 토큰·네이밍 단일 진실에 매핑하며, Storybook 렌더의 계산스타일을 Figma 정확값과 대조해 검증한다. "피그마 변환", "피그마 화면 코드로", "Figma 디자인 옮겨", figma 링크/선택 프레임을 코드로 만들 때 사용.
---

# 피그마 변환 (Figma → 프로젝트 컨벤션 코드)

로컬 **Figma Dev Mode MCP**로 디자인을 읽어 프로젝트 컨벤션 코드로 변환한다. 핵심 원칙: **raw 출력 그대로 사용 금지** — 색·간격·네이밍을 프로젝트 단일 진실(`design-tokens.md`·`naming-dictionary.md`)에 매핑한 코드만 산출한다.

## 전제

- **로컬 Dev Mode MCP**(Figma 데스크톱 앱이 `localhost:3845`로 호스팅). 미연결이면 무성실패 말고 연결을 먼저 안내.
- 입력: **Figma에서 프레임 선택**(권장) 또는 selection 링크(`?node-id=...`) 복사. 선택 우선, 링크는 fallback.

## 동작 흐름

1. **조회** — Dev Mode MCP로 대상 노드 읽기:
   - `get_code` (구조·레이아웃), `get_variable_defs` (색·간격·타이포 변수), `get_image` (시각 대조용)
2. **매핑** — raw 출력을 `references/figma-mapping.md` 규칙으로 변환:
   - 색·radius·폰트 → `@theme` 토큰 (인라인 hex·임의값 금지)
   - auto-layout → Tailwind v4 flex/gap
   - 컴포넌트 → 프렉탈 배치(`_components` vs `src/shared`) + Storybook 스토리 동반
   - 네이밍 → `naming-dictionary` 우선, 없으면 임의결정 금지 → 사용자 질문
3. **검증** — `references/verification-gate.md`: Storybook 마운트 → Playwright `getComputedStyle` 추출 → Figma 정확값과 항목 대조. 불일치는 해당 항목만 재생성(상한 2회), 초과 시 사용자에 리포트.

## 참조 (단일 진실)

- 변환 매핑 규칙 → `references/figma-mapping.md`
- 검증 절차 → `references/verification-gate.md`
- 디자인 토큰(색·radius·폰트) → `component-build/references/design-tokens.md`
- 식별자 작명 → `frontend-feature/references/naming-dictionary.md`
- 컴포넌트 구현(Server/Client·3상태·접근성) → `component-build`, 4원칙·폴더배치 → `code-conventions`

## 산출 기준

- 색·간격이 전부 토큰/유틸로만 표현(raw hex 0건).
- 공용 UI는 `<Name>.stories.tsx` 동반(같은 커밋).
- 검증 게이트 통과(또는 불일치 리포트 제시) 없이 "완료" 처리 금지.
