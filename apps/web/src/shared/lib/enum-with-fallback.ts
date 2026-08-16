import { z } from "zod";

export const UNKNOWN_ENUM_VALUE = "UNKNOWN";

/**
 * 응답 enum — 명세에 없는 값이 와도 파싱을 실패시키지 않고 UNKNOWN으로 받는다.
 *
 * 백엔드가 상태 값을 추가하면 엄격한 z.enum은 파싱 단계에서 던지고, suspense 쿼리는
 * 콘솔 에러 없이 멈춘 것처럼 보인다(공유 엔드포인트에 CLOSED가 추가됐을 때 겪은 문제).
 * 타입에 UNKNOWN이 남아 화면이 폴백 분기를 반드시 갖게 된다.
 *
 * 요청 body·필터에는 쓰지 않는다 — 우리가 보내는 값은 오타가 컴파일에서 걸려야 한다.
 */
export function enumWithFallback<const T extends readonly [string, ...string[]]>(values: T) {
  const known = new Set<string>(values);
  // 모르는 "문자열"만 UNKNOWN으로 바꾼다. null·undefined·비문자열은 계속 실패해야
  // 필수 필드 누락이나 타입 변경을 파싱 단계에서 잡을 수 있다(catch는 그것까지 삼킨다).
  return z.preprocess(
    (input) => (typeof input === "string" && !known.has(input) ? UNKNOWN_ENUM_VALUE : input),
    z.enum([...values, UNKNOWN_ENUM_VALUE] as unknown as [...T, "UNKNOWN"]),
  );
}
