import "@/shared/api/client";
import { deregister } from "@/shared/api/generated/sdk.gen";

export async function deleteDeviceToken(token: string): Promise<void> {
  await deregister({
    throwOnError: true,
    body: { token },
  });
}
