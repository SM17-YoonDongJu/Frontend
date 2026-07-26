import {
  nativeToWebMessageSchema,
  type NativeToWebMessage,
  type WebToNativeMessage,
} from './protocol';

interface ReactNativeWebViewHandle {
  postMessage: (message: string) => void;
}

declare global {
  interface Window {
    ReactNativeWebView?: ReactNativeWebViewHandle;
  }
}

export function isBridgeAvailable(): boolean {
  return typeof window !== 'undefined' && window.ReactNativeWebView != null;
}

export function sendToNative(message: WebToNativeMessage): void {
  window.ReactNativeWebView?.postMessage(JSON.stringify(message));
}

export function subscribeToNative(onMessage: (message: NativeToWebMessage) => void): () => void {
  const listener = (event: MessageEvent) => {
    if (typeof event.data !== 'string') {
      return;
    }
    let raw: unknown;
    try {
      raw = JSON.parse(event.data);
    } catch {
      return;
    }
    const parsed = nativeToWebMessageSchema.safeParse(raw);
    if (parsed.success) {
      onMessage(parsed.data);
    }
  };
  window.addEventListener('message', listener);
  document.addEventListener('message', listener as EventListener);
  return () => {
    window.removeEventListener('message', listener);
    document.removeEventListener('message', listener as EventListener);
  };
}
