# API 명세 추가 초안 — 알림 타입 확장·이동 대상·개별 읽음 (이슈 #97 후속)

> 목적: 알림 조회 팝오버(#97)를 붙이면서 드러난 알림 체계의 구멍을 메우기 위한 초안. `.pr-assets/api-spec-draft-notifications.md`(#49, 목록·모두 읽음)의 **확장**이며 그 초안의 보류 항목(토글 매핑·개별 읽음)을 여기서 다룬다.
> **경로·필드·enum 값은 백엔드 확정이 단일 진실.** 확정 전 프론트는 기존대로 `// CONTRACT: 명세없음-초안` 표기로 MSW 모킹만 유지한다.
> 확인 시점(2026-07-14): Notion API 명세서 DB에 알림 **설정**(`/users/me/notification-settings` GET·PATCH, 도메인 settings)만 등록돼 있고 알림 **목록**은 여전히 미등록.

## 배경 — 왜 지금 필요한가

1. **현재 `type` enum 5종은 전부 고객 관점**(`REVIEW_COMPLETE`·`RECEIVED_PROPOSAL`·`CONSULT_ACCEPTED`·`ANALYSIS_COMPLETE`·`IDENTITY_VERIFIED`)이다. 그런데 #97에서 알림 팝오버를 **손해사정사 헤더에도** 붙였다. 사정사가 받을 알림 타입이 하나도 정의돼 있지 않아, 사정사 팝오버는 사실상 빈 화면이 된다.
2. 알림 설정 토글은 사정사용(`newReviewRequest`·`consultMessage`)을 이미 갖고 있다. **토글은 있는데 그 토글이 제어할 알림 타입이 없다.**
3. 알림을 눌러도 갈 곳이 없다. 응답에 이동 대상 필드가 없어 카드·팝오버 행이 정적 요소로 남아 있다.

## 대상 엔드포인트
| 경로 | 메서드 | 도메인 | 비고 |
|------|--------|--------|------|
| `/users/me/notifications` | GET | settings | 응답에 `target*`·`unreadCount` 필드 추가(확장) |
| `/users/me/notifications/{notificationId}/read` | PATCH | settings | 개별 읽음 처리(신규) |

접근 권한: 로그인 사용자(비로그인 `401 LOGIN_REQUIRED`). 역할 무관 — 서버가 역할에 맞는 알림만 반환.

## 설계 방침

1. **type enum은 알림 설정 토글 키와 어근 정합**(기존 확정 규칙 유지). 신규 타입도 토글 키에서 어근을 따온다 — `newReviewRequest`→`NEW_REVIEW_REQUEST`.
2. **이동 대상은 프론트 경로가 아니라 `targetType`+`targetId`로 내려준다.** 서버가 `/customer/report/{id}` 같은 프론트 라우트를 알 필요가 없고, 웹·앱(WebView) 경로가 갈릴 때도 프론트에서 매핑하면 된다.
3. **미읽음 개수는 서버가 내려준다.** 현재 프론트가 목록을 필터링해 세고 있는데, 페이지네이션이 도입되면 이 계산이 틀려진다.
4. 그룹핑·상대시간 표기는 계속 `createdAt` 기반 클라이언트 계산.

## `GET /users/me/notifications` (확장)

### Response `200`
```json
{
  "status": "200",
  "message": "정상 처리되었습니다.",
  "data": {
    "unreadCount": 2,
    "list": [
      {
        "notificationId": "3f6c9a1e-8b2d-4c5f-9e7a-1d2b3c4d5e6f",
        "type": "REVIEW_COMPLETE",
        "title": "검수가 완료됐어요",
        "body": "김도현 사정사님이 리포트를 검수했어요.",
        "isRead": false,
        "targetType": "REPORT",
        "targetId": "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        "createdAt": "2026-07-14T07:12:00Z"
      }
    ]
  }
}
```

### 신규 필드
| 필드 | 타입 | 설명 |
|------|------|------|
| `data.unreadCount` | number | 미읽음 알림 개수(헤더 벨 점·"N 새 알림" 배지) |
| `targetType` | enum·nullable | 알림을 눌렀을 때 이동할 대상 종류. 이동 대상이 없는 알림은 `null` |
| `targetId` | string(uuid)·nullable | 대상 식별자(`reportId`·`chatRoomId` 등). `targetType`이 `null`이면 함께 `null` |

`targetType` enum과 프론트 이동 경로 매핑(프론트가 소유):

| `targetType` | `targetId` | 고객 이동 경로 | 사정사 이동 경로 |
|--------------|-----------|---------------|----------------|
| `REPORT` | reportId | 리포트 상세 | 검수 화면 |
| `PROPOSAL` | reportId | 받은 제안 상세 | — |
| `CHAT` | chatRoomId | 채팅방 | 채팅방 |
| `REVIEW_QUEUE` | reportId | — | 검수 대기 상세 |
| `MYPAGE` | null | 마이페이지 | 마이페이지 |

## 알림 타입 enum 확장

### 기존 5종 (고객) — 유지, 이동 대상만 추가
| type | 발생 시점 | targetType |
|------|----------|-----------|
| `ANALYSIS_COMPLETE` | AI 분석 리포트 생성 완료 | `REPORT` |
| `REVIEW_COMPLETE` | 손해사정사 검수 완료 | `REPORT` |
| `RECEIVED_PROPOSAL` | 사정사가 제안을 보냄 | `PROPOSAL` |
| `CONSULT_ACCEPTED` | 사정사가 상담을 수락함 | `CHAT` |
| `IDENTITY_VERIFIED` | 본인 인증 완료 | `MYPAGE` |

### 신규 — 손해사정사 4종 (⚠️ 백엔드 확정 필요)
| type | 발생 시점 | targetType | 설정 토글 | 왜 필요한가 |
|------|----------|-----------|----------|------------|
| `NEW_REVIEW_REQUEST` | 전문 분야에 맞는 사건이 검수 대기열에 배정됨 | `REVIEW_QUEUE` | `newReviewRequest` | 사정사에게 매출 기회. 토글은 이미 있으나 알림 타입이 없음 |
| `REVIEW_DEADLINE_SOON` | 배정받은 사건의 검수 기한 임박 | `REVIEW_QUEUE` | `newReviewRequest` | 사건 방치로 인한 고객 이탈 방지. 자동 회수 정책이 있다면 그 예고 |
| `CONSULT_REQUESTED` | 고객이 상담을 신청함 | `CHAT` | `consultMessage` | 토글 `consultMessage`의 실체 절반 |
| `CHAT_MESSAGE` | 상담 채팅에 새 메시지 도착 | `CHAT` | `consultMessage` | 채팅(#53)이 붙었으나 알림이 없어 방을 직접 열어야만 확인 가능 |

### 신규 — 고객 2종 (⚠️ 백엔드 확정 필요)
| type | 발생 시점 | targetType | 설정 토글 | 왜 필요한가 |
|------|----------|-----------|----------|------------|
| `CHAT_MESSAGE` | 상담 채팅에 새 메시지 도착 | `CHAT` | `consultMessage` ⚠️ | 사정사와 공유하는 타입(역할별로 수신자만 다름). ⚠️ `consultMessage` 토글은 사정사용으로 정의돼 있어 고객 토글 필요 여부 확인 |
| `PROPOSAL_CLOSED` | 제안 없이 종결 / 제안 선택 마감 임박 | `PROPOSAL` | `receivedProposal` | 받은 제안 목록(#78)에 "미진행 종결" 상태가 이미 있으나, 그 전환을 고객이 알 방법이 없음 |

### 이번 범위에서 제외 (팀 결정 2026-07-14)
`PROPOSAL_ACCEPTED` · `PROPOSAL_REJECTED` · `REVIEW_RECEIVED`(후기 등록) · `REVIEW_REQUESTED`(후기 작성 요청) · `SETTLEMENT_NOTICE`(정산·공지) · `DOCUMENT_REQUESTED`(서류 보완 요청) · `DOCUMENT_RECEIVED`(자료 접수) · `CERTIFICATION_RESULT`(자격 인증 결과) — 대응 토글이 어색하거나 MVP 밖. 필요해지면 별도 확장.

## `PATCH /users/me/notifications/{notificationId}/read` (신규)

### Request
없음 (Body 없음, 인증 필수)

### Response `200`
```json
{ "status": "200", "message": "정상 처리되었습니다.", "data": null }
```
`401 LOGIN_REQUIRED` · `404`(존재하지 않는 알림 — ⚠️ 알림 전용 에러코드가 필요한지 확인 필요)

알림을 클릭하면 프론트가 이 요청을 보낸 뒤 `targetType`·`targetId`로 이동한다. 현재는 "모두 읽음"만 있어, 하나를 확인해도 나머지가 함께 읽음 처리되거나 그대로 남는다.

## 백엔드 확정 대기 항목

1. **신규 type enum 6종의 이름·MVP 포함 범위** (사정사 4 + 고객 2).
2. **`CHAT_MESSAGE` 처리 방식** — 메시지마다 알림을 쌓으면 목록이 도배된다. 방 단위로 묶는지(같은 방 알림은 최신 1건만 유지) 확인 필요.
3. **`CHAT_MESSAGE`의 고객 측 토글** — `consultMessage`는 사정사용으로 정의돼 있어 고객에게 그대로 쓸지, 필수 알림으로 둘지 결정 필요.
4. **`kakaoPlusFriend` 토글 드리프트** — 프론트 코드(#106)와 고객 마이페이지 UI에는 `kakaoPlusFriend`가 있으나 Notion 설정 명세(6키)에는 없다. 명세 갱신 필요.
5. **페이지네이션·보관 기간** — 여전히 미정(#49 초안에서 이월).
6. **새 알림 도착 감지** — 폴링(프론트 `refetchInterval`)로 갈지, SSE·FCM 푸시로 갈지. 설정 명세에 "발송은 서버(FCM/카카오 알림톡·이메일)"로 적혀 있으므로 앱 푸시와의 관계 정리 필요.

## 확정 후 조치
1. 백엔드 확정 → Notion API 명세서 DB에 `/users/me/notifications`(GET) 행 신규 등록 + `/users/me/notifications/{notificationId}/read`(PATCH) 행 추가, 알림 설정 명세에 `kakaoPlusFriend` 반영
2. `shared/model/notification.schema.ts`(zod)·MSW 핸들러를 확정 shape 거울로 갱신 — **enum 값 추가 시 모든 소비처 스키마 동반 갱신**(누락 시 목록이 파싱 실패로 멈춤)
3. `shared/ui/NotificationTypeIcon.tsx`에 신규 type 아이콘 매핑 추가
4. 알림 클릭 이동 매핑(`targetType`→라우트) 구현 + 개별 읽음 mutation 훅 추가
5. 신규 식별자 naming-dictionary 등재
