# [Feature] 손해사정 요청 퍼널에 자유 질문 입력 퍼널 추가 (#121)

- 이슈: https://github.com/SM17-YoonDongJu/Frontend/issues/121 (본문 없음 — 이 문서가 명세 원본)
- 브랜치: `feature/121-adjust-request-free-question` (base `origin/dev` @ 368bbe9)
- 워크트리: `C:\Users\wkdrn\project\wt-funnel121`
- Figma: [모바일 1310-2066](https://www.figma.com/design/UueBWCwhdaoNH0lzGF3Bl6/Untitled?node-id=1310-2066) · [PC 1310-1902](https://www.figma.com/design/UueBWCwhdaoNH0lzGF3Bl6/Untitled?node-id=1310-1902)

## 1. 배경

`POST /reports` 요청 바디에 `question`(nullable 자연어) 필드가 **이미 계약돼 있다**. 식별자 사전 `naming-dictionary.md:79`에 등재돼 있고, `createReportBodySchema`(`_model/report-request.schema.ts:92`)에도 정의돼 있다. 소비처인 고객 리포트 상세(`report-detail.schema.ts:36`)·파트너 검수 상세(`review-detail.schema.ts:50`)·MSW 목값(`handlers.ts:2232`)에도 이미 존재한다.

그런데 퍼널에 입력 UI가 없어 `toCreateReportBody()`가 `question: null`을 하드코딩한다(`report-request.schema.ts:173`). 배관만 뚫려 있고 입구가 없는 상태다.

**따라서 이 작업은 백엔드 명세 추가·변경이 필요 없는 순수 프론트 작업이다.**

## 2. 목표

손해사정 요청 퍼널에 자유 질문 입력 스텝을 추가해, 고객이 검수 손해사정사에게 전할 궁금한 점·특이사항을 선택 입력하고 `question`으로 제출한다.

### 하지 않는 것

- 파트너 검수 화면·고객 리포트 상세의 `question` **표시**는 범위 밖 (별도 이슈). 이 작업은 입력·제출까지.
- 백엔드 명세·MSW 계약 변경 없음.

## 3. 스텝 배치 — 5번째, 총 7스텝 (확정)

현재 6스텝 → 7스텝. 새 스텝은 **보험금·보험 다음, 서류 업로드 앞**.

| # | title | 컴포넌트 | 변경 |
|---|---|---|---|
| 1 | 사고 유형 | `Step1AccidentType` | — |
| 2 | 사건 상세 | `Step2TreatmentDetail` | — |
| 3 | 사고 일자 | `Step3AccidentDate` | — |
| 4 | 보험금·보험 | `Step4OfferedAmount` | — |
| **5** | **전할 말** | **`Step5Question`** | **신규** |
| 6 | 서류 업로드 | `Step6Documents` | 5→6 리넘버 |
| 7 | 확인 | `Step7Confirm` | 6→7 리넘버 |

PC 프레임의 `STEP 5 / 7` + 진행바 7칸 + 라벨 "전할 말"과 일치한다.

> **모바일 프레임의 `6 / 8`은 따르지 않는다.** 총 8스텝이 되려면 미상의 스텝이 하나 더 있어야 하는데 존재하지 않는다. 구버전 시안으로 판단해 PC 표기(5/7)를 채택했다. (사용자 확인 완료)

진행바 총 개수는 `FUNNEL_STEPS.length`에서 자동 파생되므로(`funnel-config.ts:26` → `use-funnel.ts:31` → `FunnelProgress` prop) 배열에 넣기만 하면 `5/7`·`STEP 5 / 7`이 자동 반영된다.

## 4. 화면 명세

### 4.1 공통 요소 (Figma 문구 그대로)

| 요소 | 문구 |
|---|---|
| Heading | `손해사정사에게 전할 말이 있나요?` |
| 칩 그룹 라벨 | `이런 걸 많이 물어봐요` |
| 칩 1 | `제안받은 보험금이 적정한지 궁금해요` |
| 칩 2 | `과실 비율에 이의가 있어요` |
| 칩 3 | `이미 합의했는데 추가 청구가 가능할까요?` |
| 칩 4 | `어떤 서류가 더 필요한가요?` |
| 하단 안내(말풍선 아이콘) | `지금 적지 않아도 분석 요청 후 채팅으로 언제든 전할 수 있어요.` |
| 글자수 | `0/500` |

### 4.2 뷰포트별 차이 (Figma 그대로 — 합집합 금지)

PC와 모바일이 실제로 다르다. `fe-figma-fields-no-union` 원칙에 따라 임의 통일하지 않고 각 프레임대로 구현한다.

| | 모바일 (402w) | PC (1280w) |
|---|---|---|
| 필드 라벨 | `궁금한 점 · 특이사항 (선택)` 있음 | **없음** |
| 설명문 | `궁금한 점이나 특이사항을 자유롭게 적어주세요. 검수하는 손해사정사가 함께 확인해요.` | `궁금한 점이나 특이사항을 자유롭게 적어주세요. 검수하는 손해사정사가 함께 확인합니다. (선택)` |
| `(선택)` 위치 | 필드 라벨 뒤 | 설명문 끝 |
| 칩 배치 | 1열 세로 4개 | 2열 그리드 (2×2) |

→ `sm:` 분기로 문구를 각각 렌더. 기존 `Step5Documents.tsx:250-252`가 같은 패턴(`sm:hidden` / `hidden sm:inline`으로 모바일·PC 문구 분리)을 이미 쓰고 있으므로 준용한다.

### 4.3 칩 — 비인터랙티브 예시 (확정)

칩은 **클릭 가능한 버튼이 아니다.** `+` 아이콘은 시각 장식이고, 선택·추가·토글 동작이 없다. 단순히 "이런 걸 물어보면 된다"를 보여주는 툴팁성 예시다.

- 마크업: `<button>` 아님 → `<ul>/<li>` 또는 `<span>`. 포커스·hover·active 스타일 없음, `cursor-default`.
- `question` 값에 영향 없음.

> 근거: 사용자 확정. 시안에도 선택(active) 상태 칩이 없어 인터랙션 흔적이 없다.

### 4.4 입력

- 컴포넌트: `shared/ui/Textarea` 재사용
- 최대 500자 (`maxLength={500}` → 컴포넌트가 `slice`로 하드 컷 + 카운터 자동 노출)
- **선택 입력** — 비워도 다음 진행 가능
- placeholder: 시안에 없음 → 넣지 않음

## 5. 데이터 명세

### 5.1 draft 스키마 — 필드 추가

`adjustRequestDraftSchema` (`_model/report-request.schema.ts:102-118`)에 추가:

```ts
question: z.string().max(500).nullable().optional(),
```

### 5.2 스텝 검증 스키마 — 신규

`step5QuestionSchema` — question이 선택 입력이므로 사실상 통과 스키마지만, `FUNNEL_STEPS[i].schema`가 `firstIncompleteStep()`(`funnel-config.ts:29-34`)의 도달 가드에 쓰이므로 반드시 정의해야 한다. 500자 초과만 막는다.

```ts
export const step5QuestionSchema = z.object({
  question: z.string().max(500, { message: "500자까지 입력할 수 있어요." }).nullish(),
});
```

기존 `step5DocumentSchema` → `step6DocumentSchema`, `step6ConsentSchema` → `step7ConsentSchema` 리넘버.

### 5.3 제출 매핑

`toCreateReportBody()` (`report-request.schema.ts:173`):

```diff
-    question: null,
+    question: draft.question?.trim() || null,
```

빈 문자열·공백만 입력은 `null`로 정규화한다 (`""`를 서버에 보내지 않음).

### 5.4 자동저장

`use-draft.ts`가 `form.watch()` 전체를 직렬화하므로 **추가 작업 없이** `question`이 localStorage(`adjust-request:draft`)에 자동 포함·복원된다.

### 5.5 확인(요약) 스텝

`Step7Confirm`의 요약 목록(`Step6Confirm.tsx:57-69`)에 `SummaryRow`로 질문 노출. 미입력 시 행 자체를 생략한다.

### 5.6 MSW

변경 불필요. `POST /reports` 핸들러(`handlers.ts:1707-1726`)는 `accidentType`만 읽고 나머지 body를 통과시킨다.

## 6. 작업 목록

- [ ] `report-request.schema.ts` — draft에 `question` 추가, `step5QuestionSchema` 신설, 기존 step5/6 스키마 리넘버, `toCreateReportBody`의 `question: null` 해제
- [ ] `shared/ui/Textarea.tsx` — 카운터 박스 안 우측 하단 배치 옵션 추가 (opt-in, 기존 사용처 2곳 회귀 없음) + 스토리 보강
- [ ] `funnel-config.ts` — `FunnelStep`에 `component` 필드 추가, `FUNNEL_STEPS` index 4에 `{ title: "전할 말", schema: step5QuestionSchema, component: Step5Question }` 삽입
- [ ] `_components/Step5Question.tsx` 신규 (+ 칩 예시·안내 포함)
- [ ] `Step5Documents.tsx` → `Step6Documents.tsx`, `Step6Confirm.tsx` → `Step7Confirm.tsx` 리네임
- [ ] `page.tsx:100-105` — 조건부 렌더 6줄 → `<step.component />` 단일화 (§8.2)
- [ ] `Step7Confirm.tsx` — 요약에 질문 행 추가
- [ ] `FunnelProgress.stories.tsx:7, 15` — `total: 6`→`7`, "확인" 스토리 번호 갱신
- [ ] `e2e/adjust-request.spec.ts:38-40` — `fillThroughConsent()` 헬퍼에 전할 말 스텝 통과 추가
- [ ] `e2e/adjust-request-mobile.spec.ts:55-60` — 동일 (헬퍼 미추출 → 별도 패치)
- [ ] `e2e/adjust-request.spec.ts:73-77` — 가드 테스트 `?step=5` → `?step=7` 재조준
- [ ] Figma 검증 게이트 3축 (스크린샷 대조 + 문구 전수표 + 값 실측)

## 7. 완성 조건

- [ ] 퍼널이 7스텝으로 동작하고 진행바가 PC `STEP 5 / 7` · 모바일 `5/7`로 표기된다
- [ ] 5번째 스텝에서 질문을 입력하지 않고도 다음으로 진행할 수 있다
- [ ] 500자를 초과해 입력할 수 없고 카운터가 실시간 반영된다
- [ ] 입력한 질문이 `POST /reports`의 `question`으로 전송된다 (미입력 시 `null`)
- [ ] 새로고침 후 임시저장 복원 시 질문이 유지된다
- [ ] 칩은 클릭해도 아무 일도 일어나지 않는다 (포커스 불가)
- [ ] E2E 데스크톱·모바일 스펙 통과, typecheck·lint 통과

## 8. 결정 사항 (모두 확정 — 사용자 승인 완료)

1. **글자수 카운터 → 공용 `Textarea`에 배치 옵션 추가 (b안 채택)**
   Figma는 `0/500`이 **textarea 박스 안 우측 하단**인데, `shared/ui/Textarea`(`Textarea.tsx:53-64`)는 `0/500자`(`자` 접미사)를 **박스 밖 아래 좌측**에 렌더한다. 공용 컴포넌트에 배치 옵션을 추가한다. 기존 사용처 2곳(`ReviewContentField`, `ExpertiseFields`)의 표시는 회귀 없이 유지 — 새 옵션은 opt-in.

2. **PC 하단 민감정보 안내 → 넣지 않음 (수긍)**
   PC 프레임 하단의 `주민번호·계좌 등 민감정보는 업로드 시 자동으로 가려지며…`는 서류 업로드 스텝 전용 문구다(`Step5Documents.tsx:250-252`, 해당 컴포넌트 JSX 내부에 스코프됨 → 새 스텝으로 누출되지 않음). 시안 프레임 복사 잔재로 판정.

3. **리넘버 채택 + 파생 부수효과 전부 이번 범위에 포함**
   `stepNXxxSchema`·`StepNXxx` 네이밍이 위치를 인코딩해 삽입 때마다 리넘버가 발생한다. 이번엔 리넘버로 가되, 아래 §8.1 부수효과를 **같이 수정**한다.

### 8.1 부수효과 전수 (스텝 삽입으로 깨지거나 같이 고쳐야 하는 지점)

**자동으로 따라옴 (수정 불필요)** — `FUNNEL_STEPS`에서 파생되므로:
`FunnelProgress`의 `current/total`·7칸 분할 바 · `use-funnel.ts`의 clamp·`total`·`isLast` · `page.tsx:33` 인덱스 조회 · `firstIncompleteStep` 가드 · `FunnelFooter`의 `isLast` 라벨 분기 · 인바운드 링크 6곳(모두 `?step` 없는 bare 경로)

**수동 수정 필요:**

| 지점 | 파일:라인 | 내용 |
|---|---|---|
| **렌더 분기 이중 진실** | `page.tsx:100-105` | `currentStep === N` 하드코딩 6줄. 배열과 **따로 노는 두 번째 진실**이고 TS·테스트 어느 쪽도 못 잡는 조용한 어긋남 → **`FunnelStep`에 `component` 추가해 `<step.component />`로 단일화**(§8.2) |
| 스키마 리넘버 | `report-request.schema.ts:59, 68` | `step5DocumentSchema`→`step6…`, `step6ConsentSchema`→`step7…` |
| 컴포넌트 리넘버 | `Step5Documents.tsx:55`, `Step6Confirm.tsx:23` + 파일명 | `Step6Documents`, `Step7Confirm`. **스토리 파일 없음** → Storybook 낙진 없음 |
| 진행바 스토리 | `FunnelProgress.stories.tsx:7, 15` | `total: 6`→`7`, `Step6`("확인") 스토리 번호 갱신. Storybook은 `FUNNEL_TOTAL`과 컴파일 타임 연결이 없어 **조용히 6칸 유지됨** |
| E2E 데스크톱 | `adjust-request.spec.ts:38-40` | `fillThroughConsent()`가 step4 "다음" 후 `관련 서류를 올려주세요`를 기대 → **실제로 깨짐**. 새 스텝 "다음" 클릭 삽입 |
| E2E 모바일 | `adjust-request-mobile.spec.ts:55-60` | 같은 파손. 헬퍼 추출 안 돼 있어 **별도 패치 필요** |
| E2E 가드 테스트 | `adjust-request.spec.ts:73-77` | `?step=5` 직접진입 → step1 리다이렉트. **그대로 통과하지만 커버리지 의도가 퇴색**(빈 draft면 step1 실패로 바운스가 결정돼 대상 스텝 무관). `?step=7`로 재조준 |
| 제출 매핑 | `report-request.schema.ts:173` | `question: null` 해제 |
| 확인 요약 | `Step6Confirm.tsx:57-69` | 질문 행 추가 |
| 주석 | `adjust-request.spec.ts:6`, `adjust-request-mobile.spec.ts:5` | "step1~6"·"6단계" 표기 (미관) |

**영향 없음 확인:**
- **localStorage 구버전 draft** — draft는 **폼 값만 저장하고 스텝 위치는 저장하지 않는다**(`use-draft.ts:39`). 6스텝 시절 draft에 `question`이 없어도 optional이라 통과. 스키마 버전 필드는 레포 전체에 없지만 이번 변경엔 불필요.
- **파트너 퍼널** — `use-review-draft.ts`와 공유 코드 0. 키 스킴·상태관리(`useReducer`) 모두 다르고 스텝 개념 자체가 없다. `use-draft.ts:27`의 "준용" 주석은 패턴 참조일 뿐.
- **`(auth)` 퍼널 2종** — `use-signup-funnel.ts:6`, `use-verification-funnel.ts:6`이 **문자열 스텝 키**를 써서 구조적으로 면역. §8.3이 가리키는 방향의 사내 선례.
- **단위 테스트** — 레포에 없음(E2E-only 전략).

### 8.2 구조 개선 — 렌더 분기 단일화 (이번 범위 포함)

> **`FunnelStep`에 `component` 필드를 넣는 안은 폐기.** `_model/funnel-config.ts`가 `_components/*`를 import하게 되어 **프렉탈 역방향 의존**(데이터층→UI)이고, `fractal-boundary-lint.sh` 규칙 A에 걸려 훅이 block한다.

**채택 — 스텝 key 유니온 + `page.tsx`의 `Record` 매핑:**

```ts
// _model/funnel-config.ts — 컴포넌트를 모른다(경계 유지)
export type FunnelStepKey =
  | "accidentType" | "treatment" | "date" | "insurance" | "question" | "document" | "consent";

export interface FunnelStep {
  key: FunnelStepKey;
  title: string;
  schema: z.ZodType;
}
```
```tsx
// page.tsx — UI층이 데이터층을 참조(정방향)
const STEP_COMPONENTS: Record<FunnelStepKey, ComponentType> = {
  accidentType: Step1AccidentType,
  /* … */
  question: Step5Question,
};
const StepView = STEP_COMPONENTS[step.key];
// …
<StepView />
```

효과: `page.tsx:100-105`의 `currentStep === N` 6줄이 사라지고, **유니온에 key를 추가하면 `Record`가 exhaustive를 강제해 컴파일 에러**가 난다. 기존의 "조용히 어긋나고 TS·테스트 둘 다 못 잡는" 함정이 타입 에러로 바뀐다. key는 위치를 인코딩하지 않아 §8.3 방향과도 맞는다.

### 8.3 향후 (이번 범위 밖)

`stepNXxx` 위치 인코딩 네이밍은 삽입 때마다 리넘버를 강제한다. `(auth)` 퍼널처럼 위치 무관 키로 전환하면 해소되지만, 이번엔 리넘버로 간다.

## 9. 작업 플랜 (커밋 단위)

원칙: **한 커밋 = 컴파일·검증 가능한 최소 의미 단위.** pre-commit 훅이 스테이징된 `.ts/.tsx`에 typecheck·lint를 돌리므로 **모든 커밋이 typecheck를 통과해야 한다.** 팀 이력상 E2E는 `test :`로 분리한다(`e053a01 feat :` → `ed9b836 test :` 선례).

### C1 — 렌더 분기 단일화 (기반 작업, 동작 불변)

| | |
|---|---|
| 파일 | `_model/funnel-config.ts` · `page.tsx` |
| 내용 | `FunnelStepKey` 유니온 + `FunnelStep.key` 추가 / `page.tsx`에 `Record<FunnelStepKey, ComponentType>` 매핑 + `<StepView />`, `currentStep === N` 6줄 제거 |
| 검증 | 6단계 그대로. typecheck · lint · **E2E 전부 green** (동작 불변) |
| 왜 먼저 | C3의 스텝 삽입이 배열 + Record 두 곳이 되고, 누락은 컴파일러가 잡는다. 나중에 하면 C3에서 손댈 게 겹친다 |

```
refactor : 손해사정 요청 퍼널 단계 렌더 분기 단일화

* 단계 정의에 위치 무관 key 추가
* 단계 번호 하드코딩 분기를 key 기준 컴포넌트 매핑으로 교체
* 매핑 누락이 타입 에러로 잡히도록 정리
```

### C2 — Textarea 글자수 표시 옵션 (독립, 소비처 없음)

| | |
|---|---|
| 파일 | `shared/ui/Textarea.tsx` · `Textarea.stories.tsx` |
| 내용 | 카운터를 입력 박스 안 우측 하단에 표시하는 opt-in 옵션 + 스토리 |
| 검증 | 기존 사용처(`ReviewContentField`·`ExpertiseFields`) 무변경 → 회귀 없음. 스토리북으로 확인 |
| 순서 | C1과 무관하므로 앞뒤 바뀌어도 됨 |

```
refactor : Textarea 글자수 표시 위치 옵션 추가

* 입력 박스 안 우측 하단에 글자수를 표시하는 옵션 추가
* 기존 표시 방식을 기본값으로 유지해 사용처 회귀 방지
* Storybook 스토리 추가
```

### C3 — 전할 말 단계 추가 (본체, 7단계 전환)

| | |
|---|---|
| 파일 | `report-request.schema.ts` · `funnel-config.ts` · `page.tsx` · `Step5Question.tsx`(신규) · `Step5Documents.tsx`→`Step6Documents.tsx` · `Step6Confirm.tsx`→`Step7Confirm.tsx` · `FunnelProgress.stories.tsx` |
| 내용 | draft `question` 필드 · `step5QuestionSchema` 신설 · 스키마/컴포넌트 리넘버 · 배열 index 4 삽입 · `STEP_COMPONENTS`에 `question` 항목 · `toCreateReportBody`의 `question: null` 해제 · 확인 단계 요약 행 · 진행바 스토리 `total` 6→7 |
| 검증 | typecheck · lint green. **E2E는 여기서 red** (C4에서 해소) |
| 쪼갤 수 있나 | 없다. 리넘버를 앞에 떼면 `step6DocumentSchema`가 5번 자리에 앉아 **이름이 거짓말**을 하고, 뒤로 미루면 C3이 거짓 이름을 안은 채 커밋된다. 삽입과 리넘버는 한 몸 |

```
feat : 손해사정 요청 퍼널 5단계(전할 말) 추가

* 손해사정사에게 전할 질문을 500자까지 적는 선택 입력 단계 추가
* 자주 묻는 질문 예시와 채팅 안내 문구 표시
* 적은 질문을 분석 요청에 담아 전송하도록 연결
* 확인 단계 요약에 질문 노출
* 서류 업로드·확인 단계를 6·7번으로 리넘버
```

### C4 — E2E 반영

| | |
|---|---|
| 파일 | `e2e/adjust-request.spec.ts` · `e2e/adjust-request-mobile.spec.ts` |
| 내용 | 데스크톱 헬퍼 `fillThroughConsent()`에 전할 말 단계 통과 추가 · 모바일 인라인 흐름 동일 패치 · 직접 진입 가드 `?step=5`→`?step=7` 재조준 · 주석 "6단계" 표기 정정 |
| 검증 | **여기서 E2E green 복구.** 로컬 실행은 전용 포트 + `PLAYWRIGHT_BASE_URL` 필수(3000 포트에 타 워크트리 서버가 붙어 구코드를 테스트하는 사고 이력) |

```
test : 손해사정 요청 퍼널 전할 말 단계 E2E 반영

* 데스크톱·모바일 스펙에 전할 말 단계 통과 추가
* 직접 진입 가드 테스트를 마지막 단계로 재조준
```

### C5 — 스크린샷 (PR 직전)

`_capture-121.spec.ts`로 PC·모바일 캡처 → `.pr-assets/issue-121/`. PR 본문 스크린샷 표에 필요. 캡처 스펙은 CI 제외 대상(`_capture-*`).

### 순서 요약

```
C1 (green) → C2 (green) → C3 (E2E red) → C4 (green) → [Figma 검증 게이트 3축] → C5 → PR(base: dev)
```

C3~C4가 붙어 있어야 브랜치가 green으로 돌아온다. C3에서 멈추지 말 것.

## 10. 참고 — 기존 구조 요약

- 라우트: `apps/web/src/app/customer/adjust-request/page.tsx` (단일 페이지 조건부 렌더, 세그먼트 분리 아님)
- 스텝 위치: URL query `?step=N` (`_hooks/use-funnel.ts:13`, 1..total clamp)
- 폼 상태: react-hook-form + `FormProvider` (page 레벨 유지 → 스텝 언마운트돼도 값 보존)
- 영속: `_hooks/use-draft.ts`, localStorage `adjust-request:draft`, 500ms 디바운스
- 검증: "다음" 클릭 시 스텝 스키마 `safeParse` → `form.setError` 수동 매핑 (RHF resolver 미사용, `page.tsx:42-53`)
- 진행바: `_components/FunnelProgress.tsx` — 단일 컴포넌트 `sm:` 반응형 분기
