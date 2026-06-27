---
name: figma-design-convert
description: 로컬 Figma Dev Mode MCP로 Node URL/선택 프레임을 프로젝트 컨벤션(@theme 토큰·프렉탈 배치·Tailwind v4·rem·Storybook) 코드로 변환한다. get_design_context로 색·폰트두께·fill 정답값을 읽어(추측 금지) raw 출력을 단일 진실에 매핑하고, 구현 화면을 찍어 Figma 스크린샷과 대조하는 닫힌 루프로 검증한다. "피그마 변환", "피그마 화면 코드로", "Figma 디자인 옮겨", figma 링크/선택 프레임을 코드로 만들 때 사용.
---

# 피그마 변환 (Figma → 프로젝트 컨벤션 코드)

로컬 **Figma Dev Mode MCP**로 디자인을 읽어 프로젝트 컨벤션 코드로 변환한다. 핵심 원칙은 **raw 출력 그대로 사용 금지**. 색·간격·네이밍을 프로젝트 단일 진실(`design-tokens.md`·`naming-dictionary.md`)에 매핑한 코드만 산출한다.

## 전제

- **로컬 Dev Mode MCP**(Figma 데스크톱 앱이 `localhost:3845`로 호스팅). 미연결이면 무성실패 말고 연결을 먼저 안내.
- 입력: **Figma Node URL**(`?node-id=...`) 또는 **선택된 프레임**. URL 우선(명시적 진실), 없으면 현재 선택.
- 착수 전 사용자에게 받을 것: **어느 라우트에 둘지** + **풀페이지인지 단일 컴포넌트인지**.

## 동작 흐름 (Figma Node URL을 받으면)

만들기 전에 먼저 확인한다. URL에서 node-id를 뽑아 `get_metadata`로 그 노드가 진짜 있는지 보고(없으면 멈추고 사용자에 묻는다), 지금 Figma에서 선택된 노드와 다르면 멈추고 어느 걸 만들지 확인한다. 화면 텍스트·컴포넌트명으로 이미 만든 화면인지 코드에서 grep해 있으면 또 만들지 말고 재사용한다. `component-build/references/design-tokens.md`를 먼저 보고, 사용자에게 어느 라우트에 둘지·풀페이지인지 컴포넌트 하나인지 받는다.

그다음 Figma에서 값을 읽는다. 도구 셋이 주는 게 다르다. `get_metadata`는 구조·텍스트·크기/위치(px)만 주고 색·폰트두께·fill·여백은 안 준다. `get_design_context`는 색(hex)·폰트명(굵기)·배경·padding·gap·radius·정렬을 준다. 색·굵기·배경은 반드시 여기서 읽는다(metadata만 보면 추측하게 된다). `get_screenshot`은 나중에 눈으로 맞춰볼 원본 그림이다. 페이지가 크면 통째로 읽지 말고 카드·패널 하나씩 `get_design_context`로 읽고, 생긴 게 다른 변형(추천 카드 vs 일반 카드 등)은 따로 읽는다. 빨간 ①②③ 같은 번호 마커·설계 메모는 화면 요소가 아니니 빼고 만든다.

읽은 값은 `figma-mapping.md` §0~§8 규칙으로 코드에 옮긴다. 색은 `@theme` 토큰 그대로(`#3c4856`은 `text-ink-2`)이고 배경색은 Figma에 칠해져 있을 때만 넣는다(없는 배경을 만들지 말 것). px는 rem으로(16px=1rem, `[Npx]` 금지, 1px 선만 px). 폰트는 굵기까지 옮긴다(`Inter:Semi_Bold`→`font-semibold`, 대충 `font-medium`으로 깔지 말 것). 가로·세로·간격은 flex·gap으로 하되 가운데·양끝 정렬은 Figma 그대로 두고, 버튼 글자·라벨도 Figma 문구 그대로 쓴다(줄이거나 바꾸지 말 것). 아이콘은 `shared/ui/icons`에서 갖다 쓰고 없으면 거기에 새로 만든다(페이지 안 인라인·Figma svg 금지). 컴포넌트는 프렉탈로 배치하고(`_components` vs `src/shared`) 공용이면 Storybook을 같이 둔다.

다 옮겼으면 화면을 띄워 Figma와 비교한다. dev 서버를 켜고 `apps/web/scripts/figma-shot.mjs`로 만든 화면을 캡처해(PNG는 보고 버린다, 커밋 X) `get_screenshot` 그림과 나란히 본다. 구조·정렬·글자를 먼저 보고, 그림으로 잘 안 보이는 색·굵기·배경은 `get_design_context` 값과 직접 맞춰본다. 안 맞으면 전체를 다시 만들지 말고 그 부분만 고치고, 두 번 고쳐도 안 되면 사용자에 알린다. 비교해서 맞을 때까지는 "완료"라고 하지 않는다.

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
