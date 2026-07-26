import * as Linking from 'expo-linking';
import { useEffect, useRef } from 'react';

import { mapDeepLinkToWebUrl } from './deep-link';

export function useDeepLink(onNavigate: (webUrl: string) => void) {
  const handledInitialUrl = useRef(false);

  useEffect(() => {
    if (!handledInitialUrl.current) {
      handledInitialUrl.current = true;
      Linking.getInitialURL()
        .then((url) => {
          const webUrl = url ? mapDeepLinkToWebUrl(url) : null;
          if (webUrl) {
            onNavigate(webUrl);
          }
        })
        .catch(() => {});
    }

    const subscription = Linking.addEventListener('url', ({ url }) => {
      const webUrl = mapDeepLinkToWebUrl(url);
      if (webUrl) {
        onNavigate(webUrl);
      }
    });
    return () => subscription.remove();
  }, [onNavigate]);
}
