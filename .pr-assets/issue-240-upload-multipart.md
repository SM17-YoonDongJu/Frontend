## 🔗 관련 이슈

Closes #240

## ✅ 작업 내용

- `POST /uploads`를 `multipart/form-data` 단일 요청으로 교체 — `file`·`purpose` 두 파트를 한 번에 전송하고, presigned 발급과 S3 직접 PUT 단계 제거
- 응답 스키마를 `s3_url` 단일 필드로 교체(소비처에 노출하는 `{ url }` 형태는 유지해 호출부 무변경)
- 신규 에러코드 3종(`UPLOAD_CONTENT_TYPE_NOT_ALLOWED`·`UPLOAD_FILE_EMPTY`·`UPLOAD_FILE_TOO_LARGE`) 추가 및 api-spec 레퍼런스·계약 검사 훅 enum 동기화
- MSW 핸들러를 multipart 수신 → `{ s3_url }` 응답으로 교체, `PUT /uploads/mock-put/:key` 제거, 실패 봉투 6종 반영(`MISSING_REQUIRED_FIELD`·`INVALID_REQUEST`·형식·빈 파일·용량 초과)
- 사전 검증을 purpose별 명세 상한으로 일원화 — `avatar` 5MB/JPG·PNG, 그 외 20MB/PDF·JPG·PNG(webp 미허용)
- 업로드 실패 시 서버 에러코드에 맞는 안내 문구 노출
- 리포트·프로필 세그먼트에 흩어져 있던 업로드 응답 중복 정의를 공용 타입으로 통합

## 🐛 함께 고친 것

- 사정사 지원 서류 업로드가 `image/*` 전체를 통과시켜 명세상 미허용인 webp·svg가 올라가던 문제 수정
- 고객 마이페이지 프로필 사진 업로드에 형식·용량 사전 검증이 없던 문제 수정(실패 시 토스트 안내 추가)

## ✅ 검증

- `pnpm typecheck` · `pnpm lint` 통과
- **업로드 계약 E2E 신규 추가**(`upload-multipart.spec.ts`) — 업로드 4경로 전부에서 네트워크 요청을 직접 확인
  - `POST /uploads` 정확히 1회, `PUT` 0회 (S3 직접 PUT 사라진 것 확인)
  - 요청 `Content-Type: multipart/form-data; boundary=…`
  - 응답 `s3_url`의 key prefix로 purpose 도달 확인(`licenses/`·`avatars/`·`report-documents/`)
  - webp 선택 시 요청이 아예 나가지 않고 안내 문구만 노출
  - chromium·mobile-chrome·mobile-safari 15케이스 통과 — **webkit에서도 multipart가 실제로 파싱됨**
- 기존 E2E 회귀: `adjuster-verification`(형식 위반 케이스 추가) · `adjust-request` · `adjuster-mypage` · `adjuster-profile-edit` 통과
- 레포에 `upload_url`·presigned 업로드 잔재 없음(채팅 첨부의 조회용 presigned GET URL은 별개 엔드포인트라 유지)
