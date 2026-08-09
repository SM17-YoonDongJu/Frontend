# API 명세 추가/확장 초안 — 손해사정사 자격 인증 (이슈 #44)

> 목적: 기확정된 `POST /users/adjuster-applications` body에 **UI 수집 필드(phone·specialties)** 를 정의하고, **신분증(idCardImageUrl) 제거**와 **반려 후 재제출 방식**을 명세에 확정하기 위한 초안.
> **경로·필드는 백엔드 확정이 단일 진실.** 아래 3개 엔드포인트는 Notion API 명세서 DB에 이미 존재(경로/봉투/에러코드/상태 enum 확정). 본 초안은 **body 변경 + 재제출 상태전이**만 제안한다(신규 엔드포인트 아님).

## 대상 엔드포인트 (기존, 확정)
| 경로 | 메서드 | 도메인 | 비고 |
|------|--------|--------|------|
| `/users/adjuster-applications` | POST | user | 자격 신청 생성 (body 변경 제안 대상) |
| `/users/adjuster-applications/me` | GET | user | 본인 신청 상태 조회(심사/반려 분기) |
| `/uploads` | POST | report | multipart 파일 업로드 → `{ url }` |

접근 권한: 로그인 필수. 비로그인 → `401 LOGIN_REQUIRED`. 대상 role = `UNCERTIFICATED_ADJUSTER`.

## 제안 1 — 신청 body에 `phone`·`specialties` 정의 추가

### 배경
Figma 모바일 신청 퍼널(STEP1 연락처 / STEP2 전문분야 복수 선택)이 수집하나, 현행 `POST /users/adjuster-applications` body에는 **필드가 없다**. FE는 확장 스키마(`adjusterApplicationExtendedBodySchema`)로 전송 중이며, 명세 확정 시 본 스키마로 병합한다.

### 추가 요청 필드 (request body)
| 필드 | 타입 | 필수 | 출처(UI) | 비고 · 확정 질의 |
|------|------|:---:|---------|-----------------|
| `phone` | string | Y | Figma 모바일 STEP1 연락처 | 형식 `010-0000-0000`. 저장 대상 컬럼? `USER.phone`과 동일값인지, 신청 스냅샷인지 |
| `specialties` | string[] | N | Figma 모바일 STEP2 전문분야 복수 선택 | 값셋: 후유장해 · 교통사고 · 실손 의료비 · 암·진단비 · 배상책임(대인) · 산재 연계. **자격구분 `speciality`(신체/종합)와 별개 개념.** 프로필 `specialties`(`/adjusters/me/profile`)와 동일 값셋인지 확인 |

> ⚠️ 확정 필요: 두 필드를 신청 시점에 저장할지(스냅샷) vs 프로필/유저에서 파생할지. 미저장이면 FE는 전송을 제외하도록 정정한다.

### 제거 요청 필드
| 필드 | 현행 명세 | 요청 | 사유 |
|------|:---:|:---:|------|
| `idCardImageUrl` | Y (필수) | **삭제** | Figma 신청 화면(PC 131-10583 / 모바일 STEP3 1143-8632)에 **신분증 업로드 항목이 없음**. 기획 확정으로 신분증 수집 자체를 폐지 |
| `email` | (없음) | 정의 불필요 | 신청 시 재수집 안 함(가입 계정 이메일 사용) |

- 이에 따라 **증빙 서류는 자격증 사본(`licenseImageUrl`)·등록증(`registrationImageUrl`) 2종**만 남는다.
- 상태 조회 응답의 `documents[].type`에서도 **`ID_CARD` 제거** 필요(현행 FE는 `LICENSE`·`REGISTRATION` 2종만 파싱).

## 제안 2 — 반려 후 재제출 방식 (재-POST 재허용)

### 배경
명세는 최초 `POST`만 정의. 반려(REJECTED) 후 재제출 경로가 미정이라, 재-POST 시 `409 DUPLICATE_RESOURCE` 충돌 우려.

### 제안 상태전이
| 현재 상태 | 재-POST 결과 |
|-----------|-------------|
| 미신청 | `201` + `PENDING` 생성 |
| `PENDING` / `APPROVED` | `409 DUPLICATE_RESOURCE` (중복 신청 차단) |
| `REJECTED` | **`201` + `PENDING` 재생성 허용** (재제출) |

- 대안: `PATCH /users/adjuster-applications/me` 또는 `POST .../me/resubmit` 별도 경로. **⚠️ 백엔드 확정 필요** — REJECTED에서 재-POST 허용 vs 전용 resubmit 경로 중 택1.
- FE/MSW는 확정 전까지 **"REJECTED에서 재-POST 201 재허용"** 가정으로 구현.

## `GET /users/adjuster-applications/me` — 상태 응답
### Response `200`
```json
{
  "status": "200",
  "message": "정상 처리되었습니다.",
  "data": {
    "applicationId": "<uuid>",
    "status": "PENDING | APPROVED | REJECTED",
    "submittedAt": "<ISO>",
    "name": "<string>",
    "speciality": "신체 | 종합",
    "licenseNo": "<string|null>",
    "documents": [{ "type": "LICENSE|REGISTRATION", "status": "PENDING|APPROVED|RESUBMIT_REQUIRED" }],
    "rejectedAt": "<ISO|null>",
    "rejectReason": "<string|null>"
  }
}
```
### 실패 봉투
```json
{ "status": "404", "code": "POST_NOT_FOUND", "message": "신청 이력이 없습니다." }
{ "status": "401", "code": "LOGIN_REQUIRED", "message": "로그인이 필요합니다." }
```
- FE는 `404 POST_NOT_FOUND`를 에러가 아닌 정상 분기(`NOT_APPLIED` → 신청 폼)로 처리.

## 백엔드 확정 대기 항목
1. **`phone` 정의** — 신청 body 추가 여부·필수 여부·저장 컬럼.
2. **`specialties` 정의** — 신청 body 추가 여부·값셋(프로필 `specialties`와 동일 여부).
3. **`idCardImageUrl` 삭제** — 신청 body 및 상태 조회 `documents[].type`(`ID_CARD`)에서 제거.
4. **반려 후 재제출** — REJECTED 재-POST 허용 vs 전용 PATCH/resubmit 경로.
5. `licenseNo`(UI "손해사정사 등록번호") ↔ 등록증(`registrationImageUrl`) 개념 구분 확인.

## 확정 후 조치
1. Notion API 명세서 DB `POST /users/adjuster-applications` 행 body 갱신(phone·specialties 추가, idCardImageUrl 삭제) + `GET .../me` documents type 갱신 + 재제출 방식 반영.
2. `_model/adjuster-application.schema.ts`·MSW 핸들러를 확정 shape 거울로 정정(확장 스키마 → 명세 스키마 병합).
3. naming-dictionary §3 갱신(phone·specialties 추가, idCardImageUrl·ID_CARD 제거).
