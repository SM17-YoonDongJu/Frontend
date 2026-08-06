#!/usr/bin/env bash
# PostToolUse(Write|Edit) 훅: 한 파일에 React 컴포넌트 선언이 2개 이상이면 block.
# 규칙 출처: code-conventions/SKILL.md 「파일 구조 — 1파일 1컴포넌트」
#   — export 여부와 무관하게 선언 하나만. 로컬 프리미티브·아이콘·폴백도 형제 파일로.
# 대상: apps/web/src/** 의 .tsx (src/shared 포함). *.stories.tsx는 제외(데모 다중 정의 정상).
# 판정은 정규식이 아니라 oxlint 바이너리(react/no-multi-comp)에 위임한다.
set -euo pipefail

input="$(cat)"
fp="$(printf '%s' "$input" | jq -r '.tool_input.file_path // .tool_response.filePath // empty')"
[ -z "$fp" ] && exit 0

norm="${fp//\\//}"
case "$norm" in
  *.stories.tsx) exit 0 ;;
  *.tsx) : ;;
  *) exit 0 ;;
esac
case "$norm" in
  */apps/web/src/*) : ;;
  *) exit 0 ;;
esac
[ -f "$norm" ] || exit 0

# apps/web 루트 = 대상 경로에서 /src/ 앞부분
web_root="${norm%%/src/*}"
oxlint="$web_root/node_modules/.bin/oxlint"
[ -x "$oxlint" ] || exit 0
[ -f "$web_root/.oxlintrc.json" ] || exit 0

# oxlint 실행 실패(미설치·설정 오류 등)는 무해 통과
out="$("$oxlint" -c "$web_root/.oxlintrc.json" -D react/no-multi-comp --format=unix "$norm" 2>/dev/null)" || true
printf '%s' "$out" | grep -q 'no-multi-comp' || exit 0

found="$(printf '%s' "$out" | grep 'no-multi-comp' | sed -E 's/.*Found: ([A-Za-z0-9_]+).*/\1/' | paste -sd', ' -)"

reason="한 파일에 React 컴포넌트 선언이 2개 이상 (1파일 1컴포넌트 위반): ${found}
→ 같은 디렉토리의 형제 파일로 분리하라(파일명 = 컴포넌트명). export 여부와 무관하게 선언 하나만 둔다.
→ Skeleton·Empty·ErrorFallback 같은 폴백도 형제 파일로 빼면 Boundary가 재사용할 수 있다.
→ 배치는 code-conventions의 배치 결정 트리를 따른다(세그먼트 전용 _components, 2곳+ 공유는 _shared·src/shared 승격).
→ 스토리(*.stories.tsx)는 예외다."

jq -n --arg r "$reason" '{decision:"block", reason:$r}'
exit 0
