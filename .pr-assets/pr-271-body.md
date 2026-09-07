## 🔗 관련 이슈

Closes #271

## ✅ 작업 내용

### 서류 업로드가 끝나기 전에는 분석 신청이 제출되지 않도록 막았습니다
<img width="640" alt="업로드 중 진행 차단" src="https://raw.githubusercontent.com/SM17-YoonDongJu/Frontend/3512a5d0ed331ab86e6bc4d09a9ef2858d68665c/.pr-assets/issue-271/02-uploading-blocked-desktop.png" />

업로드 응답이 오기 전에 `POST /reports`가 나가면 `documents`가 비어 백엔드가 OCR job을 만들지 못했습니다. 업로드 상태를 퍼널로 옮겨 응답 유실을 없애고, 업로드 중이거나 필수 서류가 없으면 진행을 막았습니다.

<br/>

### 1. 업로드 상태를 퍼널로 이관

퍼널은 현재 단계 하나만 렌더하므로 상태가 `Step6Documents`에 있으면 단계를 넘길 때 언마운트됩니다. 관찰자가 사라진 `mutate()`는 콜백을 호출하지 않아 업로드가 S3까지 성공해도 url이 폼에 반영되지 않고 유실됐습니다. 상태 소유권을 퍼널로 올리고 컨텍스트로 내려보냅니다.

```tsx
// _components/AdjustRequestFunnel.tsx
// 업로드 상태는 단계가 아니라 퍼널이 소유한다 — 단계 이동으로 언마운트되면 응답 url이 유실된다.
const documentUpload = useDocumentUploadState(form, !draftPrompt.open);
```

#### 세부 작업
* `use-document-upload.ts` → 훅을 `useDocumentUploadState(form, ready)`로 바꾸고 `DocumentUploadProvider`·`useDocumentUpload` 분리
* draft 복원 결정 전에는 슬롯 복원을 미뤄 복원값이 빈 상태로 덮이지 않게 처리
* `Step6Documents` → 컨텍스트에서 값을 받아 표시만 담당

<br/>

### 2. 업로드 응답 유실·슬롯 경합 방지

mutation 훅의 관찰자는 하나뿐이라 슬롯을 연달아 올리면 앞선 요청의 콜백이 호출되지 않습니다. `mutateAsync`를 await하고, 슬롯별 요청 표식으로 늦게 도착한 응답이 최신 상태를 덮지 않게 했습니다.

```ts
// _hooks/use-document-upload.ts
const token = (latestRequest.current[key] ?? 0) + 1;
latestRequest.current[key] = token;
const { url } = await uploadFile(file);
if (latestRequest.current[key] !== token) return;
```

#### 세부 작업
* 슬롯·기타 서류 업로드 실행부를 각각 async 함수로 분리
* `removeSlot` → 표식을 넘겨 진행 중이던 응답이 삭제된 슬롯을 되살리지 않게 처리

<br/>

### 3. 업로드 중·필수 서류 미첨부 시 진행 차단

<img width="640" alt="필수 서류 미첨부 차단" src="https://raw.githubusercontent.com/SM17-YoonDongJu/Frontend/3512a5d0ed331ab86e6bc4d09a9ef2858d68665c/.pr-assets/issue-271/01-required-blocked-desktop.png" />

`documentUrls`가 `nullish()`라 첨부 없이 통과했고, 푸터는 `createReport.isPending`만 보고 있어 업로드 중에도 다음·제출이 눌렸습니다.

```ts
// _model/report-request.schema.ts
.refine((v) => REQUIRED_DOCUMENT_SLOTS.every((d) => v.documentSlots?.[d.key]?.url), {
  path: ["documentUrls"],
  message: `${REQUIRED_DOCUMENT_LABELS} 첨부 후 진행할 수 있어요.`,
});
```

#### 세부 작업
* `isUploading` → 퍼널 `handleNext`에서 다음 단계·제출 차단
* `step6DocumentSchema` → 필수 슬롯(진단서·보험증권) 검증 추가
* `Step6Documents` → "첨부를 권장해요" 문구를 진행 조건 표현으로 교체

<br/>

### 4. 차단 안내를 토스트로 노출

<img width="360" alt="모바일 업로드 중 차단" src="https://raw.githubusercontent.com/SM17-YoonDongJu/Frontend/3512a5d0ed331ab86e6bc4d09a9ef2858d68665c/.pr-assets/issue-271/04-uploading-blocked-mobile.png" />

모바일은 푸터가 화면 하단에 고정돼 있어 인라인 안내가 시야 밖으로 밀립니다. 안내를 토스트로 바꿨습니다. 서류 단계는 값을 입력하는 필드가 없어 폼 에러가 화면에 드러나지 않으므로 검증 결과도 토스트로 알립니다.

#### 세부 작업
* 제출 실패 안내도 같은 토스트 경로로 통합해 인라인 메시지 영역 제거

## 🧪 테스트

Playwright + MSW **E2E 33개**(`apps/web/e2e/adjust-request-upload.spec.ts` 신규, 기존 2개 스펙 갱신). chromium·mobile-chrome·mobile-safari 전부 통과했습니다.

| # | 테스트 | 검증 내용 |
|---|--------|-----------|
| 1 | 서류 업로드가 끝나기 전에 다음을 누르면 안내와 함께 막힌다 | 업로드 응답을 늦춘 상태에서 진행 차단과 안내 노출 확인 |
| 2 | 필수 서류 없이 다음을 누르면 안내가 뜨고 서류 단계에 머문다 | 필수 슬롯 검증으로 6단계 이탈 차단 확인 |
| 3 | 업로드를 마치고 제출하면 요청 본문에 서류가 포함된다 | `POST /reports` body의 `documents` 2건과 `s3_url` 확인 |

기존 `adjust-request.spec.ts`·`adjust-request-mobile.spec.ts`의 6단계 생략 경로는 필수 첨부 후 진행하도록 갱신했습니다. 퍼널 step1~5 진행과 서류 첨부는 `_adjust-request-helpers.ts`로 추출해 세 스펙이 함께 씁니다.

## 💬 특이사항 / 고민했던 부분 / 결정 사항

### 제출 body 관측 방법

이슈에서는 MSW 핸들러가 받은 body를 `mock:lastReportCreateBody`로 남기는 방안을 적었습니다. 대신 스펙 안에서 페이지 `fetch`를 감싸 실제로 나간 body를 모으는 방식으로 구현했습니다. MSW가 서비스 워커에서 요청을 가로채 Playwright의 `postData`가 비는 문제는 동일하게 해결되면서, 공용 핸들러에 테스트 전용 상태를 추가하지 않아도 됩니다. 업로드 지연도 핸들러 knob 대신 스펙의 `page.route`로 주입했습니다.

### 필수 서류 범위

필수 슬롯은 기존 `DOCUMENT_SLOTS` 정의(진단서·보험증권)를 그대로 단일 진실로 씁니다. 안내 문구도 이 정의에서 라벨을 만들어 붙이므로 슬롯 정의만 바꾸면 검증과 문구가 함께 따라갑니다.

## 🔜 후속 이슈

- RN 웹뷰(앱)에서 네이티브 파일 선택기로 고른 파일이 슬롯에 반영되고 업로드 중 진행이 막히는지 실기기 확인
- 필수 서류 없이 들어온 요청을 백엔드가 거절할지 확인
