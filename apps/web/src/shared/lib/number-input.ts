import type { KeyboardEvent } from "react";

/** number input에서 음수·지수 입력 키 차단(-, +, e, E). */
export function blockNonNumericKeys(e: KeyboardEvent<HTMLInputElement>) {
  if (["-", "+", "e", "E"].includes(e.key)) e.preventDefault();
}

/** input 문자열을 0 이상 정수 또는 null로 변환. */
export function toNonNegativeInt(value: string): number | null {
  if (value === "") return null;
  const n = Math.floor(Number(value));
  return Number.isNaN(n) ? null : Math.max(0, n);
}
