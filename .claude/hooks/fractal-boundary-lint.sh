#!/usr/bin/env bash
# PostToolUse(Write|Edit) 훅: 프렉탈(라우트 코로케이션) 경계 위반 감지 → block.
# 대상: apps/web/src/app/ 아래 .ts/.tsx
# 검사(고신뢰 항목만):
#  A) 역방향 의존 — _api/·_model/ 파일이 _components/·_hooks/ 를 import (데이터층이 UI에 의존)
#  B) 세그먼트 경계 침범 — ../ 로 다른 세그먼트의 프라이빗(_components/_hooks/_api/_model/_pdf)을 직접 import
#     (형제 공유는 _shared 를 거쳐야 함 — _shared 는 허용)
set -euo pipefail

input="$(cat)"
fp="$(printf '%s' "$input" | jq -r '.tool_input.file_path // .tool_response.filePath // empty')"
[ -z "$fp" ] && exit 0

norm="${fp//\\//}"
case "$norm" in
  */apps/web/src/app/*) : ;;
  *) exit 0 ;;
esac
case "$norm" in
  *.ts|*.tsx) : ;;
  *) exit 0 ;;
esac
[ -f "$norm" ] || exit 0

content="$(cat "$norm")"
# import / dynamic import / require 의 소스 경로만 추출
sources="$(printf '%s' "$content" \
  | grep -oE '(from[[:space:]]+|import\(|require\()[[:space:]]*["'"'"'][^"'"'"']+["'"'"']' \
  | grep -oE '["'"'"'][^"'"'"']+["'"'"']' | tr -d '"'"'"'\'"'"'' || true)"

violations=()
priv='_(components|hooks|api|model|pdf)'
rel="${norm##*/apps/web/src/app/}"   # 현재 파일의 app 기준 상대경로 (세그먼트 판별용)

# A) 역방향 의존: 이 파일이 _api/ 또는 _model/ 이고 _components/·_hooks/ 를 import
case "$norm" in
  */_api/*|*/_model/*)
    while IFS= read -r s; do
      [ -z "$s" ] && continue
      if printf '%s' "$s" | grep -qE '/_(components|hooks)/'; then
        violations+=("역방향 의존: 데이터층(_api/_model)이 UI(_components/_hooks)를 import — '$s' (의존 방향은 컴포넌트→훅→_api, 역방향 금지)")
      fi
    done <<< "$sources"
    ;;
esac

# B) 세그먼트 경계 침범: 다른 세그먼트의 프라이빗을 직접 import (_shared 제외)
#    - 상대경로: ../ 로 일반 디렉터리를 거쳐 프라이빗에 닿음 (자기 세그먼트 ../_api 는 허용)
#    - 절대경로: @/app/<세그먼트>/…/_priv 인데 현재 파일이 그 세그먼트 밖
while IFS= read -r s; do
  [ -z "$s" ] && continue
  printf '%s' "$s" | grep -q '/_shared/' && continue
  if printf '%s' "$s" | grep -qE "(\.\./)+([^_./][^/]*/)+${priv}(/|\$)"; then
    violations+=("세그먼트 경계 침범: 다른 세그먼트의 내부 폴더(_components/_hooks/_api/_model/_pdf)를 직접 import — '$s' (형제 공유면 가장 가까운 _shared 로 승격)")
  fi
  # 절대경로 @/app/<세그먼트>/…/_priv — 첫 프라이빗 앞까지를 세그먼트로 보고, 현재 파일이 그 밖이면 위반
  case "$s" in
    @/app/*/_*)
      ap="${s#@/app/}"
      segpref="${ap%%/_*}"
      # "$segpref" 따옴표 필수 — [id]·(group) 등 글로브 문자를 리터럴로 비교(제거 시 오탐)
      if [ "${rel#"$segpref"/}" = "$rel" ]; then
        violations+=("세그먼트 경계 침범: 다른 세그먼트의 내부 폴더를 절대경로(@/app)로 직접 import — '$s' (형제 공유면 가장 가까운 _shared 로 승격)")
      fi
      ;;
  esac
done <<< "$sources"

[ ${#violations[@]} -eq 0 ] && exit 0

reason="프렉탈(라우트 코로케이션) 경계 위반 (code-conventions):"
for v in "${violations[@]}"; do
  reason="$reason"$'\n'" - $v"
done
reason="$reason"$'\n'"→ 코로케이션 규칙대로 배치를 고쳐라: 세그먼트 내부는 직접 쓰지 말고, 형제 2곳+ 공유는 _shared 로 승격, 의존 방향은 컴포넌트→훅→_api."

jq -n --arg r "$reason" '{decision:"block", reason:$r}'
exit 0
