import { getWebUrl } from './web-url';

const OAUTH_HOSTS = ['kauth.kakao.com', 'accounts.kakao.com', 'nid.naver.com'];

// WebView 로그인을 차단하는 제공자(구글 등) 추가 시 여기에 호스트 등록 — 외부 브라우저 인증 세션으로 우회
export const EXTERNAL_AUTH_HOSTS: string[] = [];

export function getAllowedHosts(): string[] {
  return [new URL(getWebUrl()).host, ...OAUTH_HOSTS];
}
