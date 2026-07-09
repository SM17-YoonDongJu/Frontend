---
name: issue-craft
description: 손해사정 플랫폼 GitHub 이슈 작성 컨벤션. 팀 양식(기능/비기능 두 갈래)·제목 대괄호 태그·라벨·assignee·완료 조건 규칙 + 생성 전 동종 이슈 확인 게이트 + gh --body-file(mojibake 방지). "이슈 만들어", "깃허브 이슈", "이슈 본문/채워", "[Feature] 이슈", "이슈 초안", 작업을 이슈로 등록할 때 반드시 사용.
---

# GitHub 이슈 작성 컨벤션

실제 팀 이슈(#46·#55·#58·#62·#78·#80 등) 본문 구조로 확정. **이 스킬 없이 `.pr-assets/issue-*.md` 초안 파일만 보고 짜지 말 것** — 그건 과거 내가 만든 초안이지 팀 양식이 아니다(#75를 두 번, #79/#80을 잘못된 양식으로 짜서 재작업당한 원인).

## 0. 절대 규칙 — 생성 전 동종 이슈 확인 (건너뛰지 말 것)

이슈를 짜기 전에 **성격이 같은**(기능 vs 비기능) 최근 실제 이슈 1~2개의 본문을 반드시 읽고 그 구조를 복제한다.

```bash
gh issue list --state all --limit 20          # 성격 같은 최근 이슈 찾기
gh issue view <NN> --json title,labels,assignees,body -q '.body'
```

- 기능 화면·페이지·컴포넌트 → 최근 `[Feature]` 이슈(#78·#62·#55) 복제
- 리팩터·정리·인프라·설정 → `[Infra]`(#58) / `[Refactor]`(#80) 복제

## 1. 두 갈래 양식

### A. 기능 이슈 (`[Feature]`)
```markdown
## 설명

<무엇을/누가/왜 — 사용자 관점 1~2문단>. <이 이슈의 범위와 경계(딴 이슈에서 하는 것 명시)>.

- 디자인: [Figma <node-id>](<figma-url>) — <플랫폼(모바일 RN 웹뷰 / web)>

## 작업 목록

### 1. <섹션명(예: 헤더)>
- [ ] <할 일 — 표시 문구·상태·동작 구체적으로>

### 2. <섹션명>
- [ ] ...

### N. 상태 및 예외 처리
- [ ] 로딩 · 빈 · 에러 3상태 처리

## API 연동
- `GET /<path>` — <설명>(🏷 스펙 협의 필요 시 명시, zod + MSW 선반영)
- 전역 응답 봉투 · 에러코드 enum 준수

## 완성 조건
- <사용자 관점 결과문 1 — "~가 보인다/된다">
- <결과문 2>
- 모바일 RN 웹뷰 기준 레이아웃이 깨지지 않는다
```

단골 섹션: **"상태 및 예외 처리"(로딩·빈·에러 3상태)**, 모바일이면 **하단 탭바**, 데이터 있으면 **API 연동**. 완성 조건은 체크박스 없이 결과문 나열도 있고 `- [ ]`도 있음 — 복제한 이슈를 따른다.

### B. 비기능 이슈 (`[Infra]` · `[Refactor]`)
```markdown
## 배경

- <왜 이 작업이 필요한가 — 규칙 위반/기술부채/도입 사유를 불릿으로>

## 작업 항목

### 1. <큰 단위(예: ESLint → oxlint 전환)>

- [ ] <작업 항목>
  - <중첩 서브불릿으로 세부 나열>
  - <파일 경로·룰명·패키지명 구체적으로>

- [ ] <다음 항목>

### 2. <큰 단위>
- [ ] ...

## 완료 조건

- [ ] <검증 가능한 통과 기준 — "lint 통과", "의존성 완전 제거", "CI green">
- [ ] `pnpm typecheck` · lint 통과
- [ ] 런타임 회귀 — <영향 범위 화면들> 정상
```

비기능은 **중첩 서브불릿으로 세부를 촘촘히**(#58·#80). 완료 조건은 `- [ ]`로 검증 가능하게.

## 2. 제목

`[Tag] 한글 제목` — 커밋 스타일(`feat :`)이나 콜론(`Feature :`) 아님. 대괄호 태그.

| 성격 | Tag | 접미사 |
|------|-----|--------|
| 기능 | `[Feature]` | `(app)` / `(web)` / `(web/app)` 플랫폼 명시 |
| 인프라·설정 | `[Infra]` / `[Settings]` | 없음 |
| 리팩터 | `[Refactor]` | 없음 |
| 디자인 셸 | `[Design]` | 대상 명시 |
| 문서 | `[Docs]` | 없음 |

예: `[Feature] 손해사정사 리뷰 남기기 기능 구현` · `[Infra] oxlint 마이그레이션 및 CI 파이프라인 구축` · `[Refactor] 공통 코드 위치 정리 및 참조 경로 개선`

## 3. 라벨 · assignee

- **assignee: `@me`** (=JuJangGwon). `gh issue create --assignee @me`.
- **라벨: `FE` + 성격 라벨** — 태그와 매칭.

| Tag | 라벨 |
|-----|------|
| `[Feature]` | `FE,Feature` |
| `[Infra]` | `FE,Feature` (Infra 라벨 없음 → Feature) |
| `[Refactor]` | `FE,Refactor` |
| `[Design]` | `FE,Design` |
| `[Docs]` | `FE,Docs` |

> 존재하는 라벨: `Epic · FE · Feature · Fix · Settings · Story · Design · Docs · Refactor`. 없는 라벨을 지어내지 말 것. 확신 없으면 `gh label list`로 확인.

## 4. 본문 작성 규칙

- **작업 목록·완료 조건은 실행 가능·검증 가능하게.** 표시 문구는 Figma 그대로("받은 제안" 타이틀 + "…" 안내 문구), 상태·동작·이동 경로를 구체적으로.
- **완성/완료 조건은 사용자 관점 결과문** — "~가 카드 리스트로 보인다", "카드 선택 시 상세 진입점이 연결된다". 구현 방식(모듈명) 나열 금지.
- **범위 경계를 명시** — 이 이슈에서 안 하는 것을 짚어 다른 이슈(#22 등)로 넘긴다.
- 명세 미확정 API는 `🏷 스펙 협의 필요` / `(zod + MSW 선반영)`으로 표기. 임의 경로 생성 금지([[api-spec-notion]] 참고).
- 식별자(필드명·enum)는 naming-dictionary와 정합.

## 5. AI 말투 게이트 (본문 확정 전 필수)

이슈 본문 초안을 잡았으면 **생성 직전 `ai-tell-detector` 에이전트로 한 번 거른다**(번역투·관형절 압축·`~했으며` 이질 접속·`~의` 소유격·상투구 제거). 제외 지시 필수: 개조식 명사 종결, 가운뎃점(·) 나열, 영문 식별자·코드 경로, 이모지 헤더, 체크박스·표·Figma URL은 정상. 실제 어색한 산문 구간만 짚게 한다. 커밋과 동일 정책([[commit-style]] §AI 말투 검사).

## 6. 생성 (gh, Git Bash)

**한글 제목·본문 mojibake 방지로 본문은 반드시 `--body-file`** 사용(PowerShell 아닌 Git Bash에서 `gh` 실행).

```bash
# 1) 본문을 파일로 (레포 밖 임시 또는 .pr-assets/issue-<NN>.md)
cat > /tmp/issue-body.md <<'EOF'
## 설명
...본문...
EOF

# 2) 생성
gh issue create \
  --title "[Feature] <한글 제목>(app)" \
  --body-file /tmp/issue-body.md \
  --label "FE,Feature" \
  --assignee @me
```

- 초안 파일을 `.pr-assets/issue-<NN>.md`에 남겨도 되지만 **그건 팀 양식의 근거가 아님**(§0 게이트는 반드시 실제 이슈로).
- 생성 정책: 본문 초안을 사용자에게 먼저 보여 확인받고 생성한다. "만들어/올려"로 명시 지시하면 바로 생성.

## 7. 실제 예시 (트림 — 톤·디테일 기준)

> 아래는 실제 머지된 이슈를 축약한 것. **본문의 구체성 수준**(표시 문구·상태·이동 경로를 다 박는다)을 기준으로 삼되, 실제 작성 전엔 §0대로 최신 동종 이슈를 `gh view`한다.

### A. 기능 (#78 트림) — 라벨 `FE,Feature` · 제목 `[Feature] …(app)`
```markdown
## 설명

일반 사용자가 요청건별로 받은 제안을 모아 확인하는 **받은 제안 목록** 페이지를 모바일 웹(RN 웹뷰)으로 구현한다. 제안 상세 화면은 #22에서 구현.

- 디자인: [Figma 1007-8102](https://www.figma.com/design/…?node-id=1007-8102) — 모바일(RN 웹뷰)

## 작업 목록

### 1. 헤더
- [ ] "받은 제안" 타이틀 + "분석 요청건별로 도착한 제안을 모아 보여드려요" 안내 문구

### 2. 상태별 제안 카드
- [ ] 제안 도착 — `제안 도착`·`NEW N` 배지, "OOO 외 N명이 제안을 보냈어요", 제안 N건
- [ ] 검수 대기 중 / 종결 문구 표시
- [ ] 카드 선택 시 제안 상세(`/customer/proposals/[reportId]`, #22)로 이동

### 3. 상태 및 예외 처리
- [ ] 로딩 · 빈 · 에러 3상태 처리

## API 연동
- `GET /me/received-proposals` — 대시보드와 분리된 전용 엔드포인트(🏷 스펙 협의 필요, zod + MSW 선반영)
- 전역 응답 봉투 · 에러코드 enum 준수

## 완성 조건
- 요청건별 제안 도착 현황이 카드 리스트로 보인다
- 카드 선택 시 제안 상세(#22) 진입점이 연결된다
- 모바일 RN 웹뷰 기준 레이아웃이 깨지지 않는다
```

### B. 인프라 (#58 트림) — 라벨 `FE,Feature` · 제목 `[Infra] …`(접미사 없음)
```markdown
## 배경
## 작업 항목

### 1. ESLint → oxlint 전환 (apps/web)
- [ ] `apps/web/.oxlintrc.json` 설정
  - plugins: `typescript` · `react` · `nextjs` · `import` · `oxc` · `unicorn`
  - 기존 커스텀 룰 이식: `no-console` · `prefer-const` · `eqeqeq` · `no-unused-vars`
- [ ] `apps/web` lint 스크립트 교체 — `eslint .` → `oxlint`
- [ ] ESLint 설정·devDependencies·`packages/config/eslint` 제거

### 2. CI 구축
- [ ] Playwright 브라우저 캐시 + CI 매트릭스(`chromium`·`mobile-chrome`·`mobile-safari`)
- [ ] `_capture-*.spec.ts` CI 제외

## 완료 조건
- [ ] `pnpm --filter @insurance/web lint`가 oxlint로 통과
- [ ] 레포에서 ESLint 의존성·설정 완전 제거
- [ ] PR 올리면 typecheck / lint / build / E2E 잡이 전부 green
```

### C. 리팩터 (#80 트림) — 라벨 `FE,Refactor` · 제목 `[Refactor] …`(접미사 없음)
```markdown
## 배경
- CLAUDE.md 프렉탈 규칙 위반 — 세그먼트가 다른 세그먼트의 `_internal`을 직접 import하는 경계 침범 2건.

## 작업 항목

### 1. customer↔partner 도메인 교차 해소 (src/shared 승격)
- [ ] 위반 제거 — `partner/review/…ReviewDraftPanel.tsx` → customer `_api` 직접 import
- [ ] 리포트 상세 조회 모듈·zod 스키마 `src/shared/api/`로 승격
- [ ] 소비처 갱신 — `@/shared/api/...`

## 완료 조건
- [ ] 다른 세그먼트 `_internal` 직접 import 0건
- [ ] fractal-boundary-lint · 역방향 의존 훅 통과
- [ ] `pnpm typecheck` · lint 통과
- [ ] 런타임 회귀 — 관련 화면 정상
```

## 관련
[[fe-issue-format]] · [[fe-pr-format]](PR은 대괄호 태그 동일, base=dev) · [[api-spec-notion]] · [[commit-style]]
