---
name: component-build
description: 손해사정 플랫폼 Next.js App Router UI 구현 패턴. 페이지·컴포넌트 작성, 라우트그룹((customer)/(partner)/(auth)), Server/Client 경계, Tailwind 스타일, 로딩/빈/에러 상태, 접근성. React 컴포넌트나 page.tsx를 만들거나 화면을 구현할 때 반드시 사용.
---

# Next.js App Router 컴포넌트 구현 패턴

대상: React 19 + Next.js 16 App Router + Tailwind 4. 코드 컨벤션은 `code-conventions` 스킬과 함께 적용한다(이 스킬은 "어떻게 만드나", 컨벤션 스킬은 "어떻게 잘 쓰나"). 시각 디자인 완성도가 필요한 화면은 `frontend-design` 스킬을 품질 가이드로 참조하되, 아래 프로젝트 규칙(Tailwind 토큰·3상태·접근성)이 항상 우선한다.

## 라우트그룹 = 역할 경계
```
app/
├─ ()/            랜딩·공개 (SSG 기본)
├─ (customer)/    일반 사용자 — 홈·분석신청·리포트결과·내리포트
├─ (partner)/     손해사정사 — 검수대기·검수화면·검수완료
└─ (auth)/        로그인·회원가입 퍼널
```
- 라우트그룹별 `layout.tsx`로 역할 셸(네비·가드) 분리. 역할 가드는 레이아웃에서 한 번.
- 회원가입 퍼널처럼 단계마다 고유 URL이 필요하면 중첩 폴더로 단계 분리(`(auth)/signup/verify`, `/terms`, `/done`).

## Server / Client 경계
- **기본은 서버 컴포넌트.** `"use client"`는 상호작용·브라우저 API·TanStack Query 훅을 쓰는 잎(leaf)에만.
- 페이지 셸(레이아웃·정적 영역)은 서버 컴포넌트로 두고, 인터랙티브 조각만 클라이언트 컴포넌트로 분리해 import.
- CSR 화면(마이·상세·폼·업로드)도 전체를 클라이언트로 만들지 말고, 데이터 의존 부분만 클라이언트 경계로.
- `query-provider`·`mock-provider`는 이미 `app/layout.tsx`에 있음 — 페이지에서 다시 감싸지 않는다.

## 데이터 화면 3상태 (필수)
데이터를 받는 컴포넌트는 세 상태를 빠짐없이 표현. 누락 = 빈 화면 버그.
```tsx
"use client";
function ReportList() {
  const { data, isPending, isError } = useReportList();
  if (isPending) return <ReportListSkeleton />;        // 로딩
  if (isError) return <ErrorState onRetry={...} />;    // 에러
  if (data.length === 0) return <EmptyState />;        // 빈
  return <ul>{data.map(r => <ReportCard key={r.id} report={r} />)}</ul>;
}
```
- 빈 상태 문구는 기획 카피 사용(예: "조건에 맞는 사정사가 없어요").
- 폴링 리스트(요청 리스트·프로세스)는 staleTime 0 훅을 그대로 소비. 컴포넌트는 폴링을 모른다(예측가능성).

## 타입은 소비만
- 데이터 타입은 data-engineer의 `z.infer` export를 import. **컴포넌트에서 interface 재정의 금지**(드리프트 원인).
- props는 도메인 타입을 받되, 필요한 필드만 좁혀 받는다(`Pick`).

## Tailwind 스타일
- 기존 토큰 따르기: 다크모드 `dark:` 변형, `app/layout.tsx`의 `bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100`.
- 매직 색/간격 반복되면 컴포넌트로 추출하거나 공통 클래스 묶음으로. 인라인 long-class는 가독성 위해 논리 그룹 순서(layout → spacing → color → state)로 정렬.
- 모바일 우선: 기본이 모바일, `md:` 이상에서 데스크탑. 기획의 "모바일은 필터칩+카드" 같은 반응형 분기 반영.

## 접근성 기본
- 인터랙티브 요소는 의미 태그(`<button>`, `<a>`) 사용, `div onClick` 지양.
- 폼 입력은 `<label>` 연결. 이미지·아이콘 버튼은 `aria-label`.
- 포커스 가시성 유지(Tailwind `focus-visible:`).

## 공통 UI 승격 기준
같은 컴포넌트를 2개 이상 기능이 쓰면 `shared/ui/`로. 1곳만 쓰면 `features/<name>/ui/`에 유지(성급한 공유화 = 결합도 ↑).

## 합성·재사용 패턴
custom hook(로직 추출)·compound component(복합 UI, 예: 검수화면)·render props가 필요하면 `references/react-patterns.md`를 읽는다. 각 패턴을 4원칙으로 판단하는 기준이 정리돼 있다. 조각이 단순하면 패턴 없이 props가 정답.
