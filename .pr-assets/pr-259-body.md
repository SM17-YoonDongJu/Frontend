## 🔗 관련 이슈

Closes #259

## ✅ 작업 내용

### 앱 하단 탭바의 안전영역 이중 계상을 없애고 탭 높이를 줄였습니다

네이티브 `SafeAreaView`와 웹 탭바가 하단 안전영역을 각각 한 번씩 먹어 탭바 아래 흰 여백이 생기던 문제를 고쳤습니다. 탭 높이도 관례 높이인 56px로 줄여 본문 영역을 넓혔습니다. 고객 화면에만 따로 있던 하단 탭바는 `AppTabBar`로 통합했습니다.

| 앱 탭바(56px) | 받은 제안 화면(탭바 1개) |
|---|---|
| <img alt="앱 하단 탭바" src="https://raw.githubusercontent.com/SM17-YoonDongJu/Frontend/63ce4b4c/.pr-assets/issue-259/01-tabbar-app-mobile.png" /> | <img alt="받은 제안 화면" src="https://raw.githubusercontent.com/SM17-YoonDongJu/Frontend/63ce4b4c/.pr-assets/issue-259/02-proposals-app-mobile.png" /> |

<br/>

### 1. 하단 안전영역을 웹 탭바에 위임

`SafeAreaView`에 `edges`가 없어 네이티브가 하단 인셋을 흰 여백으로 먹고, 웹 탭바가 `pb-[env(safe-area-inset-bottom)]`로 같은 영역을 한 번 더 넣고 있었습니다. iOS는 상단만 네이티브가 처리하도록 한정해 탭바 배경이 홈 인디케이터까지 이어집니다.

안드로이드 웹뷰는 `env(safe-area-inset-*)` 보고가 불안정해 제스처 바에 탭 라벨이 물릴 수 있습니다. 안드로이드는 기존대로 네이티브가 하단 인셋을 처리하도록 플랫폼을 분기했습니다.

```tsx
// apps/mobile/src/WebViewScreen.tsx
const SAFE_AREA_EDGES: Edge[] = Platform.OS === 'ios' ? ['top'] : ['top', 'bottom'];
```

<br/>

### 2. 탭 높이 축소

`py-2.5` 기준 63px이던 탭 높이를 56px로 고정하고 아이콘·라벨을 세로 중앙 정렬했습니다. 실측값은 탭 아이템 56px, 상단 보더를 더한 탭바 57px입니다.

```tsx
// apps/web/src/shared/ui/AppTabBar.tsx
className="flex h-14 flex-1 flex-col items-center justify-center gap-0.5"
```

<br/>

### 3. 고객 하단 탭바를 AppTabBar로 통합

`CustomerBottomNav`를 제거했습니다. 하단 안전영역 패딩이 없고 "내정보" 링크가 홈(`/customer/dashboard`)을 가리키는 문제에 더해, 유일한 사용처인 받은 제안 화면에서 앱 실행 시 `AppTabBar`와 탭바가 두 개 겹쳐 렌더되고 있었습니다.

#### 세부 작업
* `CustomerBottomNav.tsx` → 삭제, `ReceivedProposalsView`에서 제거
* `received-proposals-list.spec.ts` → 뷰포트별 탭바 노출 테스트를 웹 브라우저 미노출 검증으로 교체

## 🧪 테스트

Playwright + MSW **E2E 12개**(`apps/web/e2e/app-shell.spec.ts`, `apps/web/e2e/received-proposals-list.spec.ts`). 브라우저 3종(chromium·mobile-chrome·mobile-safari)에서 36개 통과했습니다.

| # | 테스트 | 검증 내용 |
|---|--------|-----------|
| 1 | 앱에서 대시보드에 들어가면 4탭 탭바가 보이고 홈이 활성이다 | 앱 UA 탭바 노출·활성 탭 |
| 2 | 웹 브라우저에서 받은 제안에 들어가면 하단 탭바가 보이지 않는다 | 통합 후 웹 탭바 미노출 |
| 3 | 카드를 누르면 해당 리포트의 제안 목록으로 이동한다 | 탭바 제거 후 목록 흐름 회귀 |

## 💬 특이사항 / 고민했던 부분 / 결정 사항

### 웹 모바일 브라우저에서는 받은 제안 화면의 하단 탭바가 사라집니다

`CustomerBottomNav`는 받은 제안 화면에서만 쓰이던 고객 전용 탭바였습니다. 다른 고객 모바일 웹 화면에는 하단 탭바가 없어 이 화면만 예외였고, 통합 후에는 앱에서만 탭바가 보입니다. 웹 모바일에도 탭바를 노출하려면 `AppTabBar`의 앱 전용 조건을 푸는 별도 결정이 필요합니다.

### 안드로이드 실기기 확인이 필요합니다

안드로이드는 네이티브가 하단 인셋을 처리하므로 탭바 배경이 제스처 바까지 이어지지 않습니다. 제스처 바 겹침 여부와 여백 크기는 실기기(EAS 빌드)에서 확인이 필요합니다. iOS도 시뮬레이터가 아닌 실기기에서 홈 인디케이터 영역을 확인해 주세요.
