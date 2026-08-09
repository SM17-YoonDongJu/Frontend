import "@/shared/api/client";
import { register } from "@/shared/api/generated/sdk.gen";
import { deviceTokenSchema } from "@/shared/model/device-token.schema";
import type {
  DeviceToken,
  RegisterDeviceTokenBody,
} from "@/shared/model/device-token.schema";

export async function registerDeviceToken(
  body: RegisterDeviceTokenBody,
): Promise<DeviceToken> {
  const { data } = await register({
    throwOnError: true,
    body,
  });
  return deviceTokenSchema.parse(data);
}
