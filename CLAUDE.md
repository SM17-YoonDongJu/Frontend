# insurance-platform

손해사정 보험 플랫폼 프론트 모노레포. Next.js(웹) + RN 전면 웹뷰 래퍼. 아키텍처: **Feature-Based**(app/features/shared 3계층, FSD 아님).

## 하네스: 프론트엔드 기능 개발

**목표:** EPIC/스토리 → 설계·구현·통합검증을 에이전트 팀으로 일관되게 개발.

**트리거:** 화면·페이지·컴포넌트·기능 개발, EPIC/스토리 구현, 또는 "다시 실행/재실행/수정/보완/부분만 다시" 후속 요청 시 `frontend-feature` 스킬을 사용하라. 단순 질문·단일 파일 수정은 직접 응답.

**핵심 규칙 (상세는 .claude/skills/):**
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
