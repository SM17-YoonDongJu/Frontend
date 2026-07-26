export type LoadDecision = 'allow' | 'open-external';

interface LoadRequest {
  url: string;
  isTopFrame: boolean;
}

export function createLoadDecider(allowedHosts: readonly string[]) {
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
    return allowedHosts.includes(host) ? 'allow' : 'open-external';
  };
}
