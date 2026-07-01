---
name: frontend-feature
description: 손해사정 플랫폼 프론트엔드 기능을 에이전트 팀(fe-architect·ui-builder·data-engineer·fe-qa)으로 설계→구현→검증한다. 화면/페이지/컴포넌트/기능 개발, EPIC·스토리 구현, "분석신청 만들어", "검수화면 구현", "리포트 결과 페이지", 그리고 "다시 실행/재실행/수정/보완/이어서/부분만 다시" 같은 후속 요청 시 반드시 사용. 단순 질문·단일 파일 수정은 직접 처리 가능.
---

# frontend-feature 오케스트레이터

손해사정 보험 플랫폼(Next.js + RN 웹뷰 + TanStack Query + Tailwind) 프론트 기능을 **에이전트 팀**으로 개발한다. 누가(에이전트) 언제 어떤 순서로 협업하는지를 정의한다.

**실행 모드:** 에이전트 팀 (생성-검증 + 파이프라인 혼합)
**팀원 4 + 리더(나):** fe-architect → (ui-builder ∥ data-engineer) → fe-qa

## Phase 0: 컨텍스트 확인 (시작 시 필수)
`_workspace/` 존재 여부로 실행 모드 판별:
- **초기 실행**: `_workspace/` 없음 → 새로 만들고 전체 파이프라인.
- **부분 재실행**: `_workspace/` 있음 + 사용자가 특정 부분 수정 요청("UI만 다시", "스키마 고쳐") → 해당 에이전트만 재호출, 나머지 산출물 재사용.
- **새 실행**: `_workspace/` 있음 + 새 기능 입력 → 기존 `_workspace/`를 `_workspace_prev/`로 이동 후 초기 실행.

먼저 요청이 어느 경우인지 1줄로 판정하고 진행.

## Phase 1: 설계 (fe-architect 단독)
1. `TeamCreate`로 팀 구성, 4 에이전트 멤버 등록(모두 `model: "opus"`).
2. fe-architect에 기능 명세 작성 지시. Notion EPIC/스토리가 출처면 `mcp__notion__notion-fetch`로 읽게 하고, **API 계약(경로·메서드·응답 봉투·에러코드)은 `references/api-spec.md`**(+ 거기 적힌 조회법으로 API 명세서 Notion DB fetch), 도메인 의미는 `references/domain-glossary.md`(역할·플로우·상태·용어·컴플라이언스), 코드 식별자(필드·enum·ID타입·훅/쿼리키 이름)는 `references/naming-dictionary.md`를 먼저 읽게 한다.
3. 산출물: `_workspace/01_architect_<feature>.md` (라우트·렌더링·역할·프렉탈 세그먼트 코로케이션 구조·zod 계약·쿼리키·화면명세·검증포인트).
4. 계약에 `⚠️ 확인필요`가 있으면 리더가 사용자에게 확인 후 진행.
5. **`⚠️ 작명필요`**(사전에 없는 식별자)가 명세·로그에 있으면 리더가 후보를 모아 `AskUserQuestion`으로 **선택지 제시 → 사용자 확정 → `references/naming-dictionary.md`에 추가** 후 진행. 에이전트가 임의 작명한 채 넘어가지 않게 막는다.
6. **`⚠️ 명세없음`**(API 명세서 DB에 없는 엔드포인트)이 있으면 리더가 `AskUserQuestion`으로 사용자에게 확인한다(명세 누락인지/다른 경로로 있는지/미정인지). **사용자가 확정·Notion 추가하기 전까지 해당 호출의 zod·훅·MSW 구현 보류** — 가짜 경로로 진행 금지(사용자가 명시적으로 임시 진행을 허락한 경우만 예외).

## Phase 2: 구현 (ui-builder ∥ data-engineer 병렬)
**데이터 계약이 병렬의 열쇠.** 명세의 zod 계약·쿼리키가 확정되면 두 에이전트가 동시에 착수:
- `data-engineer`: zod 스키마 → 쿼리키(factory) → 훅(staleTime 규칙표) → MSW 핸들러. 훅/타입 export 경로를 ui-builder에 `SendMessage`로 통지.
- `ui-builder`: 페이지·라우트그룹·컴포넌트·3상태(로딩/빈/에러)·Tailwind. 데이터 타입은 data-engineer export를 import(재정의 금지). **착수 전 디자인 컴포넌트 문서 `component-build/references/design-tokens.md`를 먼저 읽고** 색·간격을 토큰/유틸로만 표현(raw hex 금지). **길이값은 rem(16px=1rem)·`[Npx]` 임의값 금지**(1px 보더 예외) — Figma 변환이 아니어도 항상 적용. Figma 디자인 입력이면 `figma-design-convert` 스킬로 변환.
- 시그니처 불일치는 두 에이전트가 `SendMessage`로 직접 조율(리더 경유 X).
- `TaskCreate`로 슬라이스별 작업 등록, 의존성(`addBlockedBy`)으로 순서 관리.

## Phase 3: 검증 (fe-qa, 점진적)
fe-qa는 `fe-integration-qa` 스킬 방법론으로 검증한다(경계면 교차검증 절차 + 행동 기반 Playwright).
- data-engineer 완료 직후 → 데이터 경계(MSW↔zod↔훅) 검증.
- ui-builder 완료 직후 → UI 경계(훅↔컴포넌트)+3상태 검증.
- `pnpm typecheck`·`pnpm lint` 실제 실행, 결과 인용.
- 행동 테스트(Playwright+MSW) 작성 또는 시나리오 명세.
- 산출물: `_workspace/04_qa_<feature>.md` (경계표 + 실행결과 + blocker/nit).
- blocker는 책임 에이전트에 직접 전달 → 수정 → 재검(루프).

## Phase 4: 종합 및 정리
1. fe-qa가 blocker 0 보고하면 리더가 결과 종합(만든 파일·미해결 nit·후속 제안).
2. 팀 정리: `SendMessage` shutdown_request로 graceful shutdown.
3. `_workspace/` 중간 산출물은 보존(감사·후속용), 최종 소스만 프로젝트 경로에 남김.
4. 사용자에게 피드백 요청: "결과·팀 구성·워크플로우에 바꿀 점?"

## 데이터 전달 프로토콜
- **태스크 기반**(`TaskCreate`/`TaskUpdate`): 슬라이스 작업·의존 추적.
- **파일 기반**(`_workspace/{phase}_{agent}_{feature}.md`): 명세·계약·QA 리포트.
- **메시지 기반**(`SendMessage`): 계약 통지·시그니처 조율·버그 전달.

## 에러 핸들링
- 에이전트 1회 재시도, 재실패 시 해당 산출물 없이 진행하고 리포트에 누락 명시.
- 계약 모호(`⚠️`) → 합리적 기본값 + 가정 주석, 사용자 확인.
- 상충 데이터(예: 명세 vs 기존 코드)는 삭제 말고 출처 병기 후 리더 판단.
- typecheck 실패는 blocker — 통과 전까지 Phase 4 진입 금지.

## 팀 크기
4 팀원(중규모). 팀원당 3~5 슬라이스. 기능이 크면(EPIC 전체) 스토리 단위로 쪼개 여러 라운드.

## 테스트 시나리오
**정상 흐름:** "EPIC 2 분석신청 만들어" → Phase 0 초기 판정 → fe-architect가 EPIC 2 fetch·슬라이스 명세 → data-engineer(분석신청 zod+훅+MSW) ∥ ui-builder((customer)/분석신청 페이지+단계폼+3상태) → fe-qa(경계검증+typecheck+행동테스트) → blocker 0 → 종합.

**에러 흐름:** ui-builder가 `report.estimateMax` 접근하는데 data-engineer 스키마엔 `estimateMaximum`. fe-qa가 MSW↔zod↔컴포넌트 교차검증서 shape 불일치 발견 → data-engineer에 직접 전달 → 스키마/핸들러 필드명 통일 → 재검 통과. (전체 완성 후가 아닌 ui 완료 직후 점진 검증이라 조기 발견.)
