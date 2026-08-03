import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { sharedReportSchema } from "../_model/shared-report.schema";
import type { SharedReport } from "../_model/shared-report.schema";

// GET /chats/{chatRoomId}/shared-report — 방에 공유된 사정사 검수 결과.
export function getSharedReport(chatRoomId: string): Promise<SharedReport> {
  return fetchJson(
    `${API_BASE_URL}/chats/${chatRoomId}/shared-report`,
    sharedReportSchema,
  );
}
