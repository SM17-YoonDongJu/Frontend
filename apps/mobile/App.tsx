import { SafeAreaProvider } from 'react-native-safe-area-context';

import { configureNotifications } from './src/push/push-token';
import { WebViewScreen } from './src/WebViewScreen';

configureNotifications();

export default function App() {
  return (
    <SafeAreaProvider>
      <WebViewScreen />
    </SafeAreaProvider>
  );
}
