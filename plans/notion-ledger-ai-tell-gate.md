# Plan v3 — Notion 단일진실 로그(보류·API협의) + ai-tell 차단 훅 + `notion-log` 스킬

작성 2026-07-09. 상태: **계획 확정, 실행 대기**.

## 목표
1. **보류 항목** → Notion "보류 문서" 페이지 인라인 DB에 기록 (SSOT)
2. **백엔드 API 협의 사항** → Notion "tempr" 페이지 인라인 DB에 `날짜·PR·무엇` 구조로 기록 (SSOT)
3. **사람이 보는 산출물(PR·이슈·위 두 Notion 문서)** → ai-tell 검사 통과 후에만 게시 (차단 훅으로 강제)

## 🔒 확정된 결정 (locked)
- **Notion = 단일 진실.** 로컬 `fe-skill-backlog` 메모리·`.pr-assets/api-spec-draft-*`는 SSOT 아님 → Notion 포인터/스크래치로 강등.
- **ai-tell = 무조건 차단 훅.** 규칙만 아니라 게시를 실제로 막음.
- **로깅 = 새 독립 스킬 `notion-log`.** 기존 스킬 흡수 X.
- **훅 차단 범위 = Notion 두 로그 문서만** (+ gh 이슈·PR은 항상). 팀 스페이스 전체 X(오탐 방지).
- **보류 정의 확정** (아래 Part A).

---

## Part A — 보류 로그 DB
**위치:** 페이지 "프론트엔드 개발중 생긴 보류 문서" (`39830798f08f805d9609db8131135c1a`, 현재 비어 있음) 하위 인라인 DB.

**스키마 (DDL 초안):**
```sql
CREATE TABLE (
  "항목" TITLE,
  "유형" SELECT('스킬':blue, '기능':green, 'API':purple, '리팩터':orange, '인프라':gray, '기타':default),
  "상태" SELECT('보류':yellow, '재개대기':blue, '진행중':green, '완료':green, '폐기':gray),
  "사유" RICH_TEXT,
  "재개 조건" RICH_TEXT,
  "관련 PR·이슈" RICH_TEXT,
  "우선순위" SELECT('높음':red, '중간':yellow, '낮음':gray),
  "기록일" CREATED_TIME
)
```
- 뷰: 상태별 **보드뷰**(칸반) 추가.

**"보류"의 정의 (기록 대상):** 프론트 개발 중 *할 가치는 있으나 지금은 안 하기로 의식적으로 미룬 일*. 미루기로 **결정하는 순간** 기록. 각 행에 **사유 + 재개조건** 필수.
- 스킬 후보(화면 착수 전 보류): pr-capture · form-funnel · auth-rbac · seo-ssg · erd-audit · git-flow-win
- 기능 구현 보류(방식 확정·구현 미룸): 리포트 PDF 저장 · 공유 기능(스텁)
- 리팩터/정리 보류, 범위 밖 제외("디자인 토큰 별도 이슈", "이 기능은 #22에서")

**보류 ❌ (다른 데로):** 백엔드 확정 대기 API/명세 → Part B(협의). 진행 중 작업 → 그냥 진행.

**갈림길 규칙:** 보류 = "FE가 나중에" (재개조건=우리 상황). 협의 = "백엔드 답 있어야 진행" (대기=그쪽 확정). 예) 명세에 없어서 못 만듦 → 협의. 명세는 있으나 이번 스프린트 밖 → 보류.

**초기 이관:** `fe-skill-backlog` 보류분 전량 → 행으로.

---

## Part B — 백엔드 API 협의 로그 DB
**위치:** 페이지 "tempr" (`39530798f08f803baa61e751f8d0a6c2`) → 이름 **"백엔드 API 협의 로그"**로 변경 + 인라인 DB.

**스키마 (DDL 초안):**
```sql
CREATE TABLE (
  "협의 항목" TITLE,
  "관련 PR·이슈" RICH_TEXT,
  "엔드포인트" RICH_TEXT,
  "도메인" SELECT('auth', 'user', 'settings', 'report', 'review', 'matching', 'chat', 'payment', 'admin'),
  "상태" SELECT('협의 필요':red, '확정 대기':yellow, '확정됨':green, '반영 완료':blue),
  "날짜" DATE
)
```
- 구체 근거(ERD·필드별 사유)는 **각 행 페이지 본문**에.

**초기 이관:** 현재 tempr의 채팅(#48) 자유텍스트 → 3행으로 분해:
1. `채팅 목록 응답 필드 확장` (GET /chats · chat · 협의 필요 · #48) — 본문에 adjusterId/reportId/roomStatus/lastMessageAt/participants 폐기 근거
2. `409 CLOSED 에러코드 전역 enum 등재` (전역 · 협의 필요 · #48)
3. `senderId 타입 확정(uuid vs /users/me userId number)` (GET /chats·/users/me · 협의 필요 · #48)

---

## Part C — `notion-log` 스킬 (신규)
**역할:** 두 Notion 로그의 **스키마·상태 흐름·append 규칙·기록 트리거**를 소유. `api-spec-notion`은 초안 작성만 하고, "협의 항목 기록"은 이 스킬에 위임(합성).

**트리거:**
- 보류 결정 → 보류 DB에 행 추가(항목·유형·사유·재개조건·우선순위)
- `⚠️ 협의필요`/`명세없음` 플래그 → API협의 DB에 행 추가(+본문 근거)
- 상태 변화(재개·확정·반영) 시 해당 행 상태 업데이트

**기록 = 에이전트가 규칙 따라 append** (진짜 백그라운드 자동 아님 — 확인됨).

**스킬명:** `notion-log` (직관성 우선). 대안: notion-ledger.

---

## Part D — ai-tell 차단 훅 (핵심)
셸 훅은 ai-tell(LLM)을 **실행 못 함** → "통과 증명(영수증)"을 강제하는 방식.

**메커니즘:**
1. **PreToolUse 차단 훅** 대상:
   - Bash 중 `gh issue create|edit` · `gh pr create|edit`의 `--body-file`
   - `mcp__notion__notion-create-pages` · `mcp__notion__notion-update-page` **단, 두 로그 문서(page id 화이트리스트)만**
2. 훅이 게시 본문 텍스트를 **정규화 후 sha256** → `.claude/.ai-tell-receipts`(gitignore)에 있으면 통과, 없으면 **exit 1 차단** + "ai-tell 먼저 돌려" 안내.
3. `notion-log`·`issue-craft`·PR 스킬이 ai-tell-detector 돌려 **정리 완료 본문 해시를 영수증에 기록** → 그 본문으로 게시 시 훅 통과.

**정규화 규칙:** CRLF→LF, 줄 끝 공백 제거, 앞뒤 trim → sha256. (gh 파일 본문 · Notion `content` 입력 동일 적용)

**리스크:**
- gh(파일) vs Notion(tool input) 본문을 **동일 정규화**해야 매칭 — 훅에서 두 소스 파싱 필요.
- 게시 직전 1글자 수정 시 해시 어긋나 재차단(안전장치지만 마찰).
- 이 레포 훅은 현재 PostToolUse(Write/Edit)만 → **Bash·MCP 대상 PreToolUse는 신규 패턴.** `settings.json` matcher가 MCP 툴명(`mcp__notion__*`)·Bash 명령 잡는지 **PoC 검증 먼저.**

---

## Part E — 문서·메모리 배선
- **CLAUDE.md 핵심 규칙**: "사람이 보는 산출물(PR·이슈·Notion 보류/협의 로그) 게시 전 `ai-tell-detector` 게이트 필수 + 차단 훅으로 강제" + 변경 이력 행.
- **`fe-skill-backlog` 메모리**: 보류 내용 삭제 → "보류는 Notion 보류 DB가 SSOT(링크)" 한 줄 포인터로 강등.
- **`api-spec-notion` 스킬**: "협의 로그 기록은 `notion-log`에 위임" 링크 추가.
- **`.gitignore`**: `.claude/.ai-tell-receipts` 추가.

---

## 실행 순서 (제안)
1. **PoC**: PreToolUse 훅이 MCP(`mcp__notion__*`)·Bash(`gh`) 이벤트를 잡고 exit 1로 차단되는지 최소 검증. ← 여기서 막히면 설계 수정.
2. 두 Notion DB 생성 + 초기 이관(보류분·채팅 3행) + tempr 이름 변경.
3. `notion-log` 스킬 작성(스키마·트리거·append·ai-tell 게이트).
4. ai-tell 영수증 훅 + `.gitignore` + `settings.json` 배선.
5. CLAUDE.md 규칙·`fe-skill-backlog` 강등·`api-spec-notion` 링크.
6. 이관 산출물 ai-tell 검사(자기 자신도 게이트 통과).

## 열린 항목 (실행 중 결정)
- 훅 화이트리스트에 넣을 정확한 두 page id (확보됨: 보류 `39830798…`, 협의 `39530798…`).
- SELECT vs STATUS 타입(보드뷰 렌더 차이) — 생성 시 확정.
