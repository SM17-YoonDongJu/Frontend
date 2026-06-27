# insurance-platform

손해사정 보험 플랫폼 프론트 모노레포. Next.js(웹) + RN 전면 웹뷰 래퍼. 아키텍처: **프렉탈(라우트 코로케이션)** — app/ 라우트 트리에 세그먼트별 `_components/_hooks/_api/_model` 코로케이션, 중첩 라우트가 동일 구조 재귀. 전역 공유만 `src/shared`. (top-level `features/` 폐기 — Feature-Based/FSD 아님.)

## 하네스: 프론트엔드 기능 개발

**목표:** EPIC/스토리 → 설계·구현·통합검증을 에이전트 팀으로 일관되게 개발.

**트리거:** 화면·페이지·컴포넌트·기능 개발, EPIC/스토리 구현, 또는 "다시 실행/재실행/수정/보완/부분만 다시" 후속 요청 시 `frontend-feature` 스킬을 사용하라. 단순 질문·단일 파일 수정은 직접 응답.

**핵심 규칙 (상세는 .claude/skills/):**
- **작업 착수 전 디자인 컴포넌트 문서 `component-build/references/design-tokens.md`(색·radius·폰트 단일 진실) 필독** — raw hex·임의값 금지, `@theme` 토큰/유틸로만 표현. Figma 변환은 `figma-design-convert` 스킬
- 폴더 배치·네이밍·4원칙(가독성·예측가능성·응집성·결합도) → `code-conventions`
- 쿼리키 factory + staleTime(auth 30분/상세 Infinity/리스트 0폴링)/gcTime(기본 30분/상세 1시간) + zod + MSW → `react-query-data`
- App Router·라우트그룹((customer)/(partner)/(auth))·Server/Client 경계·3상태 → `component-build`
- 테스트: Playwright + MSW, 구현 아닌 사용자 행동 기준 → `fe-integration-qa`

**변경 이력:**
| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-06-09 | 초기 구성 (에이전트 4 + 스킬 5) | 전체 | - |
| 2026-06-09 | frontend-design 포인터 추가 + zod/Playwright 설치 노트 | ui-builder, component-build, react-query-data, fe-integration-qa | 갑 점검: 디자인 품질 가이드 연결, 전제 도구 미설치 무성실패 방지 |
| 2026-06-09 | commit-style 스킬 추가 | skills/commit-style | 팀 커밋 말투(Type : 한글 명사형) 반영 |
| 2026-06-09 | 도메인 용어집 추가 | skills/frontend-feature/references/domain-glossary.md | 하네스에 손해사정 도메인 지식 부재 → Notion 출처로 용어·플로우·상태·컴플라이언스 정리, fe-architect·ui-builder·fe-qa 연결 |
| 2026-06-09 | React 합성·재사용 패턴 reference 추가 | skills/component-build/references/react-patterns.md | custom hook·compound·render props를 4원칙으로 엮어 정리(context 제외) |
| 2026-06-09 | TMI 트림 | skills/component-build | 일반 a11y·Tailwind 상식 압축, 프로젝트 고유 규칙만 유지 |
| 2026-06-15 | 아키텍처 전환 Feature-Based→프렉탈(라우트 코로케이션) | CLAUDE.md, code-conventions, fe-architect, ui-builder, data-engineer, react-query-data, component-build, frontend-feature, react-patterns | top-level features/ 폐기, app 라우트 트리 코로케이션(_components/_hooks/_api/_model)·중첩 재귀·_shared 승격·전역 src/shared 유지로 결정 |
| 2026-06-15 | 식별자 사전 추가 | frontend-feature/references/naming-dictionary.md (+ fe-architect·ui-builder·data-engineer·code-conventions·frontend-feature 포인터) | API 명세 필드명을 단일 진실로 박아 변수·필드·enum·ID타입·훅/쿼리키 작명 통일, 명세 내 드리프트 4건 플래그 |
| 2026-06-16 | 디자인 토큰 이식 + 레퍼런스 추가 | globals.css(@theme 색·radius·폰트), layout.tsx(next/font Gowun Batang), component-build/references/design-tokens.md (+ component-build·ui-builder 포인터) | 바른보상 디자인 시스템 토큰을 Tailwind v4 @theme 단일 진실로 박음, 상태는 유틸로(전역 .bb-* X), light 전용 확정(dark: 폐기) |
| 2026-06-17 | Storybook 스토리 필수 규칙 추가 | component-build | 공용 UI 컴포넌트 작성 시 `<Name>.stories.tsx` 동반 작성·동일 커밋 포함, 페이지 임시 마운트 프리뷰 금지(스토리북 확인) |
| 2026-06-23 | 인터랙티브 중첩 금지 규칙 추가 | component-build(접근성) | PR #23 CodeRabbit 지적: `<Link><Button>` 중첩 인터랙티브 반복 → 링크형 버튼은 `<Link className={buttonVariants(...)}>` 단일 요소로, a/button 상호 중첩 금지 |
| 2026-06-27 | 피그마 변환 스킬 정의 | skills/figma-design-convert (SKILL + figma-mapping·verification-gate reference) | 이슈 #26: 로컬 Figma Dev Mode MCP 출력을 @theme 토큰·프렉탈·Storybook 컨벤션으로 매핑, 계산스타일 값 대조로 검증(픽셀/비전 비범위) |
| 2026-06-27 | 디자인 컴포넌트 문서 필독 규칙 추가 | CLAUDE.md, component-build, frontend-feature | 모든 화면·컴포넌트 작업 착수 전 design-tokens.md 선참조 강제(토큰 드리프트 방지) |
| 2026-06-27 | px→rem 변환 규칙 추가 | figma-design-convert/references/figma-mapping.md §4 | Figma가 px여도 길이값은 rem(16px=1rem) 변환 적용, `[Npx]` 임의값 금지(1px 보더 예외). 변환 검증 중 기존 코드 px 드리프트 확인 |
| 2026-06-27 | 본문 산세 폰트(Inter) 전역 연결 | layout.tsx(next/font Inter), globals.css(@theme --font-sans), design-tokens.md 폰트표 | Figma 변환 검증 게이트가 본문 폰트 불일치 검출 — 프로젝트에 base 산세 미연결로 전 화면 시스템폰트 렌더. Inter를 body 기본(font-sans)으로 박음(한글은 시스템 폴백=Figma 동일). letter-spacing -0.16px≈tracking-[-0.01rem] 규칙 명시 |
| 2026-06-27 | 검증 게이트 사각지대 한정 추가 | figma-design-convert/references/verification-gate.md | 값 게이트(13항목)는 요소별 계산스타일만 봄 — 레이아웃/구조 불일치는 못 잡음. 변환 전후 전체 스크린샷 대조 + 구조 다른 변형은 각각 raw 조회 후 게이트 등록 강제(추측 스펙 금지). 추천 카드 가로형 구조 누락 사례 반영 |
| 2026-06-27 | 정렬축·표시텍스트 규칙 추가 | figma-design-convert/references/figma-mapping.md §4·§7 | §4: auto-layout 정렬축(justify/items/text-center)을 Figma에서 그대로 읽고 기본 좌/상단으로 깔지 말 것(히어로 중앙정렬 누락 사례). §7 신설: 라벨·버튼 문구·수치 표기는 Figma 문자열 그대로(의역·축약 금지, 변형별 문구 보존) |
| 2026-06-27 | 검증 게이트 스크린샷 대조 우선 재편 + 샷 헬퍼 | verification-gate.md, SKILL.md, apps/web/scripts/figma-shot.mjs, .gitignore | 게이트 1순위를 "구현 샷 ↔ Figma get_screenshot 대조"로(미스 대부분 여기서 잡힘), 값 측정은 폰트 미로드 의심 시 선택. 재사용 샷 헬퍼 추가(값 하드코딩 0, URL+selector→PNG). PNG 일회용(찍고 삭제, gitignore로 커밋 차단). "Playwright 스크립트 추후 커밋" hedge 제거 — 페이지마다 기대값 달라 범용 값-스크립트는 불필요로 판정. 실행 함정(node는 PowerShell·apps/web 모듈해석·dev서버 선행) 명시 |
