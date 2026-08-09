---
name: api-spec-notion
description: 프론트에 필요한데 Notion API 명세서 DB에 없는 엔드포인트를 팀 형식 명세 초안으로 작성하고, 백엔드 확정 후 Notion에 동기화하는 절차. 전역 응답 봉투·에러코드 enum·필드명 미러링 규칙 준수, 추측 경로 금지. "API 명세 초안", "명세 추가", "이 화면 API 정리", 명세에 없는 엔드포인트가 필요할 때 사용. 확정 전 백엔드에 변경·확인을 요청하는 Notion 카드 작성은 `backend-request-notion` 스킬.
---

# API 명세 초안 작성 · Notion 동기화

프론트 작업 중 **필요한 API가 Notion API 명세서 DB에 없을 때**, 경로·필드를 추측해 코드부터 짜지 않는다. 팀 형식 명세 초안을 만들어 백엔드에 요청하고, 확정된 shape을 단일 진실로 zod·MSW를 작성한다.

> 명세 단일 진실·조회법·도메인 enum·응답 봉투·에러코드 enum은 `frontend-feature/references/api-spec.md`가 원본. 이 스킬은 **"없는 걸 새로 제안·등록"하는 절차**를 다룬다.

## 0. 먼저 — 정말 없는지 확인

`mcp__notion__notion-fetch`로 **API 명세서 DB**(`collection://7ce30798-f08f-82ee-81bb-875a29ed96bd`)를 담당 도메인으로 좁혀 조회. 이미 있으면 그 shape을 쓰고 초안 만들지 말 것. 비슷한 게 있으면 재사용/확장 우선(신규 발명 최소화).

## 1. 추측 금지 3원칙

1. **경로·메서드·필드 발명 금지.** 명세에 없으면 초안에 `⚠️ 백엔드 확정 필요`로 플래그하고, 리더/사용자에게 `AskUserQuestion`으로 확인받는다(빠진 건지·다른 경로로 있는지·미정인지).
2. **필드명은 출처 미러링.** 기존 명세가 반환하는 값의 재조립이면 **출처 명세의 표기를 그대로** 쓴다(신규 명칭 발명 금지). naming-dictionary와 대조, 드리프트는 플래그.
3. **확정 전 가짜 경로로 구현 금지.** 사용자가 명시적으로 "임시로 가라"고 한 경우에만 `// CONTRACT: 명세없음-임시` 주석 달고 진행.

## 2. 초안 형식 (Markdown, `.pr-assets/api-spec-draft-<slug>.md`)

실제 초안(#46 마이페이지 BFF) 구조:

```markdown
# API 명세 추가 초안 — <기능명> (이슈 #NN)

> 목적: <엔드포인트>를 Notion API 명세서 DB에 정식 등록하기 위한 초안.
> **경로·필드는 백엔드 확정이 단일 진실.** <신규 데이터 유무·ERD 변경 유무 명시>.

## 대상 엔드포인트
| 경로 | 메서드 | 도메인 | 비고 |
|------|--------|--------|------|
| `/<path>` | GET | <도메인 enum> | <용도> |

접근 권한: <비로그인 401 LOGIN_REQUIRED, 권한없음 403 FORBIDDEN 등>

## 설계 방침
1. <BFF/집계 여부, 기존 전례 준수 근거>
2. <범위 — 초기 렌더에 필요한 것만, 모달·후속 호출 분리>

## `<METHOD> /<path>`
### Request
<쿼리·바디·헤더. 없으면 "없음(인증 필수)">

### Response `200`
```json
{ "status": "200", "message": "정상 처리되었습니다.", "data": { /* 페이로드 */ } }
```

### 필드 ↔ 출처 매핑 (재조립이면 전부 기존값 출처 명시)
| 필드 | 타입 | 출처(기존 명세) | ERD 원천 |
|------|------|----------------|----------|
| `data.xxx` | string | `<기존엔드포인트>.xxx` | `<TABLE.column>` |

### 실패 봉투
```json
{ "status": "401", "code": "LOGIN_REQUIRED", "message": "..." }
{ "status": "403", "code": "FORBIDDEN", "message": "..." }
```

## 백엔드 확정 대기 항목
1. <질의 항목 — 표기 통일/기간 정의/null 처리 등>

## 확정 후 조치
1. 백엔드 확정 → Notion API 명세서 DB에 1행 추가
2. `_model/<name>.schema.ts`(zod)·MSW 핸들러를 확정 shape 거울로 작성
3. 신규 식별자 naming-dictionary 등재
```

## 3. 봉투·에러코드 (고정값 — 지어내지 말 것)

성공은 `{ status, message, data }`, 실패는 `{ status, code, message }`. **zod는 `data` 안쪽만 모델링**, 봉투는 공통 래퍼 재사용. 실패 `code`는 에러코드 enum에서만 고른다(문자열 매칭 금지):

`INVALID_REQUEST · VALIDATION_ERROR · MISSING_REQUIRED_FIELD · UNSUPPORTED_OPERATION · INVALID_TOKEN · EXPIRED_TOKEN · LOGIN_REQUIRED · FORBIDDEN · USER_NOT_FOUND · POST_NOT_FOUND · SUBSCRIPTION_NOT_FOUND · DUPLICATE_RESOURCE · PAYMENT_FAILED · INTERNAL_SERVER_ERROR · DATABASE_ERROR · EXTERNAL_API_ERROR · SERVICE_UNAVAILABLE`

도메인 enum(쿼리키 factory와 정렬): `auth · user · settings · report · review · matching · chat · payment · admin`. 새 도메인 임의 생성 금지.

## 4. Notion 동기화 (백엔드 확정 후)

초안은 로컬 `.pr-assets/`에만 두고, **백엔드가 확정한 뒤** Notion에 반영:
- `mcp__notion__notion-create-comment` — 명세 페이지/이슈에 초안·질의를 코멘트로 남겨 백엔드에 확인 요청(가장 흔한 흐름).
- `mcp__notion__notion-update-page` — 확정된 행/본문 갱신.
- API 명세서 DB 행 스키마: `API 경로`(title) · `도메인`(select) · `메서드`(select) · `기능`(relation).

확정 전에는 Notion 정식 행을 만들지 말고 코멘트/초안 단계에 머문다.

확정 전 이 초안을 근거로 백엔드에 변경·확인을 요청하는 Notion 카드가 필요하면 `backend-request-notion` 스킬로 넘어간다.

## 관련
`backend-request-notion`(백엔드 요청 DB 카드 작성) · [[fe-shared-endpoint-schema-drift]](공유 엔드포인트 enum 추가 시 전 소비처 zod 동반 갱신) · [[fe-naming-ask-on-missing]] · [[issue-craft]](이슈 API 연동 섹션) · `react-query-data`(확정 shape으로 훅·스키마 구현)
