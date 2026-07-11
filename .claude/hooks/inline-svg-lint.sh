#!/usr/bin/env bash
# PostToolUse(Write|Edit) 훅: app 페이지 트리(.tsx)에 로컬 인라인 <svg>가 있으면 block.
# 규칙 출처: figma-design-convert/references/figma-mapping.md §8
#   — 아이콘은 shared/ui/icons에서 재사용/정의, 페이지 로컬 인라인 아이콘 금지(재사용·일관성).
# 대상: apps/web/src/app/** 만. 아이콘 정의처(shared/ui/icons)는 제외.
# 예외: 정당한 비아이콘 svg(차트·일러스트 등)는 파일에 `svg-lint-ignore` 주석으로 통과.
set -euo pipefail

input="$(cat)"
fp="$(printf '%s' "$input" | jq -r '.tool_input.file_path // .tool_response.filePath // empty')"
[ -z "$fp" ] && exit 0

norm="${fp//\\//}"
case "$norm" in
  *.tsx) : ;;
  *) exit 0 ;;
esac
# app 페이지 트리만 대상(shared/ui/icons 등은 자연히 제외)
case "$norm" in
  */apps/web/src/app/*) : ;;
  *) exit 0 ;;
esac
[ -f "$norm" ] || exit 0

content="$(cat "$norm")"

# 이스케이프: svg-lint-ignore 주석 있으면 통과
if printf '%s' "$content" | grep -q 'svg-lint-ignore'; then
  exit 0
fi

# 로컬 인라인 <svg 검출
if ! printf '%s' "$content" | grep -qE '<svg'; then
  exit 0
fi

reason="로컬 인라인 <svg> 사용 (figma-mapping §8 위반): 페이지 컴포넌트에 인라인 아이콘 금지.
→ shared/ui/icons/ 에서 의미로 재사용하거나(예: ChevronLeft·ChevronRight·Send·Bell·User·Check…) 없으면 그곳에 새 아이콘 컴포넌트로 추가하고 import해 쓰라.
→ 크기·색은 className(size-* rem, 색 토큰)으로 지정.
→ 차트·일러스트 등 정당한 비아이콘 svg면 파일에 'svg-lint-ignore' 주석으로 통과."

jq -n --arg r "$reason" '{decision:"block", reason:$r}'
exit 0
