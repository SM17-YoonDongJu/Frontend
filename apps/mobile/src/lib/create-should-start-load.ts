export type LoadDecision = 'allow' | 'open-external' | 'open-auth-session';

interface LoadRequest {
  url: string;
  isTopFrame: boolean;
}

export function createLoadDecider(
  allowedHosts: readonly string[],
  externalAuthHosts: readonly string[] = [],
) {
  return function decideLoad({ url, isTopFrame }: LoadRequest): LoadDecision {
    if (!isTopFrame) {
      return 'allow';
    }
    if (url.startsWith('about:')) {
      return 'allow';
    }
    if (!/^https?:\/\//.test(url)) {
      return 'open-external';
    }
    const { host } = new URL(url);
    if (externalAuthHosts.includes(host)) {
      return 'open-auth-session';
    }
    return allowedHosts.includes(host) ? 'allow' : 'open-external';
  };
}
