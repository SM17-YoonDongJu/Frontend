/**
 * 컴파일 타임 드리프트 가드 — 손으로 쓴 zod 응답 스키마의 필드가 hey-api 생성 타입
 * (OpenAPI 명세 기준)에도 존재하는지 확인한다. 값 검증(zod)엔 영향 없이 타입 단계에서만
 * 걸리는 안전장치 — 백엔드가 필드를 빼거나 이름을 바꾸면 여기서 컴파일 에러가 난다.
 * 명세에 없는 FE 전용 확장 필드는 사용부에서 `Exclude`로 미리 빼고 대조한다.
 */
export type AssertFieldsExistInSpec<Ours extends object, Spec extends object> =
  keyof Ours extends keyof Spec ? true : { 명세에_없는_필드: Exclude<keyof Ours, keyof Spec> };

/** AssertFieldsExistInSpec 결과가 true가 아니면 이 타입 자체가 컴파일 에러를 낸다. */
export type ExpectDriftCheck<T extends true> = T;
