#!/usr/bin/env bash
# PostToolUse(Write|Edit) 훅: .ts/.tsx에서 길이값 임의 px(`[Npx]`)를 rem 대신 쓰면 block.
# 규칙 출처: component-build/references/design-tokens.md 「길이값(px→rem)」.
# 오탐 최소화:
#  - 길이 유틸 프리픽스(text/w/h/p/m/gap/leading/tracking/inset/size…)에 붙은 `[Npx]`만 검사.
#  - border/ring/outline/divide 등 얇은 UI 폭은 대상 제외(1px 보더 예외 정신).
#  - `[1px]`(헤어라인)은 허용.
set -euo pipefail

input="$(cat)"
fp="$(printf '%s' "$input" | jq -r '.tool_input.file_path // .tool_response.filePath // empty')"
[ -z "$fp" ] && exit 0

norm="${fp//\\//}"
case "$norm" in
  *.tsx|*.ts) : ;;
  *) exit 0 ;;
esac
[ -f "$norm" ] || exit 0

content="$(cat "$norm")"

# 길이 유틸 프리픽스에 붙은 [Npx] 추출(선행 구분자 필요 → 부분일치 회피)
prefixes='text|leading|tracking|w|h|min-w|max-w|min-h|max-h|size|basis|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|top|right|bottom|left|inset|space-x|space-y'

# 선행 경계에 콜론(`:`) 포함 → variant 스코프(hover:/sm:/dark: 등) 클래스도 탐지
mapfile -t hits < <(printf '%s' "$content" \
  | grep -oE "(^|[[:space:]\"'\`(:])(${prefixes})-\[[0-9]+(\.[0-9]+)?px\]" \
  | grep -oE "(${prefixes})-\[[0-9]+(\.[0-9]+)?px\]" \
  | grep -vE '\[1px\]$' \
  | sort -u || true)

[ ${#hits[@]} -eq 0 ] && exit 0

list=""
for h in "${hits[@]}"; do list="$list"$'\n'" - $h → rem으로 (px÷16). 예: text-[14px]→text-[0.875rem], 또는 Tailwind 스케일 유틸(text-sm 등)"; done

reason="길이값 임의 px 사용 (design-tokens.md 「길이값(px→rem)」 위반):${list}"$'\n'"→ 모든 길이값은 rem(16px=1rem)·Tailwind 스케일 유틸로. \`[Npx]\`는 1px 보더만 예외. 해당 클래스를 고쳐 다시 작성하라."

jq -n --arg r "$reason" '{decision:"block", reason:$r}'
exit 0
