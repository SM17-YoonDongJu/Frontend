# insurance-platform

손해사정 보험 플랫폼 프론트 모노레포. Next.js(웹) + RN 전면 웹뷰 래퍼. 아키텍처: **프렉탈(라우트 코로케이션)** — app/ 라우트 트리에 세그먼트별 `_components/_hooks/_api/_model` 코로케이션, 중첩 라우트가 동일 구조 재귀. 전역 공유만 `src/shared`. (top-level `features/` 폐기 — Feature-Based/FSD 아님.)

## 하네스: 프론트엔드 기능 개발

**목표:** EPIC/스토리 → 설계·구현·통합검증을 에이전트 팀으로 일관되게 개발.

**트리거:** 화면·페이지·컴포넌트·기능 개발, EPIC/스토리 구현, 또는 "다시 실행/재실행/수정/보완/부분만 다시" 후속 요청 시 `frontend-feature` 스킬을 사용하라. 단순 질문·단일 파일 수정은 직접 응답.

**핵심 규칙 (상세는 .claude/skills/):**
- 폴더 배치·네이밍·4원칙(가독성·예측가능성·응집성·결합도) → `code-conventions`
- 쿼리키 factory + staleTime(auth 30분/상세 Infinity/리스트 0폴링)/gcTime(기본 30분/상세 1시간) + zod + MSW → `react-query-data`
- App Router·라우트그룹((customer)/(partner)/(auth))·Server/Client 경계·3상태 → `component-build`
- 테스트: Playwright + MSW, 구현 아닌 사용자 행동 기준 → `fe-integration-qa`
- 커밋 메시지: 커밋을 만들 때는 **반드시 `commit-style` 스킬을 먼저 호출**해 메시지를 작성한다(직접 임의 작성 금지).

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
| 2026-06-25 | API 명세 레퍼런스 추가 | frontend-feature/references/api-spec.md (+ fe-architect·data-engineer·frontend-feature 포인터) | Notion API 명세서 DB(경로·도메인·메서드)+전역 응답 봉투·에러코드 enum·base url을 단일 진실로 박음, 엔드포인트는 작업 시점 fetch·MSW가 봉투/에러코드 거울 모킹 |
| 2026-06-25 | API 계약 위반 차단 훅 추가 | .claude/hooks/api-spec-lint.sh, .claude/settings.json | _api/·handlers.ts·*.schema.ts 작성 시 에러코드 enum 외 값·실패 봉투 code 누락 감지해 PostToolUse로 차단·재작성 유도 |
| 2026-06-25 | 커밋 전 typecheck·lint 게이트 | .githooks/pre-commit, package.json(prepare), .gitattributes | .ts/.tsx 스테이징 시 커밋 직전 typecheck·lint 실행·실패 차단, core.hooksPath 자동 설정으로 팀 공유 |
| 2026-06-25 | Next.js 파일 컨벤션 레퍼런스 추가 | component-build/references/nextjs-file-conventions.md (+ component-build 포인터) | 공식 문서(Next.js 16) 기준 특수 파일(loading/error/not-found/forbidden/route 등) 정리, repo가 page/layout만 써 누락된 error 바운더리·404/403/401을 api-spec 에러코드와 연결, loading.tsx↔쿼리 isPending·error.tsx↔쿼리 isError 역할 분리 |
| 2026-06-25 | pr 스킬 삭제 | skills/pr/ 제거 | malformed(소문자 skill.md·frontmatter 없음) + 전역 commands/pr.md와 기능 중복 → 전역 명령으로 일원화 |
| 2026-06-25 | fe-integration-qa 스킬 배선 | fe-qa 에이전트, frontend-feature Phase 3 | 스킬이 CLAUDE.md 트리거에만 매핑되고 에이전트·오케스트레이터가 명시 호출 안 하던 갭 → 양쪽에 스킬 포인터 추가 |
| 2026-06-25 | 커밋 시 commit-style 스킬 필수 규칙 | CLAUDE.md 핵심 규칙 | 커밋 메시지를 임의 작성하지 말고 commit-style 스킬로 일관되게 작성하도록 강제 |
| 2026-06-25 | E2E 작성 레퍼런스 추가 + 드리프트 수정 | fe-integration-qa/references/e2e-authoring.md (+ SKILL 포인터) | 실제 스펙(apps/web/e2e/*)·playwright.config 기준 작성 패턴(파일구조·사용자셀렉터·toPass 하이드레이션 가드·기본 핸들러 MSW·헬퍼) 정리, "Playwright 미설치·pnpm test" 드리프트를 설치됨·test:e2e로 정정 |
| 2026-06-25 | 테스트 전략 E2E-only 확정 | fe-integration-qa(SKILL·e2e-authoring), commit-style | 단위·통합테스트 안 함(Vitest/RTL/Jest 미도입) 명시, 정적 레이어(TS·zod·api-spec훅·pre-commit)가 하위 대체, 고가치 빈/에러는 E2E 핸들러 override·저가치는 의식적 미테스트, 죽은 "RTL/통합테스트로 내림" 포인터 전수 제거 |
