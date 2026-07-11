/**
 * 이메일 마스킹. 로컬파트 앞 3자만 남기고 나머지는 ***, 도메인은 유지.
 * 로컬파트 3자 미만이면 전부 ***. 예) yunseong@kakao.com → yun***@kakao.com
 */
export function maskEmail(email: string): string {
  const atIndex = email.indexOf("@");
  if (atIndex <= 0) return email;

  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex);
  const visible = local.length >= 3 ? local.slice(0, 3) : "";

  return `${visible}***${domain}`;
}
