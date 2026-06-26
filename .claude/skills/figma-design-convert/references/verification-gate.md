# 검증 게이트 — 계산스타일 값 대조

산출 코드가 Figma 디자인과 맞는지 **픽셀 비교가 아니라 값 대조**로 검증한다. Figma Dev Mode가 주는 정확값(px·색·폰트·gap)을 진실로 두고, 렌더된 DOM의 `getComputedStyle`을 추출해 항목별로 비교한다. 픽셀/비전 비교는 비범위(폰트 힌팅·안티앨리어싱 노이즈로 false diff).

## 왜 값 대조인가

- 결정론적·빠름·비전 노이즈 0.
- 틀린 이유가 구체적("width 320 기대 / 312 실제", "색 토큰 불일치")이라 재생성 피드백이 한 번에 수렴.
- 픽셀 diff는 임계치 튜닝 지옥 + 재시도 토큰 비용. 보조 수단으로도 이번 범위 제외.

## 절차

1. **기준값 추출** — `get_variable_defs`/`get_code`에서 대상 노드의 기대값 수집:
   색(→ 매핑된 토큰의 hex), 글자색/크기/두께, padding·gap, width/height, radius.
2. **렌더** — 산출 컴포넌트를 Storybook 스토리로 마운트(페이지 임시 마운트 금지).
3. **실제값 추출** — Playwright로 스토리 렌더 후 대상 요소의 `getComputedStyle` 수집.
   ```ts
   const s = await el.evaluate((n) => {
     const c = getComputedStyle(n);
     return { color: c.color, bg: c.backgroundColor, fontSize: c.fontSize,
              fontWeight: c.fontWeight, padding: c.padding, gap: c.gap,
              borderRadius: c.borderRadius, width: c.width, height: c.height };
   });
   ```
4. **대조 리포트** — 기대 vs 실제를 항목별 표로. 색은 hex 정규화 후 비교, 길이는 ±1px 허용.

## 판정·재시도

| 결과 | 처리 |
|------|------|
| 전 항목 일치(허용오차 내) | 통과 |
| 불일치 항목 존재 | **해당 항목만** 지정해 재생성 (전체 재생성 X) |
| 재시도 2회 초과 잔존 | 중단 → 불일치 리포트를 사용자에게 제시(무한 재시도·비용 폭탄 방지) |

- 색 불일치는 대개 토큰 미스매핑 → `figma-mapping.md` §1로 회귀.
- 길이/gap 불일치는 auto-layout 매핑(§4) 재확인.

## 산출

대조 표(기대·실제·판정)와 통과/불일치 요약을 함께 보고한다. 통과 못한 채로 "완료" 처리하지 않는다.

> 실제 Playwright 게이트 스크립트는 샘플 노드 확보 후 별도 커밋(test)으로 추가. 이 문서는 절차의 단일 진실.
