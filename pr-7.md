## 🔗 관련 이슈
Closes #7

## ✅ 작업 내용

### 화면마다 버튼·입력·라벨을 인라인으로 복붙하던 걸, 공용 컴포넌트로 통일했습니다

프로젝트에서 제일 많이 쓸 3종(Button·Input·Label)을 `shared/ui`로 모았습니다. 단순히 이번 3개만 만든 게 아니라 **컴포넌트 라이브러리의 기반**을 까는 작업입니다. 보험 플랫폼은 곧 Dialog·Select·Combobox·Toast처럼 직접 만들기 까다로운 a11y 컴포넌트가 필요해질 텐데, 그때 `shadcn add`로 가져오면 되도록 shadcn 인프라(cva·cn·components.json)를 먼저 깔았습니다.

다만 shadcn 기본 룩을 그대로 쓰지 않고 **#12에서 박은 디자인 토큰으로 리스킨**했습니다. shadcn은 구조를 빌려오고, 색·radius·폰트는 우리 토큰이 단일 진실입니다. 그리고 컴포넌트를 눈으로 확인하면서 만들려고 Storybook을 먼저 세웠습니다(CDD).

<br/>

### 1. Storybook 셋업

`@storybook/nextjs-vite`로 Storybook을 깔고, `preview`에서 `globals.css`를 임포트해 #12 토큰이 스토리에 그대로 적용되도록 했습니다. `init`이 vitest·playwright·chromatic 같은 테스트 스택까지 끌고 왔는데, 이번 범위(컴포넌트 뷰잉 + a11y)엔 불필요하고 playwright 바이너리 설치도 실패해서 걷어냈습니다. 스토리는 컴포넌트와 같은 폴더에 두는 코로케이션 방식입니다.

<br/>

### 2. shadcn 인프라

- `cn()` 유틸(`clsx` + `tailwind-merge`)과 `cva`를 추가했습니다.
- `components.json`으로 `shadcn add` 시 컴포넌트가 `@/shared/ui`에 떨어지도록 alias를 잡았습니다.
- shadcn semantic 토큰(`--primary`·`--destructive`·`--ring`·`--border`·`--input`…)을 #12 팔레트에 매핑했습니다. 나중에 stock shadcn 컴포넌트를 그대로 가져와도 우리 색을 쓰게 됩니다.

```css
:root {
  --primary: var(--color-ink);
  --destructive: var(--color-terra);
  --ring: var(--color-gold);
  --border: var(--color-line);
}
@theme inline {           /* → bg-primary / ring-ring 등 유틸 생성 */
  --color-primary: var(--primary);
  --color-destructive: var(--destructive);
}
```

<br/>

### 3. Button

shadcn Button 패턴(`cva` + `cn`)을 따르되 #12 토큰으로 다시 칠했습니다.

- `variant`: `primary`(ink) · `gold` · `outline` · `ghost` · `danger`(terra)
- `size`: `sm` · `md` · `lg`
- `loading`(스피너 + 클릭 잠금) · `full` · `icon` · `iconLeft`

```tsx
import { Button } from "@/shared/ui/Button";

<Button variant="gold" size="lg" icon={<ArrowRight />}>다음</Button>
<Button variant="outline">취소</Button>
<Button variant="danger">삭제</Button>
<Button loading>전송 중…</Button>
<Button full>가로 꽉 채우기</Button>
```

<br/>

### 4. Input

원본 디자인의 `Field`에서 라벨을 떼어내고, 입력 컨트롤만 담당하게 했습니다.

- `text` · `select`(네이티브 + chevron) · `multiline`(textarea)
- `hint` · `error`(→ terra 보더 + 하단 메시지) · `suffix`(단위 문자열 또는 버튼 같은 노드)
- 포커스 시 골드 링(`focus:ring-gold-soft`)

```tsx
import { Input } from "@/shared/ui/Input";

<Input placeholder="예) 경추 염좌" />
<Input suffix="%" hint="모르면 비워두셔도 됩니다." />
<Input error="등록번호 형식이 올바르지 않아요." />
<Input multiline rows={4} placeholder="상해 경위를 적어주세요." />

<Input type="select" defaultValue="후유장해">
  <option>후유장해</option>
  <option>진단비</option>
</Input>

{/* suffix에 버튼 같은 노드도 가능 */}
<Input placeholder="010-0000-0000" suffix={<Button size="sm" variant="outline">인증요청</Button>} />
```

<br/>

### 5. Label

- 일반 라벨(`text-ink-2`) / `kicker` 라벨(골드 대문자)
- `htmlFor`로 인풋과 연결 (a11y)

```tsx
import { Label } from "@/shared/ui/Label";

<Label kicker>Design System</Label>

{/* 라벨 + 인풋 조합 (htmlFor ↔ id) */}
<Label htmlFor="diagnosis">진단명 · 상해 부위</Label>
<Input id="diagnosis" placeholder="예) 경추 염좌" />
```

## 💬 고민했던 부분

### 왜 shadcn인가 (직접 구현 대신)

처음엔 디자인 원본 스펙대로 무의존 직접 구현을 생각했습니다. Button·Input·Label만 보면 Radix 같은 게 필요 없어서요. 그런데 장기로 보면 곧 Dialog·Select·Combobox·Popover·Toast가 필요해지고, 얘들을 접근성까지 챙겨 직접 만드는 건 비용이 큽니다. shadcn은 copy-paste 소유 모델이라 코드는 우리가 들고 있으면서 토큰으로 리스킨할 수 있고, Tailwind v4도 `@theme inline`으로 정식 지원합니다. 그래서 "지금 3종은 직접, 기반은 shadcn"으로 가는 하이브리드를 택했습니다. Radix·lucide 같은 무거운 의존은 실제로 복잡한 컴포넌트를 도입할 때 추가합니다.

### Icon·Spinner를 별도 컴포넌트로 안 만든 이유

원본 디자인 시스템의 Button은 자체 `Icon`·`Spinner` 컴포넌트에 의존했는데, 이번 범위(Button·Input·Label)엔 그 둘이 들어있지 않았습니다. 그래서 Button이 아이콘셋을 소유하는 대신 `icon`·`iconLeft`를 **`ReactNode`로 받게** 했습니다. 소비처가 원하는 아이콘을 넘기면 슬롯에 끼우는 방식이라 더 유연합니다. 로딩 스피너도 별도 컴포넌트 없이 Button 안에 작은 인라인 SVG(`animate-spin`)로 처리했습니다.

### select는 네이티브 유지

shadcn Select(Radix 기반) 대신 네이티브 `<select>` + 인라인 chevron을 유지했습니다. 의존성 0이고 모바일 친화적이라, 커스텀 옵션 스타일이 꼭 필요해지기 전까진 네이티브가 낫다고 봤습니다.

### Label은 Input과 분리

원본 `Field`는 라벨+입력이 한 묶음이지만, 재사용성을 위해 `Input`과 `Label`을 분리했습니다. 라벨+힌트+입력을 한 단위로 묶고 싶으면 후속으로 `Field`를 추가하면 됩니다.
