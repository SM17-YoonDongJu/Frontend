import { z } from 'zod';

export const BRIDGE_PROTOCOL_VERSION = 1;

export const webReadyMessageSchema = z.object({
  v: z.literal(BRIDGE_PROTOCOL_VERSION),
  type: z.literal('WEB_READY'),
});

export const requestPushTokenMessageSchema = z.object({
  v: z.literal(BRIDGE_PROTOCOL_VERSION),
  type: z.literal('REQUEST_PUSH_TOKEN'),
});

export const pushTokenMessageSchema = z.object({
  v: z.literal(BRIDGE_PROTOCOL_VERSION),
  type: z.literal('PUSH_TOKEN'),
  payload: z.object({
    token: z.string(),
    platform: z.enum(['ios', 'android']),
    tokenType: z.enum(['expo', 'device']),
  }),
});

export const webToNativeMessageSchema = z.discriminatedUnion('type', [
  webReadyMessageSchema,
  requestPushTokenMessageSchema,
]);

export const nativeToWebMessageSchema = z.discriminatedUnion('type', [pushTokenMessageSchema]);

export type WebToNativeMessage = z.infer<typeof webToNativeMessageSchema>;
export type NativeToWebMessage = z.infer<typeof nativeToWebMessageSchema>;
