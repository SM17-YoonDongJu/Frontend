# 식별자 사전 (Naming Dictionary)

같은 개념 = 같은 식별자. 변수·필드·함수·상수·enum 값을 헷갈리지 않게 고정한다.

**단일 진실 = API 명세서 DB 필드명**(백엔드 계약이라 FE가 임의로 못 바꾼다). 의미·라벨은 [[domain-glossary]], **코드 식별자는 이 문서**. 충돌 시 우선순위: **API 명세 필드명 > 이 표 > 임의 작명(금지)**. 새 이름이 필요하면 여기 먼저 추가하고 쓴다.

출처: Notion `API 명세서` DB(`collection://7ce30798-f08f-82ee-81bb-875a29ed96bd`). 불명확하면 `⚠️`로 두고 추측하지 않는다.

## 작명 프로토콜 — 사전에 없는 이름이 필요할 때

새 변수·함수·필드·enum 이름이 이 사전에 없으면 **임의로 정하지 않는다.** 한 번 갈리면 코드 전체가 따라 갈린다.

1. API 명세 필드명으로 커버되는지 먼저 확인(§3). 있으면 그대로.
2. 없으면 **후보 2~4개**를 만든다(작명 규칙 §0 준수, 각 후보에 짧은 근거).
3. **사용자에게 선택지로 묻는다.** 팀 모드에선 서브에이전트가 직접 못 물으므로 명세/로그에 `⚠️ 작명필요: <개념> — 후보 [a|b|c]`로 표시하고 **리더가 `AskUserQuestion`으로 선택지를 제시**한다.
4. 사용자가 고르면 **이 사전에 즉시 추가**하고 그 이름으로만 쓴다(다음부턴 재질문 X).

예) "사정사 채택 케이스 작업공간" 식별자 후보 → `caseWorkspace` / `adoptionWorkspace` / `adjusterWorkspace` 제시 후 확정.

## 0. 작명 규칙 (요약 — 상세는 `code-conventions`)

| 종류 | 규칙 | 예 |
|------|------|----|
| 변수·필드·함수·훅 | camelCase | `reportId`, `useReportList` |
| 컴포넌트·타입·zod 추론 타입 | PascalCase | `ReportCard`, `ReportDetail` |
| 상수·enum 값 | UPPER_SNAKE | `STALE_TIME_AUTH`, `MATCHED` |
| zod 스키마 | `<domain>Schema` | `reportDetailSchema` |
| 라우트 세그먼트 폴더 | kebab(영문 슬러그) | `report-request` |

- **API 필드는 백엔드 그대로(camelCase) 쓴다.** 임의 영문화/한글화/별칭 금지(= 경계 버그 원인).

## 1. 도메인 / 라우트 세그먼트

| 한글 | 도메인 식별자 | 라우트그룹 | 비고 |
|------|--------------|-----------|------|
| 인증 | `auth` | `(auth)` | 소셜 로그인·회원가입 |
| 사용자 | `user` | `(customer)`/`(partner)` | 프로필·자격신청 |
| 리포트 | `report` | `(customer)` | 생성·목록·상세 |
| 검수 | `review` | `(partner)` | 사정사 검수(리포트 PATCH) |
| 매칭 | `matching` | `(customer)` | 상담 신청 |
| 채팅 | `chat` | `(customer)`/`(partner)` | 목록 REST + 메시지 WS |
| 결제 | `payment` | `(partner)` | 결제·구독 |
| 관리자 | `admin` | (백오피스) | 자격 승인 |

## 2. 엔티티 & 핵심 ID

| 개념 | ID 식별자 | 타입 | 비고 |
|------|----------|------|------|
| 리포트 | `reportId` | uuid(string) | |
| 손해사정사 | `adjusterId` | uuid(string) | 리포트 상세 미채택 시 `null` |
| 사용자 | `userId` | **number(int)** | ⚠️ 유일하게 숫자 — §7-2 |
| 자격신청 | `applicationId` | uuid(string) | |
| 결제 | `paymentId` | uuid(string) | |
| 구독 | `subscriptionId` | uuid(string) | |
| 채팅방 | `chatRoomId` | uuid(string) | |
| 보험상품 | `productId` | uuid(string) | 리포트 생성 입력 |

## 3. 필드 사전 (도메인별, API 명세 출처)

### auth — `POST /auth/register`
`provider`(`kakao`|`naver`) · `socialToken` · `nickname`(2~20자) · `userType` · `email`(N)
→ resp: `userId` · `nickname` · `userType` · `accessToken` · `refreshToken`

### user — `GET /users/me`
`userId` · `nickname` · `email` · `userType` · `createdAt`
- `PATCH /users/me`: `nickname`(N) · `email`(N)
- `POST /users/adjuster-applications`: `name`(실명) · `speciality`(신체/교통) · `licenseNo`(N\*) · `licenseImageUrl`(N\*) · `career`(int 연차) · `introduce`(N) — `licenseNo`/`licenseImageUrl` 중 최소 1 필수 → resp `applicationId` · `status`

### report — `POST /reports` (분석 신청)
`productId` · `accidentType`(신체/교통/질병…) · `accidentDate` · `diagnosis` · `insuranceOffered`(int, 보험사 제안금액·N) · `hospitalStart`(N) · `hospitalEnd`(N) · `description`(N 사고경위) · `additionalInformation`(N) · `documentUrls`(string[] N) · `question`(N 자연어)
→ resp: `reportId` · `status`(생성 중)

- `GET /reports/{reportID}` (상세): `reportId` · `status` · `accidentType` · `diagnosis` · `claimedMinAmount` · `claimedMaxAmount` · `offeredAmount`(보험사 제안금액·§7-1) · `applicableGuarantees`(string[] 적용가능 특약) · `omittedSpecialContract`(string[] 누락 특약) · `basisTermsPrecedents`(string[] 근거 약관·판례) · `issue`(string[] 쟁점) · `question` · `adjusterId`(nullable)
- `GET /reports?status={status}&page={page}` (목록/프로세스): items[]{ `reportId` · `status` · `accidentType` · `createdAt` } + `page` · `totalPages` · `totalCount`
- `GET /reports/pending-review?status&page&size` (검수 대기 목록·활성 사정사 전용·403 FORBIDDEN): `data.list[]{ reportId · accidentType · status · createdAt }` + `data.pagination{ page · size · totalElements · totalPages · hasNext }`
- `PATCH /reports/{reportID}` (검수 반영): `applicableGuarantees`(N) · `omittedSpecialContract`(N) · `issue`(N) · `review`(string 사정사 의견) · `status`(N)

### matching — `POST /matches/{reportID}` (상담 신청)
body: `adjusterId` → resp: `reportId` · `adjusterId` · `status`(`AWAITING_ADOPTION`)

### chat — `GET /chats`
items[]{ `chatRoomId` · `participants`(uuid[]) · `lastMessage` · `updatedAt` } — 메시지 송수신은 WebSocket(본 API는 목록만)

### payment — `GET /payments/history`
items[]{ `paymentId` · `amount`(int) · `type`(`SUBSCRIPTION`) · `status`(`PAID`) · `paidAt` } + `page` · `totalCount`
- `POST /subscriptions`: `tier`(`BASIC`|`PRO`) · `paymentMethod`(PG 토큰) → resp `subscriptionId` · `tier` · `status`(`ACTIVE`) · `expiresAt`

### admin — `/admins/adjuster-applications`
목록 + `{applicationId}/accept` · `{applicationId}/rejects`

## 4. 상태·enum 값 사전 (모두 UPPER_SNAKE)

| 분류 | 값 | 출처 |
|------|----|----|
| 리포트 프로세스(`status`) | `AWAITING_INSPECTION` 검수대기 · `AWAITING_ADOPTION` 채택대기 · `COUNSELING` 상담중 · `MATCHED` 매칭완료 | `GET /reports` |
| 매칭(`status`) | `AWAITING_ADOPTION` | `POST /matches` |
| 결제(`status`/`type`) | status `PAID` / type `SUBSCRIPTION` | `GET /payments/history` |
| 구독(`status`/`tier`) | status `ACTIVE` / tier `BASIC`·`PRO` | `POST /subscriptions` |
| 자격신청(`status`) | `PENDING` (승인/반려는 admin accept/reject) | `users/adjuster-applications` |
| 회원유형(`userType`) | `insured_person` 피보험자(고객) · `adjuster` 손해사정사 | `POST /auth/register` |
| 소셜(`provider`) | `kakao` · `naver` | auth |

> 한글 라벨↔코드값 매핑은 화면 표시 전용. **코드·zod·MSW·쿼리는 영문 enum 값만 쓴다.**

## 5. 함수·훅·쿼리키 네이밍 패턴

- **조회 훅:** `use<Entity><List|Detail>` — `useReportList` · `useReportDetail` · `useMe` · `useChatList` · `usePaymentHistory`
- **뮤테이션 훅:** `use<Verb><Entity>` — `useCreateReport`(신청) · `useReviewReport`(검수=PATCH) · `useCreateMatch`(상담신청) · `useCreateSubscription` · `useApplyAdjuster`(자격신청) · `useUpdateMe` · `useDeleteMe`(탈퇴) · `useRegister` · `useLogout`
- **API 함수:** `<verb><Entity>` — `getReport` · `getReportList` · `createReport` · `reviewReport` · `createMatch` · `getMe` …
- **쿼리키 factory**(`@lukemorales/query-key-factory`): 도메인별 `createQueryKeys('<domain>', …)` → `report.list(params)` · `report.detail(reportId)` · `user.me` · `chat.list` · `payment.history`

## 5b. 받은 제안 목록 (이슈 #18, `GET /reports/{reportId}/proposals`)

API 명세 확정 필드(단일 진실). 카드는 이 필드로만 구성(이미지의 예상보상범위·보수기준·전문분야·경력·신규배지·아바타는 현 API에 없음 → 표시 안 함).

| 개념 | 식별자 | 타입 | 비고 |
|------|--------|------|------|
| 제안 식별자 | `adjusterId` | uuid | 별도 proposalId 없음(reportId당 사정사 1제안). 거절·프로필 이동 키 |
| 사정사 이름 | `nickname` | string | 아바타 없음 → 첫 글자 폴백 |
| 평점 | `rating` | number | 예 4.8 |
| 제안 요약 | `proposalSummary` | string | 카드 메시지로 표시 |
| 제안 상태 | `status` | enum | `COMPLETED` 등(영문 enum 기준) |
| 제출일 | `submittedAt` | iso datetime | |
| 페이지네이션 | `pagination` | `{page,size,totalElements,totalPages,hasNext}` | |

- **쿼리키:** `proposal.list(reportId)` — `createQueryKeys('proposal', …)`. staleTime `STALE_TIME_LIST`(0, 폴링) / gcTime `GC_TIME_DEFAULT`.
- **분석 대상 정보**(사고유형·접수일 등 기능1)는 별도 `GET /reports/{reportId}` 사용.
- **거절:** 사유 없이 바로 거절. ⚠️ 현 API `PATCH /reports/{reportId}/reject`는 reportId만 키(사정사별 불가) + body 명세 깨짐 → **사정사별 거절 API `PATCH /reports/{reportId}/proposals/{adjusterId}/reject` 백엔드 신규 요청**, 확정 전 MSW mock로 선구현(§7-5).

## 6. 상수

| 상수 | 값 | 용도 |
|------|----|----|
| `STALE_TIME_AUTH` | `30 * 60 * 1000` | auth/구독 |
| `STALE_TIME_DETAIL` | `Infinity` | 리포트 상세(확정·불변) |
| `STALE_TIME_LIST` | `0` | 프로세스·목록(폴링) |
| `GC_TIME_DEFAULT` | `30 * 60 * 1000` | 기본 |
| `GC_TIME_DETAIL` | `60 * 60 * 1000` | 상세 |

## 7. ⚠️ 명세 내 네이밍 드리프트 (백엔드 확인 필요 — data-engineer가 zod 작성 시 플래그)

1. **보험사 제안금액 이름 불일치:** `POST /reports` body는 `insuranceOffered`, `GET /reports/{id}` resp는 `offeredAmount`. 같은 개념. 각 엔드포인트는 명세 그대로 쓰되, 통일 필요성을 백엔드에 제기.
2. **`userId` 타입:** user/auth에선 `number(int)`, 그 외 모든 ID는 `uuid(string)`. zod에서 `z.number()` vs `z.string().uuid()` 구분 — 혼용 금지.
3. **리포트 status 표기 혼재:** 목록 응답은 영문 enum(`MATCHED`…), 상세 응답 예시는 한글(`"완료"`·`"생성 중"`). **FE는 영문 enum 기준**으로 통일하고 한글은 표시 라벨로 매핑. 상세 status 실제값을 백엔드에 확인.
4. **`userType` 값 혼재:** `register`는 `insured_person`/`adjuster`, `GET /users/me` 예시는 한글 `"검증 o 손해사정사"`(검증여부+역할 혼합). 코드값은 `insured_person`/`adjuster`, **검증 여부는 별도 필드로 분리** 필요 — 백엔드 확인.
5. **검수 현황 요약 엔드포인트 미정:** 검수 대기 화면 상단 3카드(검수 대기/내 전문분야 매칭/마감 임박 건수)에 대응하는 API 없음. FE 임시값 `GET /reports/pending-review/summary` → `{ pendingCount, specialtyMatchCount, dueSoonCount }`로 목킹 중. 백엔드에 신설 요청 필요.
6. **`pending-review` 목록 카드 필드 부족:** 명세 `list[]`는 `reportId·accidentType·status·createdAt` 4필드뿐인데 디자인은 더 요구. FE 임시 추가(목킹): `caseId`(접수번호 `YYYYMMDD-NNN`) · `title`(요약) · `region`(지역) · `matchingScore`(AI 매칭률 int %) · `claimedMinAmount`/`claimedMaxAmount`(예상 보상범위) · `offerHeadroom`(제안 대비 여력 int 원) · `issueCount`(쟁점 건수 int) · `held`(보류 여부 bool). 백엔드에 list 응답 확장 요청 필요.
7. **검수 보류 엔드포인트 미정:** 사정사가 사건을 보류하는 API 없음. FE 임시값 `PATCH /reports/{reportId}/hold` → `{ reportId, held }`로 목킹 중. 백엔드에 신설 요청 필요(보류 상태 enum 포함).
8. **거절 API 결함(이슈 #18):** `PATCH /reports/{reportId}/reject`가 (a) reportId만 키라 사정사별 거절 불가, (b) body 명세에 회원가입 내용이 잘못 붙음. **사정사별 거절 엔드포인트 신설** 요청(`PATCH /reports/{reportId}/proposals/{adjusterId}/reject`, body 없음 가정). 확정 전 FE는 MSW mock로 진행.

## 8. 손해사정사 검수 화면 (#10 adjusterReview) — 사용자 확정 (2026-06-22)

사진 1·2 기준 리치 검수 모델. 명세 `GET/PATCH /reports/{reportId}`는 빈약(issue=string[]) → 아래는 FE 리치 모델로 **MSW 풀 목킹**, 실제 PATCH 계약 확장은 백엔드 협의 필요(드리프트).

### 쟁점 상태 enum (UPPER_SNAKE) — 기존 `issue.status`(CONFIRMED/TRUSTED/INFO, 고객 신뢰도용)와 **별개**
| 한글 | 값 |
|------|----|
| 미검토 | `PENDING` |
| 인정 | `ACCEPTED` |
| 수정 | `MODIFIED` |
| 제외 | `EXCLUDED` |

### 리치 쟁점(reviewIssue) 필드
| 개념 | 필드 | 타입 | 비고 |
|------|------|------|------|
| 쟁점 식별자 | `id` | string | 로컬/신규 쟁점 포함 |
| 제목 | `title` | string | |
| 설명 | `description` | string | |
| 영향 금액 | `impactAmount` | number(int) | 사진 '+약 350만', 인정/수정 시 보상범위 반영 |
| 상태 | `status` | 위 enum | |
| 수정 사유 | `modifiedReason` | string\|null | MODIFIED 시 입력 |
| 제외 사유 | `excludedReason` | string\|null | EXCLUDED 시 입력 |
| 사정사 의견 | `adjusterOpinion` | string\|null | 각 쟁점 하단 코멘트 |
| 근거 태그 | `tags` | string[] | 약관/판례(기존 issue.tag 복수화) |
| 신규 여부 | `isNew` | boolean | 사정사 추가 쟁점 |

### 가입 보험 (사진 "OO손해보험 · 행복드림")
| 개념 | 필드 | 타입 |
|------|------|------|
| 가입 보험(보험사·상품) | `insuranceName` | string\|null |

⚠️ GET /reports/{id} 명세 미존재 → MSW 목킹, 백엔드 반영 요청.

### 확정 보상범위 / 종합의견
| 개념 | 필드 | 타입 |
|------|------|------|
| 사정사 확정 최소 | `confirmedMinAmount` | number(int) |
| 사정사 확정 최대 | `confirmedMaxAmount` | number(int) |
| 종합 의견 | `review` | string (명세 PATCH 필드 그대로) |

### 입원 (명세 POST /reports 기준 — 배열)
| 개념 | 필드 | 타입 |
|------|------|------|
| 입원 리스트 | `hospitalizations` | `Hospitalization[]` |
| 입원일 | `hospitalStart` | string\|null(date) |
| 퇴원일 | `hospitalEnd` | string\|null(date) |
| 입원 사유 | `hospitalReason` | string\|null |

⚠️ 입원은 **다건 가능**(배열). 단일 `hospitalStart`/`hospitalEnd` top-level 금지.

### 검수 쿼리키 / 훅
| 개념 | 식별자 |
|------|--------|
| 쿼리키 factory | `reviewKeys`(`pending`, `detail(reportId)`) |
| 대기목록 훅 | `usePendingReviews` |
| 상세 훅 | `useReviewDetail` |
| 제출 뮤테이션 | `useSubmitReview` |
| 로컬 검수 상태 | `useReviewDraft`(useReducer) |
| 사건 표시 ID | `caseId`(YYYYMMDD-NNN) / 라우팅 키 `reportId`(uuid) |

## 출처

- API 명세서 DB: `collection://7ce30798-f08f-82ee-81bb-875a29ed96bd` (필드·enum 단일 진실)
- 의미·라벨·플로우: [[domain-glossary]]
