# API 명세 확장 — 고객 리포트 목록 list[] 필드 추가 (이슈 #78)

> 목적: `GET /reports?status={status}&page={page}`(도메인 report)의 `list[]`에 고객 검수 내역 화면(모바일 #78)이 요구하는 필드와 `CLOSED`(종결) 상태를 반영. **경로·필드는 백엔드 확정이 단일 진실** — 아래는 Figma 시안(659-5929)·ERD 값 기준 제안이며, 신규 엔드포인트 아님(기존 엔드포인트 응답 확장 건). 2026-07-07 Notion 명세 반영 완료.

## 대상 엔드포인트
| 경로 | 메서드 | 도메인 | 상태 |
|------|--------|--------|------|
| `/reports?status={status}&page={page}` | GET | report | list[] 확장 + status enum 확장 |

## status enum 확장
기존 `AWAITING_INSPECTION / AWAITING_ADOPTION / COUNSELING / MATCHED` → **`CLOSED` 추가**
(query 파라미터·`list[].status` 양쪽. 검수 내역 필터 "종결" = `CLOSED`, "상담 전환" = `COUNSELING`, "전체" = 파라미터 생략)

## 추가 요청 필드 (4개, 모두 🏷확인필요(FE))
| 필드 | 타입 | 화면 근거 | ERD 원천(제안) | 비고 |
|------|------|----------|----------------|------|
| `title` | string | 카드 제목 "우측 슬관절 인대 파열 · 등급 재산정" | `REPORTS.title` | 검수 내역 카드 사건명 |
| `confirmedMinAmount` | int\|null | 카드 "확정 범위 1,400–1,750만" | `REPORT_REVIEWS.confirmed_min_amount` | 미검수 null |
| `confirmedMaxAmount` | int\|null | 상동 | `REPORT_REVIEWS.confirmed_max_amount` | 상동 |
| `rating` | number\|null | 카드 "★ 4.9" | `ADJUSTER_REVIEWS` 해당 건 평점 | 후기 미작성 null(0과 구분) |

## FE 현행 처리 (이슈 #78)
- zod 스키마에 위 4필드를 **optional**로 선제 정의, MSW로만 채움 — 백엔드 미반영이어도 파싱·화면 정상(값 없으면 숨김)
- status enum은 `CLOSED` 포함 5값으로 정의, 필터는 전체/상담 전환(`COUNSELING`)/종결(`CLOSED`)
- 카드 → 검수 상세 라우팅 키는 명세상 존재하는 `reportId` 사용(`/customer/report/[id]`)

## 실패 봉투 (변경 없음)
`401 LOGIN_REQUIRED` (기존 명세 그대로).

## 확인 요청 항목 (백엔드/기획)
1. `title`·`confirmed*`·`rating` 필드 추가 가능 여부·시점
2. `rating` 산출 원천 — 사건 단위 후기 평점이 ERD에서 조회 가능한 구조인지
3. `CLOSED` 상태 전이 정의 확인(종결 조건)

## 확정 후 조치
1. Notion API 명세서 DB 해당 행 갱신 (2026-07-07 완료)
2. FE zod optional 정리 + MSW 목 데이터 실계약 거울로 유지
