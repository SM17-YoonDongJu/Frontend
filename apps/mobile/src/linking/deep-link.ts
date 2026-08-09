import { getWebUrl } from '../config/web-url';

export const APP_SCHEME = 'brbosang';

export function mapDeepLinkToWebUrl(deepLinkUrl: string): string | null {
  const match = deepLinkUrl.match(new RegExp(`^${APP_SCHEME}://(.*)$`));
  if (!match) {
    return null;
  }
  const pathWithQuery = match[1].replace(/^\/+/, '');
  const base = getWebUrl().replace(/\/+$/, '');
  return pathWithQuery ? `${base}/${pathWithQuery}` : base;
}
