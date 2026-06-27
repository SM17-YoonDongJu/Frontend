# 검증 게이트 — 스크린샷 대조 우선

산출 코드가 Figma와 맞는지 검증한다. **1순위는 스크린샷 ↔ 스크린샷 대조**(구조·정렬·텍스트), 값 측정은 보조다. 실전에서 미스(가로/세로 구조, 정렬, 텍스트 의역)는 거의 다 스크린샷 대조에서 잡혔다.

## 1순위 — 스크린샷 ↔ Figma 대조

기대값이 필요 없고 전 페이지에 동일하게 쓰인다.

1. **Figma 샷** — `get_screenshot`으로 대상 노드(프레임 전체 + 변형별 하위 노드)를 찍는다.
2. **구현 샷** — dev 서버를 띄우고(`pnpm --filter web dev` → localhost:3000) 재사용 헬퍼로 찍는다:
   ```
   node apps/web/scripts/figma-shot.mjs --url http://localhost:3000/<route> --out <tmp>.png --full
   node apps/web/scripts/figma-shot.mjs --url .../<route> --selector "text=정우성" --closest article   # 카드 1장
   ```
   - `--out` 미지정 시 OS temp로 저장(레포 밖). **PNG는 일회용 — 찍고 대조 후 삭제, 절대 커밋 X**(`.gitignore`로도 막아둠).
3. **눈으로 대조** — 두 이미지를 비교: 전체 구조(컬럼·순서) → 정렬(가운데/양끝) → 표시 텍스트(라벨·버튼·수치 글자 그대로) 순.

### 실행 함정 (이 프로젝트 특유 — 매번 재발함)

- **Bash 툴엔 `node`가 PATH에 없다**(Git Bash). 헬퍼는 **PowerShell 툴로** 실행.
- 헬퍼는 **`apps/web` 안**에 있어야 `@playwright/test` 모듈이 해석된다(레포 루트/`/tmp`에서 import 시 모듈 못 찾음).
- **dev 서버 먼저** 떠 있어야 함. 안 떠 있으면 `ERR_CONNECTION_REFUSED`.
- **한글/중복 텍스트 selector**: `getByText("정우성 사정사")`는 이름+배지가 분리돼 타임아웃 → 부분매칭(`text=정우성`), 카드 단위는 `--closest article`. 같은 문자열이 사이드바·카드에 중복되면 스코프를 좁힌다.

## 2순위(선택) — 값 측정

스크린샷으로 "토큰은 맞는 것 같은데 실제로 안 먹은" 의심이 들 때만(대표: **폰트 family 미로드**). `getComputedStyle`은 항상 px 반환 → rem로 작성해도 비교는 px.

```ts
const s = await el.evaluate((n) => {
  const c = getComputedStyle(n);
  return { fontFamily: c.fontFamily, color: c.color, backgroundColor: c.backgroundColor,
           fontSize: c.fontSize, padding: c.padding, gap: c.gap, borderRadius: c.borderRadius };
});
```
기대값은 `get_design_context` 값(페이지마다 다름 — 재사용 불가, 그래서 범용 스크립트는 만들지 않는다). 색은 hex 정규화, 길이는 ±1px 허용.

## 변형·구조 누락 방지 (이게 진짜 사각지대)

- **레이아웃/구조 불일치**(가로↔세로, 컬럼, 순서)는 값 측정으로 안 잡힌다 → 위 스크린샷 대조로 막는다.
- **색·폰트두께·배경 미세 오류**(ink vs ink-2, semibold vs medium, 없는 배경 발명)는 스크린샷으로 거의 안 보인다 → 각 노드 `get_design_context`의 hex·폰트명·fill을 **코드 토큰과 직접 대조**(figma-mapping §0). metadata로 추측한 섹션이 주범.
- **측정/대조 안 한 노드 = 검증 안 된 것.** 구조가 다른 변형(추천 카드 vs 일반 카드 등)은 **각각 `get_design_context`로 조회**하고 각각 샷을 찍어 대조. "일반 카드 + 배지 = 추천 카드"식 추측 스펙 금지.
  > 실제 사례: 추천 카드를 일반 카드 재사용으로 가정 → 가로형 구조를 통째로 틀림. 일반 카드만 보고 "통과"로 끝내서 못 걸렀음.

## 판정·재시도

| 결과 | 처리 |
|------|------|
| 스크린샷·텍스트 일치 | 통과 |
| 불일치 | **해당 부분만** 지정해 재생성(전체 재생성 X) |
| 2회 초과 잔존 | 중단 → 불일치 리포트를 사용자에게 제시 |

- 색 불일치 → 토큰 미스매핑, `figma-mapping.md §1`로 회귀.
- 정렬/구조 불일치 → auto-layout 매핑(`§4` 정렬축) 재확인.
- 텍스트 불일치 → `§7`(Figma 문자열 그대로) 위반.

통과 못한 채로 "완료" 처리하지 않는다. PNG는 대조 끝나면 삭제한다.
