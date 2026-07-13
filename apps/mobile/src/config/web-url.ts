import { Platform } from 'react-native';

const DEV_WEB_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  default: 'http://localhost:3000',
});

export function getWebUrl(): string {
  return process.env.EXPO_PUBLIC_WEB_URL ?? DEV_WEB_URL;
}
