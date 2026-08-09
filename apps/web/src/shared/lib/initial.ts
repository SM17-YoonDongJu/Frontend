/**
 * 표시명 첫 글자(grapheme 안전). 공백 제거 후 빈 값이면 fallback.
 * 화면별 기본 이니셜('담' 등)은 호출부의 이름 폴백으로 처리하고, 유틸 기본은 "?" 하나로 통일한다.
 */
export function getInitial(name: string | null | undefined, fallback = "?"): string {
  return [...(name ?? "").trim()][0] ?? fallback;
}
