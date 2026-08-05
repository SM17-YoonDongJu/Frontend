import "@/shared/api/client";
import { read1 } from "@/shared/api/generated/sdk.gen";

// 개별 알림 읽음 처리(#162, 스웨거 확정). body 없음, 성공 응답 data는 null.
export async function patchNotificationRead(notificationId: string) {
  await read1({
    throwOnError: true,
    path: { notificationId },
  });
}
