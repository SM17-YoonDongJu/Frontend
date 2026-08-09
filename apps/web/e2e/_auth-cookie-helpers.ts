import type { Page } from "@playwright/test";

const ACCESS_TOKEN_COOKIE = "access_token";

type Role = "USER" | "CERTIFICATED_ADJUSTER" | "UNCERTIFICATED_ADJUSTER" | "ADMIN";

function base64url(value: object) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

/**
 * 미들웨어 인증·역할 가드용 더미 access_token 쿠키 주입.
 * MSW는 브라우저 fetch만 가로채 실제 쿠키를 못 남기므로, 미들웨어가 보는
 * 서명 없는 가짜 JWT(header.payload.signature 형태, payload에 role만 유의미)를 직접 심는다.
 * qa-integration의 실서버용 mint.mjs(HMAC 서명)와는 별개 — 여긴 미들웨어 payload read만 통과하면 된다.
 */
export async function setAuthCookie(page: Page, role: Role = "USER") {
  const header = base64url({ alg: "none", typ: "JWT" });
  const payload = base64url({ role });
  const token = `${header}.${payload}.`;

  const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
  await page.context().addCookies([
    { name: ACCESS_TOKEN_COOKIE, value: token, url: baseURL },
  ]);
}
