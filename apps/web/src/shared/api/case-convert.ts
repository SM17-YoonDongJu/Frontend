export const toSnakeKey = (key: string): string =>
  key.replace(/([A-Z])/g, "_$1").toLowerCase();

const toCamelKey = (key: string): string =>
  key.replace(/_([a-z0-9])/g, (_, ch: string) => ch.toUpperCase());

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null) return false;
  const proto: unknown = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function convertKeysDeep(
  value: unknown,
  convertKey: (key: string) => string,
): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => convertKeysDeep(item, convertKey));
  }
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        convertKey(key),
        convertKeysDeep(item, convertKey),
      ]),
    );
  }
  return value;
}

/** 서버 응답(snake_case) → FE 모델(camelCase). 이미 camel인 키는 변화 없음. */
export const snakeToCamelDeep = (value: unknown): unknown =>
  convertKeysDeep(value, toCamelKey);

/** FE 요청(camelCase) → 서버 페이로드(snake_case). */
export const camelToSnakeDeep = (value: unknown): unknown =>
  convertKeysDeep(value, toSnakeKey);
