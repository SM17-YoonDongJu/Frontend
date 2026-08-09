---
name: backend-request-notion
description: API 변경·ERD 변경·정책 확인·버그를 백엔드에 요청할 때 Notion "백엔드 요청 (API·ERD)" DB에 카드(프로퍼티+본문)를 작성하는 절차. 프로퍼티는 한 줄 요약·본문은 Before/사유/After 고정 구조·존댓말·parent 명시 규칙 포함. "백엔드에 요청", "백엔드 요청 카드", "API 변경 요청", "ERD 변경 요청", 백엔드 확인·결정이 필요한 사안이 생겼을 때 사용.
---

# 백엔드 요청 (API·ERD) DB 카드 작성

API 변경·신규·ERD 변경·정책 확인·버그를 백엔드에 요청할 때, 긴 프로즈 문서 대신 **카드 하나=요청 하나**로 남긴다. DB: `collection://26e11f94-e6bc-40b6-bdba-eeb3a05a9d49` (`백엔드 요청 (API·ERD)`).

> 새 엔드포인트 자체의 명세 초안(경로·필드·봉투 설계)은 `api-spec-notion` 스킬이 원본. 이 스킬은 그 초안이든 다른 사안이든 **백엔드에 확인·변경을 요청하는 카드**를 만드는 절차만 다룬다. API 명세 초안을 만든 뒤 그걸 근거로 요청 카드를 만드는 흐름이면 두 스킬을 순서대로 쓴다.

## 0. 생성 전 — 같은 대상 카드 있는지 확인

`mcp__notion__notion-query-data-sources`로 **대상**(제목) 기준 기존 카드 존재 여부를 먼저 확인한다. 같은 엔드포인트/테이블에 대한 요청이면 **새 카드를 만들지 말고 기존 카드 본문에 append**한다.

## 1. 컬럼(프로퍼티) 스키마

| 컬럼 | 타입 | 채우는 값 |
|------|------|----------|
| 대상 | title | 메서드+경로 또는 테이블명, 중복 방지 키 (예: `GET·PATCH /users/me (프로필 4필드 확장)`) |
| 상태 | select | 생성 시 **`요청`만** 설정 (§3 참고) |
| 우선순위 | select | 🔴 High / 🟡 Mid / 🟢 Low |
| 종류 | select | API변경 / API신규 / ERD / 정책 / 버그 |
| 현재(Before) | text | **한 줄 평서문 요약**(상세는 본문) — 종류=API변경이면 필수 |
| 변경 요청(After) | text | 한 줄 평서문 요약 |
| 이유 | text | 한 줄 평서문 요약 |
| 영향 | multi-select | 영향받는 화면/기능 |
| 관련 이슈 | text | `[#NN](https://github.com/SM17-YoonDongJu/Frontend/issues/NN)` |
| 관련 PR | text | `[#NN](https://github.com/SM17-YoonDongJu/Frontend/pull/NN)` |

**프로퍼티 text 컬럼(현재/변경 요청/이유)은 괄호·대시로 근거를 욱여넣지 말고 한 줄 평서문만.** 표에서 스캔하는 용도이지, 여기에 근거 문단을 통째로 넣으면 표가 안 읽힌다. 근거·상세는 전부 본문으로 보낸다.

## 2. 카드 본문 — 구조 고정 + 필수 작성

**프로퍼티만 채우고 본문을 비운 채 완료 처리 금지.** 본문 없는 카드는 실패다. 구조는 다음 순서로 고정:

```markdown
## 이전 (Before)
📄 현재 명세: [`<METHOD> /<path>`](<API 명세서 DB 페이지 링크>)
<실측 필드·타입을 코드블록으로>

## 사유
<이 변경이 왜 필요한지 — 화면·기능과 연결해서 서술>

## 이후 (After)
<요청하는 변경 — 실측 필드·타입을 코드블록으로>

## 접근 권한 · 실패 응답
<로그인 필수 여부, 예상 실패 코드(에러코드 enum에서만)>

## 결정 필요
<callout icon="❓">
	<백엔드가 판단해야 하는 열린 질문. 없으면 이 섹션 자체를 생략>
</callout>

## 비고 (FE 상태)
<FE가 임시로 어떻게 처리 중인지, 함께 발견된 관련 드리프트 등. 없으면 생략>
```

`## 결정 필요`·`## 비고 (FE 상태)`는 **있을 때만** 넣는다. 나머지 섹션은 순서 고정. **`## 결정 필요`는 Notion 콜아웃 블록**(`<callout icon="❓">...</callout>`, Notion-flavored Markdown 문법)으로 작성한다 — 마크다운 `>` 인용 블록이 아니다. 색 배경 없이 밋밋한 인용문으로 렌더되면 스캔 우선순위가 안 산다.

**카드 본문은 존댓말(합니다체)로 작성한다** — 백엔드에 보내는 요청 문서이기 때문. `~없음` → `~없습니다`, `~요청드립니다`, `~확인 부탁드립니다`. 반대로 `api-spec-notion` §2의 로컬 초안(`.pr-assets/api-spec-draft-*.md`)은 내부 작업 문서이므로 평서체를 유지한다 — 존댓말은 **이 Notion 카드 본문에만** 적용된다.

## 3. 상태·소유권

**상태 전이는 백엔드 소유.** Claude는 카드 생성 시 상태를 `요청`으로만 설정하고, 이후 `검토중`→`진행중`→`반영완료`/`보류` 전이는 절대 덮어쓰지 않는다.

## 4. `notion-create-pages` 호출 — parent 명시 필수

`parent`를 **최상위 인자**로 `{type: "data_source_id", data_source_id: "26e11f94-e6bc-40b6-bdba-eeb3a05a9d49"}`로 명시해야 한다. 누락하면 워크스페이스 루트에 빈 제목 페이지가 생기는 실패가 실제로 발생했다(2026-07-27, `notion-move-pages`+`update_properties`로 수동 복구).

```javascript
mcp__notion__notion-create-pages({
  parent: { type: "data_source_id", data_source_id: "26e11f94-e6bc-40b6-bdba-eeb3a05a9d49" },
  pages: [{
    properties: { "대상": "GET /users/me/xxx (신규 필드)", "상태": "요청", /* ... */ },
    content: "## 이전 (Before)\n..."
  }]
})
```

## 5. 실제 예시 (축약)

반영완료 카드 `GET·PATCH /users/me (프로필 4필드 확장)` (#105, PR #106):

```markdown
대상: GET·PATCH /users/me (프로필 4필드 확장)
상태: 반영완료 | 종류: API변경 | 우선순위: 🟡 Mid
현재(Before): GET 8필드 중 phone_number·region·avatar_url 반영 확인, social_provider 미제공
변경 요청(After): social_provider(enum kakao|naver) 응답에 추가

## 이전 (Before)
📄 현재 명세: [GET /users/me](...) (Done) · [PATCH /users/me](...) (Done)
GET 응답 8필드: user_id · nickname · phone_number · role · gender · region[] · avatar_url · created_at
→ social_provider 없습니다(GET·PATCH 양쪽 모두).

## 사유
마이페이지 프로필 히어로가 "카카오로 연결됨" 배지를 표시해야 합니다. 소셜 제공자를 알 수 있는 필드가 없어
현재는 이 표시가 불가능합니다. 가입 시 서버가 provider(kakao/naver)를 받아 저장하고 있어, 응답에만 노출이
빠진 것으로 보입니다.

## 이후 (After)
GET /users/me 응답에 social_provider enum(kakao|naver) 필드 추가를 요청드립니다.
PATCH body에는 불필요합니다(사용자가 직접 바꾸는 값이 아니므로 읽기 전용).

## 접근 권한 · 실패 응답
로그인 필수 — 401 LOGIN_REQUIRED

## 비고 (FE 상태)
FE shared/model/user.ts:26에서 socialProvider를 nullish로 선정의해두어, 키가 없어도 파싱은 깨지지 않고
표시만 빠지는 상태입니다.
```

이 카드는 결정 필요 항목이 없어 §2 콜아웃 예시는 생략됨. 콜아웃이 필요한 경우 실제 작성 형태:

```markdown
## 결정 필요
<callout icon="❓">
	사정사 자격 상태가 바뀌면 role도 함께 바뀌는데, 이미 발급된 access_token(TTL 30분) 안의 role은
	재발급 전까지 오래된 값일 수 있습니다. RTR(refresh token rotation) 재발급 시 최신 role로
	갱신되는지 확인 부탁드립니다.
</callout>
```

## 관련
[[fe-backend-request-db]](이 스킬 문서가 단일 진실, 메모리는 포인터) · `api-spec-notion`(신규 엔드포인트 명세 초안 원본) · [[fe-shared-endpoint-schema-drift]](공유 엔드포인트 enum 추가 시 전 소비처 zod 동반 갱신) · [[issue-craft]](이슈 API 연동 섹션)
