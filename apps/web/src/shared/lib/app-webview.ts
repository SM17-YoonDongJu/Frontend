import { headers } from "next/headers";
import { isAppWebViewUserAgent } from "./app-webview-token";

export { APP_WEBVIEW_UA_TOKEN } from "./app-webview-token";

/** 현재 요청이 앱 WebView에서 온 요청인지 서버에서 판별한다(UA suffix 검사). */
export async function getIsAppWebView(): Promise<boolean> {
  const userAgent = (await headers()).get("user-agent");
  return userAgent !== null && isAppWebViewUserAgent(userAgent);
}
