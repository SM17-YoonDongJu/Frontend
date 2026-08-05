import { z } from "zod";
import { RegisterDeviceTokenRequestSchema } from "@/shared/api/generated/zod.gen";
import type { DeviceTokenResponse } from "@/shared/api/generated/types.gen";
import type { AssertFieldsExistInSpec, ExpectDriftCheck } from "@/shared/lib/drift-check";

export const deviceTokenSchema = z.object({
  id: z.uuid(),
  platform: z.string(),
  createdAt: z.string(),
});

// 생성 스키마 그대로 사용 — token 길이 제약·platform enum 다 일치.
export const registerDeviceTokenBodySchema = RegisterDeviceTokenRequestSchema;

export type DeviceToken = z.infer<typeof deviceTokenSchema>;
export type RegisterDeviceTokenBody = z.infer<typeof registerDeviceTokenBodySchema>;

type _DeviceTokenDriftCheck = ExpectDriftCheck<
  AssertFieldsExistInSpec<DeviceToken, DeviceTokenResponse>
>;
