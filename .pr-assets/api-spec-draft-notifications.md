# API 명세 추가 초안 — 알림 목록·읽음 처리 (이슈 #49)

> 목적: 알림 페이지(Figma 659-4636)용 엔드포인트를 Notion API 명세서 DB에 정식 등록하기 위한 초안. **경로·필드는 백엔드 확정이 단일 진실.** 현재 명세서에는 알림 **설정**(`/users/me/notification-settings` GET·PATCH, 도메인 settings)만 존재하고 알림 **목록** API는 없어(2026-07-05 확인) 아래를 제안한다. 확정 전 프론트는 이 초안 기준 MSW 모킹으로 진행하며 코드에 `// CONTRACT: 명세없음-초안` 표기.

## 대상 엔드포인트
| 경로 | 메서드 | 도메인 | 비고 |
|------|--------|--------|------|
| `/users/me/notifications` | GET | settings *(기존 알림 설정 2건과 동일 귀속, 확정 2026-07-05)* | 내 알림 목록 조회 |
| `/users/me/notifications/read-all` | PATCH | settings | 모두 읽음 처리 |

접근 권한: 로그인 사용자(비로그인 `401 LOGIN_REQUIRED`). 역할 무관 — 서버가 역할에 맞는 알림만 반환.

## 설계 방침
1. **type enum은 알림 설정 토글 키와 어근 정합**(확정 2026-07-05): `reviewComplete`→`REVIEW_COMPLETE`, `receivedProposal`→`RECEIVED_PROPOSAL`. 같은 개념을 두 API가 다른 단어로 부르지 않게 함.
2. 오늘/어제/이전 그룹핑·상대시간 표기("2시간 전"/"1일 전"/"05.18")는 `createdAt` 기반 **클라이언트 계산** — 서버는 그룹 정보를 내려주지 않는다.
3. 페이지네이션 없음(MVP) — 서버가 최근 N건(예: 30건)만 반환하는 것으로 가정. ⚠️ 백엔드 확인 필요.

## `GET /users/me/notifications`

### Request
없음 (인증 필수, `Authorization: Bearer {accessToken}`)

### Response `200`
```json
{
  "status": "200",
  "message": "정상 처리되었습니다.",
  "data": {
    "list": [
      {
        "notificationId": "3f6c9a1e-8b2d-4c5f-9e7a-1d2b3c4d5e6f",
        "type": "REVIEW_COMPLETE",
        "title": "검수가 완료됐어요",
        "body": "김도현 사정사님이 리포트를 검수했어요.",
        "isRead": false,
        "createdAt": "2026-07-05T07:12:00Z"
      }
    ]
  }
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `notificationId` | string(uuid) | 알림 ID |
| `type` | enum | `REVIEW_COMPLETE`(검수 완료) · `RECEIVED_PROPOSAL`(새 제안) · `CONSULT_ACCEPTED`(상담 수락) · `ANALYSIS_COMPLETE`(분석 완료) · `IDENTITY_VERIFIED`(본인 인증) — 유형별 아이콘 매핑용 |
| `title` | string | 알림 제목(카드 굵은 글씨) |
| `body` | string | 알림 본문 1줄 |
| `isRead` | boolean | 읽음 여부(false면 카드에 빨간 도트) |
| `createdAt` | string(ISO 8601) | 발생 시각 |

`401 LOGIN_REQUIRED` 인증 필요

## `PATCH /users/me/notifications/read-all`

### Request
없음 (Body 없음, 인증 필수)

### Response `200`
```json
{ "status": "200", "message": "정상 처리되었습니다.", "data": null }
```
`401 LOGIN_REQUIRED` 인증 필요

## ⚠️ 보류 (백엔드 협의 필요 — 이번 구현 범위 밖)
- **알림 설정 토글 ↔ 알림 type 차단 매핑**: 설정 6키 중 목록 type과 대응되는 건 2개(reviewComplete·receivedProposal)뿐. `CONSULT_ACCEPTED`(설정의 consultMessage는 사정사용이라 방향 반대)·`ANALYSIS_COMPLETE`·`IDENTITY_VERIFIED`는 토글 카테고리 부재 — 필수 알림 여부 미정.
- 개별 읽음 처리(`PATCH /users/me/notifications/{notificationId}/read`) — 카드 탭 동작(이동처 포함)이 정해지면 추가.
- 페이지네이션·보관 기간 정책.
