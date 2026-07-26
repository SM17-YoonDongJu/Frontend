import { z } from "zod";

export const deviceTokenPlatformSchema = z.enum(["ANDROID", "IOS", "WEB"]);

export const deviceTokenSchema = z.object({
  id: z.uuid(),
  platform: z.string(),
  createdAt: z.string(),
});

export const registerDeviceTokenBodySchema = z.object({
  token: z.string().max(500),
  platform: deviceTokenPlatformSchema,
});

export type DeviceTokenPlatform = z.infer<typeof deviceTokenPlatformSchema>;
export type DeviceToken = z.infer<typeof deviceTokenSchema>;
export type RegisterDeviceTokenBody = z.infer<typeof registerDeviceTokenBodySchema>;
