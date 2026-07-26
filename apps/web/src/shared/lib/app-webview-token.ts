// 앱(RN WebView)이 UA에 붙이는 식별 토큰. 모바일 측 상수와 상호 참조:
// apps/mobile/src/config/user-agent.ts (APP_USER_AGENT_SUFFIX = "BareunApp/1.0").
export const APP_WEBVIEW_UA_TOKEN = "BareunApp";

// 앱 딥링크 스킴. 모바일 측 상수와 상호 참조: apps/mobile/src/linking/deep-link.ts (APP_SCHEME).
export const APP_DEEP_LINK_SCHEME = "bareun";

export function isAppWebViewUserAgent(userAgent: string): boolean {
  return userAgent.includes(APP_WEBVIEW_UA_TOKEN);
}
