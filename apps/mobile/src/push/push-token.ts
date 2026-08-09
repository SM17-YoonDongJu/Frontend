import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export interface PushTokenResult {
  token: string;
  platform: 'ios' | 'android';
  tokenType: 'expo';
}

export function configureNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

async function ensurePermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) {
    return true;
  }
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function getPushToken(): Promise<PushTokenResult | null> {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return null;
  }
  // Android 13+는 알림 채널이 있어야 권한 프롬프트가 표시된다 — 권한 요청보다 먼저 생성
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: '기본 알림',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  if (!(await ensurePermission())) {
    return null;
  }
  const projectId: string | undefined = Constants.expoConfig?.extra?.eas?.projectId;
  try {
    const { data } = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    return { token: data, platform: Platform.OS, tokenType: 'expo' };
  } catch {
    return null;
  }
}
