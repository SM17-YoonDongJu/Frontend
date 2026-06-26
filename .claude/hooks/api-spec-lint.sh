#!/usr/bin/env bash
# PostToolUse(Write|Edit) 훅: API 파일이 api-spec.md 계약을 어기면 block.
# 대상: **/_api/** , **/mocks/handlers.ts , *.schema.ts
# 검사(고신뢰 항목만 — 오탐으로 정상 작업을 막지 않도록):
#  1) 에러코드 하드코딩이 enum(17종) 밖이면 위반
#  2) MSW handlers.ts에서 4xx/5xx 응답에 code 필드가 전혀 없으면 봉투 누락 의심
set -euo pipefail

input="$(cat)"
fp="$(printf '%s' "$input" | jq -r '.tool_input.file_path // .tool_response.filePath // empty')"
[ -z "$fp" ] && exit 0

# 경로 정규화(백슬래시 → 슬래시)
norm="${fp//\\//}"

is_api=0
case "$norm" in
  */_api/*) is_api=1 ;;
  */mocks/handlers.ts) is_api=1 ;;
  *.schema.ts) is_api=1 ;;
esac
[ "$is_api" -eq 0 ] && exit 0
[ -f "$norm" ] || exit 0

content="$(cat "$norm")"

# api-spec 에러코드 enum (단일 진실)
enum="INVALID_REQUEST VALIDATION_ERROR MISSING_REQUIRED_FIELD UNSUPPORTED_OPERATION \
INVALID_TOKEN EXPIRED_TOKEN LOGIN_REQUIRED FORBIDDEN USER_NOT_FOUND POST_NOT_FOUND \
SUBSCRIPTION_NOT_FOUND DUPLICATE_RESOURCE PAYMENT_FAILED INTERNAL_SERVER_ERROR \
DATABASE_ERROR EXTERNAL_API_ERROR SERVICE_UNAVAILABLE"

violations=()

# 1) code: "..." / "code": "..." 값이 enum 밖이면 위반
while IFS= read -r code; do
  [ -z "$code" ] && continue
  case " $enum " in
    *" $code "*) : ;;
    *) violations+=("에러코드 '$code' 가 api-spec enum에 없음 (오타이거나 명세 외 코드)") ;;
  esac
done < <(printf '%s' "$content" \
  | grep -oE '"?code"?[[:space:]]*:[[:space:]]*["'"'"'][A-Z][A-Z0-9_]+["'"'"']' \
  | grep -oE '[A-Z][A-Z0-9_]+' | grep -vE '^[A-Z]$' || true)

# 2) handlers.ts에서 4xx/5xx 응답인데 code 필드가 전혀 안 보이면 봉투 누락 의심
case "$norm" in
  */mocks/handlers.ts)
    if printf '%s' "$content" | grep -qE '(status[[:space:]]*[:=][[:space:]]*["'"'"']?(4|5)[0-9][0-9])|HttpResponse[^)]*\{[[:space:]]*status:[[:space:]]*(4|5)[0-9][0-9]'; then
      if ! printf '%s' "$content" | grep -qE '"?code"?[[:space:]]*:'; then
        violations+=("4xx/5xx 응답을 모킹하면서 실패 봉투의 'code' 필드가 없음 (api-spec 실패 응답은 {status, code, message})")
      fi
    fi
    ;;
esac

[ ${#violations[@]} -eq 0 ] && exit 0

reason="API 계약 위반 (frontend-feature/references/api-spec.md):"
for v in "${violations[@]}"; do
  reason="$reason"$'\n'" - $v"
done
reason="$reason"$'\n'"→ api-spec.md의 전역 응답 봉투/에러코드 enum을 확인하고 해당 파일을 다시 작성하라."

jq -n --arg r "$reason" '{decision:"block", reason:$r}'
exit 0
