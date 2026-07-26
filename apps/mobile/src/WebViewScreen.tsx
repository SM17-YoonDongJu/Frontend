import { parseWebMessage, serializeToWeb } from '@insurance/bridge/native';
import * as Linking from 'expo-linking';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { getAllowedHosts } from './config/allowed-hosts';
import { APP_USER_AGENT_SUFFIX } from './config/user-agent';
import { getWebUrl } from './config/web-url';
import { createLoadDecider } from './lib/create-should-start-load';
import { useDeepLink } from './linking/use-deep-link';
import { getPushToken } from './push/push-token';

const decideLoad = createLoadDecider(getAllowedHosts());

export function WebViewScreen() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [sourceUri, setSourceUri] = useState(getWebUrl);
  const webReadyRef = useRef(false);

  useDeepLink(setSourceUri);

  const handleWebMessage = (data: string) => {
    const message = parseWebMessage(data);
    if (!message) {
      return;
    }
    if (message.type === 'WEB_READY') {
      webReadyRef.current = true;
      return;
    }
    if (message.type === 'REQUEST_PUSH_TOKEN') {
      getPushToken().then((result) => {
        if (!result || !webReadyRef.current) {
          return;
        }
        webViewRef.current?.injectJavaScript(
          serializeToWeb({ v: 1, type: 'PUSH_TOKEN', payload: result }),
        );
      });
    }
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack) {
        webViewRef.current?.goBack();
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [canGoBack]);

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: sourceUri }}
        applicationNameForUserAgent={APP_USER_AGENT_SUFFIX}
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        allowsBackForwardNavigationGestures
        allowFileAccess
        onMessage={(event) => handleWebMessage(event.nativeEvent.data)}
        onShouldStartLoadWithRequest={(request) => {
          if (decideLoad(request) === 'open-external') {
            Linking.openURL(request.url).catch(() => {});
            return false;
          }
          return true;
        }}
        style={styles.webview}
        onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#15202e" />
          </View>
        )}
        renderError={(_domain, _code, description) => (
          <View style={styles.overlay}>
            <Text style={styles.errorTitle}>웹 화면을 불러올 수 없어요</Text>
            <Text style={styles.errorDescription}>
              웹 서버가 실행 중인지, 기기가 같은 Wi-Fi에 연결됐는지 확인해 주세요.
            </Text>
            <Text style={styles.errorDetail}>{description}</Text>
            <Pressable style={styles.retryButton} onPress={() => webViewRef.current?.reload()}>
              <Text style={styles.retryLabel}>다시 시도</Text>
            </Pressable>
          </View>
        )}
      />
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#15202e',
  },
  errorDescription: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: '#3c4856',
  },
  errorDetail: {
    marginTop: 4,
    fontSize: 12,
    color: '#7b8693',
  },
  retryButton: {
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: '#15202e',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
