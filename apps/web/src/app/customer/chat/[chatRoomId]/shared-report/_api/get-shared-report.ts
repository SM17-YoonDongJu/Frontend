import "@/shared/api/client";
import { getSharedReport as getSharedReportRequest } from "@/shared/api/generated/sdk.gen";
import { sharedReportSchema } from "../_model/shared-report.schema";
import type { SharedReport } from "../_model/shared-report.schema";

// GET /chats/{chatRoomId}/shared-report — 방에 공유된 사정사 검수 결과.
export async function getSharedReport(chatRoomId: string): Promise<SharedReport> {
  const { data } = await getSharedReportRequest({
    throwOnError: true,
    path: { chatRoomId },
  });
  return sharedReportSchema.parse(data);
}
