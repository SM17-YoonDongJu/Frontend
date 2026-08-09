import {
  webToNativeMessageSchema,
  type NativeToWebMessage,
  type WebToNativeMessage,
} from './protocol';

export function parseWebMessage(data: string): WebToNativeMessage | null {
  let raw: unknown;
  try {
    raw = JSON.parse(data);
  } catch {
    return null;
  }
  const parsed = webToNativeMessageSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

export function serializeToWeb(message: NativeToWebMessage): string {
  const json = JSON.stringify(JSON.stringify(message));
  return `window.dispatchEvent(new MessageEvent('message', { data: ${json} })); true;`;
}
