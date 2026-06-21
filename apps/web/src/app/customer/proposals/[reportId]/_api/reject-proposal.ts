import { z } from "zod";
import { API_BASE_URL } from "@/shared/api/config";
import { fetchJson } from "@/shared/api/fetch-json";

// CONTRACT: 사정사별 거절 엔드포인트 백엔드 신규 요청(사전 §7-5). body 없음, 응답 본문 미확정.
export function rejectProposal(
  reportId: string,
  adjusterId: string,
): Promise<unknown> {
  return fetchJson(
    `${API_BASE_URL}/reports/${reportId}/proposals/${adjusterId}/reject`,
    z.unknown(),
    { method: "PATCH" },
  );
}
