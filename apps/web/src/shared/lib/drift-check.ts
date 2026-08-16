/**
 * 컴파일 타임 드리프트 가드 — 손으로 쓴 zod 응답 스키마의 필드가 hey-api 생성 타입
 * (OpenAPI 명세 기준)에도 존재하는지 확인한다. 값 검증(zod)엔 영향 없이 타입 단계에서만
 * 걸리는 안전장치 — 백엔드가 필드를 빼거나 이름을 바꾸면 여기서 컴파일 에러가 난다.
 * 명세에 없는 FE 전용 확장 필드는 사용부에서 `Exclude`로 미리 빼고 대조한다.
 */
/**
 * 스펙 필드명은 와이어 그대로 snake_case이고 FE 모델은 camelCase다.
 * 대조 전에 스펙 키를 camel로 맞춰 같은 축에 놓는다(값이 아니라 키 이름만 본다).
 * 모델까지 snake로 옮기는 작업이 끝나면 이 변환은 항등이 되어 걷어낼 수 있다.
 */
type CamelKey<K> = K extends `${infer Head}_${infer Tail}`
  ? `${Head}${Capitalize<CamelKey<Tail> & string>}`
  : K;

type CamelKeys<T> = { [K in keyof T as CamelKey<K>]: T[K] };

export type AssertFieldsExistInSpec<Ours extends object, Spec extends object> =
  keyof Ours extends keyof CamelKeys<Spec>
    ? true
    : { 명세에_없는_필드: Exclude<keyof Ours, keyof CamelKeys<Spec>> };

/** AssertFieldsExistInSpec 결과가 true가 아니면 이 타입 자체가 컴파일 에러를 낸다. */
export type ExpectDriftCheck<T extends true> = T;
