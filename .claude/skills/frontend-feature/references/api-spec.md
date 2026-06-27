# API 명세 참조 (단일 진실: Notion)

손해사정 플랫폼의 **백엔드 API 계약 단일 진실**. fe-architect가 데이터 계약을 설계하거나, data-engineer가 훅·MSW 핸들러를 만들 때 **반드시 이 문서 + 해당 엔드포인트의 Notion 행**을 참조한다. 임의로 경로·메서드·응답 shape을 지어내지 않는다.

## 출처 (Notion)
- **기능/API 명세 페이지**: https://app.notion.com/p/01c30798f08f830288cb8104137f05e3
  - 탭 1 **기능리스트** DB: `collection://cce30798-f08f-8210-a6cd-07048c438a40`
  - 탭 2 **API 명세서** DB: `collection://7ce30798-f08f-82ee-81bb-875a29ed96bd`

개별 엔드포인트(경로·요청/응답 필드)는 위 페이지에 박지 않는다 — 자주 바뀌므로 **작업 시점에 fetch**한다. 아래 "조회법" 참조.

## 엔드포인트 조회법 (작업 시점에 fetch)
`mcp__notion__notion-fetch`로 **API 명세서 데이터소스**를 조회한 뒤, 담당 슬라이스의 도메인/기능으로 행을 좁힌다.

API 명세서 DB 스키마:

| 속성 | 타입 | 값 |
|------|------|----|
| `API 경로` | title | 엔드포인트 경로 (예: `/reports/{reportId}/proposals`) |
| `도메인` | select | 아래 도메인 enum 중 하나 |
| `메서드` | select | `GET` \| `POST` \| `PATCH` \| `DELETE` |
| `기능` | relation | 기능리스트 DB 행(어느 기능에 속한 API인지) |

흐름: ① 담당 기능이 어느 **도메인**인지 식별 → ② API 명세서 DB를 도메인으로 필터해 관련 엔드포인트 행 fetch → ③ 각 행 페이지 본문에서 요청/응답 필드 shape 확인 → ④ 그 shape으로 zod 스키마·MSW 핸들러 작성.

## ⚠️ 명세에 없는 엔드포인트는 임의 생성 금지
작업에 필요한 API가 API 명세서 DB에서 **조회되지 않으면**, 경로·메서드·요청/응답 shape을 추측해서 만들지 않는다. 대신:
1. 명세·작업 로그에 `⚠️ 명세없음: <기능> — 필요한 호출 <METHOD path 추정> (사유)`로 플래그한다.
2. 리더에 보고 → 리더가 `AskUserQuestion`으로 사용자에게 확인한다(이 API가 명세에 빠진 건지/다른 경로로 있는지/아직 미정인지).
3. 사용자가 **확정·Notion에 추가**한 뒤에야 zod·훅·MSW를 구현한다. 그 전까지 가짜 경로로 진행 금지.

목 우선 개발이라도 **경로/메서드/필드는 사용자 확정이 단일 진실** — MVP 임시로 진행해야 하면 사용자가 명시적으로 "임시로 가라"고 한 경우에만, `// CONTRACT: 명세없음-임시` 주석을 달고 진행한다.

## 도메인 enum (쿼리키 factory 도메인과 정렬)
```text
auth · user · settings · report · review · matching · chat · payment · admin
```
쿼리키 factory의 최상위 도메인 키와 이 enum을 일치시킨다. 새 도메인을 임의로 만들지 않는다.

## 전역 응답 봉투 (모든 엔드포인트 공통 — 안정적, 여기 고정)
**base url**: `https://example.com/api/v1` (MVP 플레이스홀더 — 실제 값은 env로 주입)

성공:
```json
{ "status": "200", "message": "정상 처리되었습니다.", "data": { /* 엔드포인트별 페이로드 */ } }
```
실패:
```json
{ "status": "400", "code": "BAD_REQUEST", "message": "필수 파라미터 누락" }
```

**계약 규칙:**
- zod 스키마는 **`data` 안쪽 페이로드**를 모델링한다. 봉투(`status`/`message`/`code`)는 공통 응답 래퍼로 한 번만 정의해 재사용.
- MSW 핸들러도 반드시 이 봉투 형태로 응답한다(성공은 `data`로 감싸고, 실패는 `code` 포함). 봉투를 빠뜨리면 실제 API와 shape이 어긋난다.

## 에러코드 enum (실패 응답 `code`)

| HTTP | code | 의미 |
|------|------|------|
| 400 | `INVALID_REQUEST` | 요청 형식/구조 이상(깨진 JSON, 타입 불일치) |
| 400 | `VALIDATION_ERROR` | 필드 값 검증 위반(형식·길이·범위) |
| 400 | `MISSING_REQUIRED_FIELD` | 필수 입력값 누락 |
| 400 | `UNSUPPORTED_OPERATION` | 미지원 동작(MVP 미지원 보험사, 미적재 약관 리포트 등) |
| 401 | `INVALID_TOKEN` | 토큰 위조·변조·서명 오류 |
| 401 | `EXPIRED_TOKEN` | 토큰 만료 → Refresh 재발급 필요 |
| 401 | `LOGIN_REQUIRED` | 비로그인 상태로 보호 리소스 접근 |
| 403 | `FORBIDDEN` | 인증됐으나 권한 없음(미활성 사정사 채택, 타인 리포트) |
| 404 | `USER_NOT_FOUND` | 사용자 없음 |
| 404 | `POST_NOT_FOUND` | 게시물/리포트 없음 |
| 404 | `SUBSCRIPTION_NOT_FOUND` | 구독 정보 없음 |
| 409 | `DUPLICATE_RESOURCE` | 중복 생성 시도 |
| 422 | `PAYMENT_FAILED` | 결제 실패(PG 거절·한도·잔액) |
| 500 | `INTERNAL_SERVER_ERROR` | 처리되지 않은 서버 예외 |
| 500 | `DATABASE_ERROR` | DB 조회/저장 실패 |
| 500 | `EXTERNAL_API_ERROR` | 외부 연동 실패(PG·OAuth·OCR·LLM) |
| 503 | `SERVICE_UNAVAILABLE` | 점검·배포·과부하 일시 불가 |

**적용:** 에러 상태 UI·토스트·재시도 분기는 위 `code`로 판단한다(메시지 문자열 매칭 금지). `EXPIRED_TOKEN`→리프레시, `FORBIDDEN`→권한 안내, `VALIDATION_ERROR`→폼 필드 에러 등. MSW 실패 핸들러도 이 enum의 `code`를 사용한다.

## 식별자 정합성
필드명·ID 타입·enum 영문값은 [[naming-dictionary]](`naming-dictionary.md`)와 충돌하면 안 된다. API 명세 행의 실제 필드명을 사전과 대조하고, 불일치 시 `⚠️ 작명필요`/`// CONTRACT:`로 플래그해 리더에 보고.
