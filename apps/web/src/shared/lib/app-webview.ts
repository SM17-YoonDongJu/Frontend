import { headers } from "next/headers";

// 앱(RN WebView)이 UA에 붙이는 식별 토큰. 모바일 측 상수와 상호 참조:
// apps/mobile/src/config/user-agent.ts (APP_USER_AGENT_SUFFIX = "BareunApp/1.0").
export const APP_WEBVIEW_UA_TOKEN = "BareunApp";

/** 현재 요청이 앱 WebView에서 온 요청인지 서버에서 판별한다(UA suffix 검사). */
export async function getIsAppWebView(): Promise<boolean> {
  const userAgent = (await headers()).get("user-agent");
  return userAgent?.includes(APP_WEBVIEW_UA_TOKEN) ?? false;
}
