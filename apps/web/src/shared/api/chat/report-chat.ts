import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";
import { reportChatResponseSchema } from "./chat.schema";
import type { ReportChatBody, ReportChatResponse } from "./chat.schema";

// CONTRACT: 명세없음-초안(#244) — POST /chats/{id}/report. 중복 신고 제한 없음.
export function reportChat(
  chatRoomId: string,
  body: ReportChatBody,
): Promise<ReportChatResponse> {
  return fetchJson(
    `${API_BASE_URL}/chats/${chatRoomId}/report`,
    reportChatResponseSchema,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
}
