# API 명세 추가 초안 — 고객 내 리포트(분석 요청) 목록 (이슈 #128)

> 목적: 프론트가 대시보드·내 리포트 목록에서 이미 호출 중인 `GET /reports`(고객 본인 리포트 목록)를 Notion API 명세서 DB에 정식 등록하기 위한 초안.
> **경로·필드는 백엔드 확정이 단일 진실.** 신규 데이터 없음 — 전부 기존 REPORTS·REPORT_REVIEWS 조회 재조립(ERD 변경 없음), 단 `title` 생성 규칙만 신규 결정 필요.

## 대상 엔드포인트
| 경로 | 메서드 | 도메인 | 비고 |
|------|--------|--------|------|
| `/reports` | GET | report | 로그인 고객 본인의 분석 요청(리포트) 목록. 카드 클릭 → 건별 제안 목록(`GET /reports/{reportID}/proposals`) 화면으로 이동 |

접근 권한: 비로그인 401 `LOGIN_REQUIRED`. 본인 소유 리포트만 반환(타인 데이터 없음 — 403 불필요).

## 설계 방침
1. 사정사용 목록(`/reports/pending-review`)과 대칭인 고객용 목록. 페이지네이션 shape은 기존 명세(`/reports/{reportID}/proposals`)의 `pagination` 그대로 재사용.
2. 화면 요구 필드만 포함(목록 카드 렌더 최소 집합). 상세·제안 내역은 기존 명세(`GET /reports/{reportId}`, `GET /reports/{reportID}/proposals`)로 분리.
3. `title`: 목록 카드 제목("○○ 건에 대한 분석 요청") — 서버 생성 권장(진단명 `diagnosis[0]` 기반, 예: "요추 추간판 탈출증 건"). 프론트는 확정 전까지 `accident_type` 라벨로 파생 표시 중.

## `GET /reports`
### Request
#### `Query`
| 파라미터 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `status` | string | N | 리포트 상태 필터(`AWAITING_INSPECTION`/`AWAITING_ADOPTION`/`COUNSELING`/`MATCHED`/`CLOSED`) |
| `page` | int | N | 페이지 (기본 1) |
| `size` | int | N | 페이지 크기 (기본 5) — ⚠️ 백엔드 확정 필요(기본값) |

### Response `200`
```json
{
  "status": "200",
  "message": "정상 처리되었습니다.",
  "data": {
    "list": [
      {
        "report_id": "0a8f7c21-...-uuid",
        "title": "요추 추간판 탈출증 건",
        "status": "AWAITING_ADOPTION",
        "accident_type": "traffic",
        "case_no": "20260520-017",
        "claimed_min_amount": 14000000,
        "claimed_max_amount": 17500000,
        "proposal_count": 2,
        "created_at": "2026-05-20T14:30:00",
        "reviewed_at": "2026-05-22T09:00:00",
        "adjuster_nickname": "손해사정王"
      }
    ],
    "pagination": { "page": 1, "size": 5, "total_elements": 8, "total_pages": 2, "has_next": true }
  }
}
```

### 필드 ↔ 출처 매핑 (전부 기존 명세·ERD 재조립)
| 필드 | 타입 | 출처(기존 명세) | ERD 원천 |
|------|------|----------------|----------|
| `report_id` | uuid | `GET /reports/{reportId}`.report_id | `REPORTS.id` |
| `title` | string | ⚠️ 신규 — 서버 생성 규칙 확정 필요 | `USER_CLAIMS.details.diagnosis[0]` 기반 생성(제안) |
| `status` | string | `POST /reports` 202.status 生명주기 | `REPORTS.status` |
| `accident_type` | string | `POST /reports`.accident_type | `USER_CLAIMS.accident_type` |
| `case_no` | string | `GET /reports/{reportId}`.case_no | `REPORTS.case_no` |
| `claimed_min_amount` / `claimed_max_amount` | int | `GET /reports/{reportId}` 동명 필드 | `REPORTS.*` |
| `proposal_count` | int | `GET /reports/{reportID}/proposals`.pagination.total_elements 대응 집계 | `REPORT_REVIEWS` COUNT |
| `created_at` | datetime | 공통 표기(`/proposals`.submitted_at과 동일 포맷) | `REPORTS.created_at` |
| `reviewed_at` | datetime\|null | 검수 완료 시각 | `REPORT_REVIEWS.*` |
| `adjuster_nickname` | string\|null | `GET /reports/{reportID}/proposals`.nickname | `USERS.nickname`(채택 사정사) |

### 실패 봉투
```json
{ "status": "401", "code": "LOGIN_REQUIRED", "message": "로그인이 필요합니다." }
{ "status": "500", "code": "INTERNAL_SERVER_ERROR", "message": "일시적인 오류가 발생했습니다." }
```

## 백엔드 확정 대기 항목
1. **`title` 생성 규칙** — 서버 생성(진단명 기반) vs 미제공(프론트 파생 유지). 서버 생성이면 진단명 없는 건의 폴백(사고유형 라벨?) 정의.
2. **`case_no` vs 프론트 `reportNo` 표기** — 상세 명세는 `case_no`. 프론트 선구현 zod는 `reportNo`로 캐멀화해 사용 중(드리프트). 응답 표기 확정 필요.
3. `size` 기본값(프론트 MSW는 5), `status` 필터 지원 여부.
4. FE 선구현 스키마의 임시 필드(`offeredAmount`·`treatment`·`confirmed_*`·`rating`·`newProposalCount`) — 목록 응답 포함 여부(미포함 확정 시 FE에서 정리).

## 확정 후 조치
1. 백엔드 확정 → Notion API 명세서 DB에 `GET /reports` 1행 추가(도메인 report)
2. `customer/_shared/model/report-list.schema.ts`·MSW 핸들러를 확정 shape 거울로 정리(임시 optional 필드 확정/제거)
3. `title` 확정 시 naming-dictionary 등재, 프론트 파생 제목 로직 제거
