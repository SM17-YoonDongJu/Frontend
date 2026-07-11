// 웹 측 감지 토큰과 상호 참조: apps/web/src/shared/lib/app-webview.ts (APP_WEBVIEW_UA_TOKEN = "BareunApp").
// 이 suffix가 WebView UA에 실려 웹이 앱 요청을 SSR 시점에 분기한다.
export const APP_USER_AGENT_SUFFIX = 'BareunApp/1.0';
