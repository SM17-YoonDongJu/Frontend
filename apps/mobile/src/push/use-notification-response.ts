import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';

import { getWebUrl } from '../config/web-url';
import { APP_SCHEME, mapDeepLinkToWebUrl } from '../linking/deep-link';

function resolveDeepLink(data: unknown): string | null {
  if (typeof data !== 'object' || data === null) {
    return null;
  }
  const deepLink = (data as Record<string, unknown>).deepLink;
  if (typeof deepLink !== 'string') {
    return null;
  }
  if (deepLink.startsWith(`${APP_SCHEME}://`)) {
    return mapDeepLinkToWebUrl(deepLink);
  }
  if (deepLink.startsWith('/')) {
    return `${getWebUrl().replace(/\/+$/, '')}${deepLink}`;
  }
  return null;
}

export function useNotificationResponse(onNavigate: (webUrl: string) => void) {
  const handledInitial = useRef(false);

  useEffect(() => {
    if (!handledInitial.current) {
      handledInitial.current = true;
      Notifications.getLastNotificationResponseAsync().then((response) => {
        const webUrl = response
          ? resolveDeepLink(response.notification.request.content.data)
          : null;
        if (webUrl) {
          onNavigate(webUrl);
        }
      });
    }

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const webUrl = resolveDeepLink(response.notification.request.content.data);
      if (webUrl) {
        onNavigate(webUrl);
      }
    });
    return () => subscription.remove();
  }, [onNavigate]);
}
