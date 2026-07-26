import { getWebUrl } from './web-url';

const OAUTH_HOSTS = ['kauth.kakao.com', 'accounts.kakao.com', 'nid.naver.com'];

export function getAllowedHosts(): string[] {
  return [new URL(getWebUrl()).host, ...OAUTH_HOSTS];
}
