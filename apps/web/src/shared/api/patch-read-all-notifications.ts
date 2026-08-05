import "@/shared/api/client";
import { readAll } from "@/shared/api/generated/sdk.gen";

// 모두 읽음 처리. body 없음, 성공 응답 data는 null.
export async function patchReadAllNotifications() {
  await readAll({
    throwOnError: true,
  });
}
