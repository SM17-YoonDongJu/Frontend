import { getWebUrl } from './web-url';

const OAUTH_HOSTS = ['kauth.kakao.com', 'accounts.kakao.com', 'nid.naver.com', 'appleid.apple.com'];

// WebView 로그인을 차단하는 제공자(구글 등) 추가 시 여기에 호스트 등록 — 외부 브라우저 인증 세션으로 우회
export const EXTERNAL_AUTH_HOSTS: string[] = [];

const IP_OR_LOCALHOST = /^(localhost|\d+\.\d+\.\d+\.\d+)(:\d+)?$/;

// apex·www 양쪽이 리다이렉트 없이 서비스를 응답하므로 둘 다 서비스 호스트로 취급한다.
// 한쪽만 인정하면 나머지로 들어온 링크가 외부 브라우저로 빠지고 서비스 이탈로 오판된다.
export function getServiceHosts(): string[] {
  const host = new URL(getWebUrl()).host;
  if (IP_OR_LOCALHOST.test(host)) {
    return [host];
  }
  return host.startsWith('www.') ? [host, host.slice(4)] : [host, `www.${host}`];
}

export function getAllowedHosts(): string[] {
  return [...getServiceHosts(), ...OAUTH_HOSTS];
}
