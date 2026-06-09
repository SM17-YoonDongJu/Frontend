# React 합성·재사용 패턴 (4원칙 적용)

React 19. 복합 컴포넌트·재사용 로직을 만들 때 읽는다. 패턴은 목적이 아니라 **변경 용이성**의 수단 — 조각이 단순하면 패턴 없이 props가 정답. 아래는 일반 React 설명이 아니라 **이 프로젝트의 결정 기준**이다.

> Context 패턴은 범위 밖.

## 1. Custom Hook — 로직 추출

상태·효과 로직을 함수로 분리해 JSX와 가른다.

```ts
// features/report-request/model/useAccidentForm.ts
export function useAccidentForm(initial?: AccidentInput) {
  const [values, setValues] = useState(initial ?? EMPTY_ACCIDENT);
  const setField = <K extends keyof AccidentInput>(key: K, v: AccidentInput[K]) =>
    setValues((prev) => ({ ...prev, [key]: v }));
  const result = accidentSchema.safeParse(values);
  return { values, setField, isValid: result.success, errors: result.error?.flatten() };
}
```

**프로젝트 규칙:**
- **반환 모양 일관(예측가능성)**: 데이터 훅은 `{ data, isPending, isError }`(쿼리 훅 모양), 폼 훅은 `{ values, setField, isValid, errors }`. 같은 종류면 같은 모양.
- **배치(응집성)**: 기능 전용 훅은 `features/<name>/model`(또는 `api`)에. 종류별 `hooks/`에 모으지 않는다.
- **승격(결합도)**: 2곳+ 쓰는 훅만 `shared/hooks`로. 1곳뿐이면 올리지 않는다.
- **추출 시점**: 로직이 2곳+ 반복 / 본문에서 "무엇을 렌더"가 안 보일 때. 한 번 쓰고 단순하면 인라인 유지(성급한 추출 금지).

## 2. Compound Component — 복합 UI 합성

부모가 상태를 쥐고 자식들이 그 맥락을 공유. **검수화면**(쟁점 목록 + 인정/수정/제외 판정 토글 + 집계 + 진행바)처럼 조각 많은 복합 UI에 적합.

```tsx
<IssueReview issues={issues} onVerdict={handleVerdict}>
  <IssueReview.Summary />      {/* 인정/수정/제외 집계 */}
  <IssueReview.ProgressBar />  {/* 판정 진행률 */}
  <IssueReview.List />         {/* 쟁점 + 판정 토글 */}
</IssueReview>
```

**프로젝트 규칙:**
- 사용부가 화면 구조를 선언적으로 드러낸다(가독성) — props 수십 개 단일 컴포넌트보다 낫다.
- 한 조각은 한 역할(예측가능성). `List`가 집계까지 하지 않는다.
- 관련 하위는 한 파일/폴더에 묶고 `IssueReview.*` 네임스페이스로(응집성).
- **남용 금지(결합도)**: 조각 2~3개로 단순하거나 배치 고정이면 그냥 props 컴포넌트. 공통 상태 공유 + 사용부가 배치를 조절해야 할 때만.

## 3. Render Props
로직 공유는 custom hook으로 한다. render prop은 **렌더 방식 자체를 주입**해야 하고 훅+children으로 안 풀릴 때만(드묾, 예: 측정값 기반 자식 렌더). 로직 공유 목적의 새 render prop은 만들지 않는다.

## 4. 선택 판단
- 로직 재사용 → **custom hook**
- 공통 상태 공유 + 사용부가 구조 조립 → **compound**
- 렌더 주입 필요 + 훅으로 안 풀림 → **render prop**(드물게)
- 그 외 → **패턴 없이 props** (가장 흔한 정답)

> "비슷해 보임"이 아니라 "같은 이유로 함께 바뀜"일 때만 묶는다(결합도).
